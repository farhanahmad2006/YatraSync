# Changes made by @MdFarhanAhmad
import re
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, OTPVerificationSession, Hotel, Driver
from app.schemas.schemas import (
    UserLoginRequest, 
    UserRegisterRequest, 
    ChangePasswordRequest,
    TokenResponse, 
    UserResponse,
    OTPChallengeRequest,
    OTPChallengeResponse
)
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.permissions import get_current_user
from app.core.config import settings
from app.services.audit_service import log_audit_event
from app.services.rbac_service import get_user_permissions

router = APIRouter(prefix="/auth", tags=["Authentication"])

def normalize_phone(phone: str) -> str:
    """Strip spaces, hyphens, plus and return trailing 10 digits if standard Indian mobile."""
    if not phone:
        return ""
    digits = re.sub(r"\D", "", phone.strip())
    if len(digits) > 10 and digits.startswith("91"):
        digits = digits[2:]
    return digits

def find_user_by_credential(db: Session, credential: str) -> Optional[User]:
    """Find a user by User ID, email (case-insensitive), exact mobile, or normalized mobile."""
    if not credential:
        return None
    cred_clean = credential.strip()
    if not cred_clean:
        return None

    # 1. Exact match by User ID, email, or exact mobile
    user = db.query(User).filter(
        (User.id == cred_clean) |
        (User.email == cred_clean.lower()) |
        (User.email == cred_clean) |
        (User.mobile == cred_clean)
    ).first()
    if user:
        return user

    # 2. Match by normalized mobile digits
    digits = normalize_phone(cred_clean)
    if digits and len(digits) >= 10:
        all_users = db.query(User).all()
        for u in all_users:
            if u.mobile and normalize_phone(u.mobile) == digits:
                return u
    return None

def get_or_create_otp_session(
    db: Session, 
    phone_or_email: str, 
    purpose: str = "LOGIN", 
    role: Optional[str] = None,
    session_id: Optional[str] = None
) -> OTPVerificationSession:
    if session_id:
        session = db.query(OTPVerificationSession).filter(OTPVerificationSession.id == session_id).first()
        if session:
            return session

    now = datetime.utcnow()
    # Search for an existing active PENDING session created within last 10 minutes
    session = db.query(OTPVerificationSession).filter(
        OTPVerificationSession.mobile_or_email == phone_or_email,
        OTPVerificationSession.purpose == purpose,
        OTPVerificationSession.status == "PENDING",
        OTPVerificationSession.expires_at > now
    ).order_by(OTPVerificationSession.created_at.desc()).first()

    if not session:
        user = find_user_by_credential(db, phone_or_email)
        server_role = user.role.upper() if user else (role.upper() if role else "CUSTOMER")
        
        session = OTPVerificationSession(
            mobile_or_email=phone_or_email,
            user_id=user.id if user else None,
            purpose=purpose,
            role=server_role,
            attempt_count=0,
            max_attempts=3,
            status="PENDING",
            expires_at=now + timedelta(minutes=10)
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        log_audit_event(
            db, 
            action="OTP_REQUESTED", 
            entity_type="OTP_SESSION", 
            entity_id=session.id, 
            description=f"OTP session requested for {phone_or_email} ({purpose})"
        )
    return session

def validate_and_consume_otp(
    db: Session,
    phone_or_email: str,
    entered_otp: Optional[str],
    purpose: str = "LOGIN",
    session_id: Optional[str] = None,
    requested_role: Optional[str] = None
) -> OTPVerificationSession:
    now = datetime.utcnow()
    
    # 1. Fetch OTP session
    session = None
    if session_id:
        session = db.query(OTPVerificationSession).filter(OTPVerificationSession.id == session_id).first()
    
    if not session:
        session = db.query(OTPVerificationSession).filter(
            OTPVerificationSession.mobile_or_email == phone_or_email,
            OTPVerificationSession.purpose == purpose,
            OTPVerificationSession.status == "PENDING",
            OTPVerificationSession.expires_at > now
        ).order_by(OTPVerificationSession.created_at.desc()).first()

    if not session:
        session = get_or_create_otp_session(db, phone_or_email, purpose=purpose, role=requested_role)

    # 2. Check session state
    if session.status == "VERIFIED":
        raise HTTPException(
            status_code=400,
            detail="Enter the correct otp"
        )

    if session.status in ["LOCKED", "FAILED"] or session.attempt_count >= session.max_attempts:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error_code": "OTP_ATTEMPTS_EXCEEDED",
                "detail": "Enter the correct otp",
                "message": "OTP verification session expired. Please start again."
            }
        )

    if session.expires_at < now:
        session.status = "EXPIRED"
        db.commit()
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error_code": "OTP_SESSION_EXPIRED",
                "detail": "Enter the correct otp",
                "message": "OTP verification session expired. Please start again."
            }
        )

    # 3. Determine Server-Side User Role (Backend Security Rule)
    user = find_user_by_credential(db, phone_or_email)

    if user:
        server_role = user.role.upper()
    else:
        # For new registration, prevent self-provisioning of SUPER_ADMIN
        if requested_role and requested_role.upper() == "SUPER_ADMIN":
            server_role = "CUSTOMER"
        else:
            server_role = requested_role.upper() if requested_role else "CUSTOMER"

    session.role = server_role

    # 4. Environment Check & Master OTP Selection
    if settings.APP_ENV == "production":
        session.attempt_count += 1
        if session.attempt_count >= session.max_attempts:
            session.status = "LOCKED"
        db.commit()
        raise HTTPException(status_code=400, detail="Enter the correct otp")

    if server_role == "SUPER_ADMIN":
        expected_otp = settings.SUPERADMIN_MASTER_OTP
    else:
        expected_otp = settings.NON_SUPERADMIN_MASTER_OTP

    # 5. OTP Evaluation & Attempt Incrementing
    if not entered_otp or entered_otp != expected_otp:
        session.attempt_count += 1
        session.updated_at = now
        log_audit_event(
            db, 
            action="OTP_VERIFY_FAILED", 
            entity_type="OTP_SESSION", 
            entity_id=session.id, 
            description=f"OTP verification failed for {phone_or_email} (attempt {session.attempt_count}/{session.max_attempts})"
        )

        if session.attempt_count >= session.max_attempts:
            session.status = "LOCKED"
            db.commit()
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error_code": "OTP_ATTEMPTS_EXCEEDED",
                    "detail": "Enter the correct otp",
                    "message": "OTP verification session expired. Please start again."
                }
            )
        else:
            db.commit()
            raise HTTPException(
                status_code=400,
                detail="Enter the correct otp"
            )

    # 6. Success
    session.status = "VERIFIED"
    session.verified_at = now
    db.commit()
    log_audit_event(
        db, 
        action="OTP_VERIFY_SUCCESS", 
        entity_type="OTP_SESSION", 
        entity_id=session.id, 
        description=f"OTP verification succeeded for {phone_or_email}"
    )
    return session


@router.post("/request-otp", response_model=OTPChallengeResponse)
def request_otp(request: OTPChallengeRequest, db: Session = Depends(get_db)):
    session = get_or_create_otp_session(
        db, 
        phone_or_email=request.phone_or_email, 
        purpose=request.purpose or "LOGIN", 
        role=request.role
    )
    return {
        "session_id": session.id,
        "phone_or_email": session.mobile_or_email,
        "purpose": session.purpose,
        "expires_at": session.expires_at,
        "message": "OTP verification challenge initiated."
    }


@router.post("/login", response_model=TokenResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    user = find_user_by_credential(db, request.phone_or_email)

    # 1. Password-based authentication
    if request.password:
        if not user or not user.password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid login credentials. Please check your email/mobile and password."
            )
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid login credentials. Please check your email/mobile and password."
            )
        if user.status == "SUSPENDED":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account suspended by system administrator.")

        hotel = db.query(Hotel).filter(Hotel.owner_id == user.id).first()
        driver = db.query(Driver).filter(Driver.user_id == user.id).first()
        token = create_access_token(subject=user.id, role=user.role)
        log_audit_event(db, action="USER_LOGIN_PWD", entity_type="USER", entity_id=user.id, actor_user_id=user.id, actor_role=user.role, description=f"User logged in via password: {user.name} ({user.email or user.mobile})")

        permissions = get_user_permissions(db, user)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "phone": user.mobile,
                "email": user.email,
                "role": user.role.upper(),
                "operatorSubRole": user.operator_sub_role,
                "hotelPropertyId": hotel.id if hotel else None,
                "partnerId": driver.id if driver else None,
                "permissions": permissions,
                "is_verified": user.is_verified,
                "digilocker_verified": user.digilocker_verified
            }
        }

    # 2. OTP-based authentication
    if not request.otp and not request.session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password or OTP is required for sign in."
        )

    validate_and_consume_otp(
        db, 
        phone_or_email=request.phone_or_email, 
        entered_otp=request.otp, 
        purpose="LOGIN",
        session_id=request.session_id
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email or mobile number. Please register first."
        )

    if user.status == "SUSPENDED":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account suspended by system administrator.")

    hotel = db.query(Hotel).filter(Hotel.owner_id == user.id).first()
    driver = db.query(Driver).filter(Driver.user_id == user.id).first()
    token = create_access_token(subject=user.id, role=user.role)
    log_audit_event(db, action="USER_LOGIN_OTP", entity_type="USER", entity_id=user.id, actor_user_id=user.id, actor_role=user.role, description=f"User logged in via OTP: {user.name}")

    permissions = get_user_permissions(db, user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.mobile,
            "email": user.email,
            "role": user.role.upper(),
            "operatorSubRole": user.operator_sub_role,
            "hotelPropertyId": hotel.id if hotel else None,
            "partnerId": driver.id if driver else None,
            "permissions": permissions,
            "is_verified": user.is_verified,
            "digilocker_verified": user.digilocker_verified
        }
    }


@router.post("/register", response_model=TokenResponse)
def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    clean_phone = request.phone.strip()
    clean_email = request.email.strip().lower() if request.email else None
    
    # 1. Execute OTP validation if OTP was provided or required
    if request.otp or request.session_id:
        validate_and_consume_otp(
            db, 
            phone_or_email=clean_phone or clean_email, 
            entered_otp=request.otp, 
            purpose="REGISTRATION",
            session_id=request.session_id,
            requested_role=request.role
        )

    # 2. Check for existing user with identical mobile or email
    if clean_phone:
        existing_phone = find_user_by_credential(db, clean_phone)
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this mobile number already exists. Please sign in instead."
            )

    if clean_email:
        existing_email = db.query(User).filter(User.email == clean_email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists. Please sign in instead."
            )

    # 3. Restrict self-registration: Partner and Admin accounts CANNOT self-register
    req_role = request.role.upper() if request.role else "CUSTOMER"
    if req_role in ["HOTEL_OWNER", "TRANSPORT_ADMIN", "HOTEL_ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Partner and Administrator accounts cannot self-register. Credentials must be provisioned and assigned by a Platform Administrator."
        )

    assigned_role = "CUSTOMER"
    new_user = User(
        name=request.name.strip(),
        mobile=clean_phone,
        email=clean_email,
        password_hash=get_password_hash(request.password) if request.password else None,
        role=assigned_role,
        operator_sub_role=request.operator_sub_role,
        is_verified=True,
        digilocker_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id, role=new_user.role)
    log_audit_event(db, action="USER_REGISTER", entity_type="USER", entity_id=new_user.id, actor_user_id=new_user.id, actor_role=new_user.role, description=f"New user registered: {new_user.name} ({new_user.email or new_user.mobile}) as {new_user.role}")

    permissions = get_user_permissions(db, new_user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "phone": new_user.mobile,
            "email": new_user.email,
            "role": new_user.role.upper(),
            "operatorSubRole": new_user.operator_sub_role,
            "hotelPropertyId": None,
            "partnerId": None,
            "permissions": permissions,
            "is_verified": new_user.is_verified,
            "digilocker_verified": new_user.digilocker_verified
        }
    }


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Allows authenticated partners and travelers to update their password."""
    if not current_user.password_hash or not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect. Please verify and try again."
        )

    if len(request.new_password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long."
        )

    current_user.password_hash = get_password_hash(request.new_password.strip())
    db.commit()

    log_audit_event(
        db,
        action="USER_PASSWORD_CHANGED",
        entity_type="USER",
        entity_id=current_user.id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"User {current_user.name} ({current_user.email or current_user.mobile}) changed their password."
    )
    return {"status": "SUCCESS", "message": "Password changed successfully."}


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    hotel = db.query(Hotel).filter(Hotel.owner_id == current_user.id).first()
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    permissions = get_user_permissions(db, current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "phone": current_user.mobile,
        "email": current_user.email,
        "role": current_user.role.upper(),
        "operatorSubRole": current_user.operator_sub_role,
        "hotelPropertyId": hotel.id if hotel else None,
        "partnerId": driver.id if driver else None,
        "permissions": permissions,
        "status": current_user.status,
        "is_verified": current_user.is_verified,
        "digilocker_verified": current_user.digilocker_verified,
        "created_at": current_user.created_at
    }
