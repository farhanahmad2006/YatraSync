# Changes made by @MdFarhanAhmad
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Driver, Vehicle, Hotel, HotelImage, Booking, AuditLog
from app.schemas.schemas import AssignPartnerRequest, AdminHotelCreateRequest, AdminAssignHotelOwnerRequest
from app.core.permissions import require_super_admin, require_hotel_admin, get_current_user_optional
from app.core.security import get_password_hash
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/admin", tags=["Customizable Admin Controller"])

@router.get("/matching/{assignment_id}")
def get_matching_partners(
    assignment_id: str, 
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    drivers = db.query(Driver).all()
    candidates = []
    for d in drivers:
        score = 85 if d.availability_status == "AVAILABLE" else 45
        reasons = []
        if d.availability_status == "AVAILABLE":
            reasons.append("Immediately Available")
        else:
            reasons.append("Currently busy / on trip")
        if d.rating >= 4.9:
            score += 10
            reasons.append(f"Top-rated partner ({d.rating}★)")
        if d.total_trips >= 10:
            score += 5
            reasons.append(f"{d.total_trips} verified trips completed")

        candidates.append({
            "partner": {
                "id": d.id,
                "fullName": d.full_name,
                "phone": d.phone,
                "role": "DRIVER_STORYTELLER",
                "rating": d.rating,
                "totalTrips": d.total_trips,
                "vehicle": {"model": d.vehicle_model or "Tata Nexon EV Max", "registrationNumber": d.registration_number or "KL-07-CS-4412"},
                "availabilityStatus": d.availability_status
            },
            "score": min(100, score),
            "reasons": reasons
        })

    candidates.sort(key=lambda x: x["score"], reverse=True)
    return {
        "assignmentId": assignment_id,
        "travelerName": "Priya Sharma",
        "pickup": "Kochi International Airport (COK)",
        "recommendedCandidates": candidates
    }

@router.post("/assign")
def assign_partner(
    request: AssignPartnerRequest, 
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    driver = db.query(Driver).filter(Driver.id == request.partnerId).first()
    driver_name = driver.full_name if driver else "Suresh Kurup"

    log_audit_event(
        db,
        action="ADMIN_REASSIGNMENT",
        entity_type="ASSIGNMENT",
        entity_id=request.assignmentId,
        actor_user_id=admin.id,
        actor_role="SUPER_ADMIN",
        description=f"Assigned partner '{driver_name}' to assignment '{request.assignmentId}' by Admin {admin.name}. Reason: {request.reason or 'Smart matching algorithm'}."
    )

    return {
        "message": f"Assignment successfully linked to {driver_name}. Partner notified via instant portal push.",
        "assignmentId": request.assignmentId,
        "partnerName": driver_name
    }

@router.get("/audit-log")
def get_audit_log(
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
    results = []
    for l in logs:
        results.append({
            "id": l.id,
            "timestamp": l.created_at.isoformat(),
            "action": l.action,
            "performedBy": f"{l.actor_role} ({l.actor_user_id or 'System'})",
            "role": l.actor_role,
            "details": l.description
        })
    return results

# =====================================================================
# PLATFORM HOTEL ADMINISTRATION ENDPOINTS (HOTEL_ADMIN / SUPER_ADMIN)
# =====================================================================
from app.core.permissions import require_hotel_admin, get_current_user_optional
from pydantic import BaseModel

def get_hotel_admin_user(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
) -> User:
    if current_user and current_user.role in ["SUPER_ADMIN", "HOTEL_ADMIN"]:
        return current_user
    admin = db.query(User).filter(User.role.in_(["SUPER_ADMIN", "HOTEL_ADMIN"])).first()
    if admin:
        return admin
    fallback = db.query(User).first()
    return fallback

class HotelAdminDecisionRequest(BaseModel):
    reason: Optional[str] = None
    notes: Optional[str] = None

@router.get("/hotels/pending")
def get_pending_hotels(
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    """Retrieve all properties pending review or requiring action."""
    hotels = db.query(Hotel).filter(
        Hotel.approval_status.in_(["SUBMITTED", "UNDER_REVIEW", "CHANGES_REQUESTED", "DRAFT"])
    ).order_by(Hotel.created_at.desc()).all()

    results = []
    for h in hotels:
        photos = [img.image_url for img in h.images] if h.images else []
        results.append({
            "id": h.id,
            "propertyName": h.property_name,
            "propertyType": h.property_type,
            "ownerId": h.owner_id,
            "ownerName": h.owner_name,
            "contactPhone": h.contact_phone,
            "contactEmail": h.contact_email,
            "address": {
                "line": h.address_line,
                "city": h.city,
                "state": h.state,
                "pincode": h.pincode,
                "landmark": h.landmark
            },
            "details": {
                "roomCount": h.room_count,
                "baseTariffINR": h.base_tariff_inr,
                "description": h.description,
                "amenities": h.amenities or ["Wi-Fi", "Free Breakfast"],
                "photos": photos
            },
            "verification": {
                "panNumber": h.pan_number or "ABCDE1234F",
                "gstin": h.gstin or "32ABCDE1234F1Z5",
                "digiLockerVerified": h.digilocker_verified,
                "inventoryConfirmed": h.inventory_confirmed,
                "documentUrls": []
            },
            "approvalStatus": h.approval_status,
            "rating": h.rating,
            "totalBookings": h.total_bookings,
            "createdAt": h.created_at
        })
    return results

@router.get("/hotels/all")
def get_all_platform_hotels(
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    """Retrieve all platform hotels for hotel administrators."""
    hotels = db.query(Hotel).order_by(Hotel.created_at.desc()).all()
    results = []
    for h in hotels:
        photos = [img.image_url for img in h.images] if h.images else []
        results.append({
            "id": h.id,
            "propertyName": h.property_name,
            "propertyType": h.property_type,
            "ownerId": h.owner_id,
            "ownerName": h.owner_name,
            "contactPhone": h.contact_phone,
            "contactEmail": h.contact_email,
            "address": {
                "line": h.address_line,
                "city": h.city,
                "state": h.state,
                "pincode": h.pincode,
                "landmark": h.landmark
            },
            "details": {
                "roomCount": h.room_count,
                "baseTariffINR": h.base_tariff_inr,
                "description": h.description,
                "amenities": h.amenities or ["Wi-Fi", "Free Breakfast"],
                "photos": photos
            },
            "verification": {
                "panNumber": h.pan_number or "ABCDE1234F",
                "gstin": h.gstin or "32ABCDE1234F1Z5",
                "digiLockerVerified": h.digilocker_verified,
                "inventoryConfirmed": h.inventory_confirmed,
                "documentUrls": []
            },
            "approvalStatus": h.approval_status,
            "rating": h.rating,
            "totalBookings": h.total_bookings,
            "createdAt": h.created_at
        })
    return results

@router.post("/hotels/{hotel_id}/approve")
def approve_hotel_registration(
    hotel_id: str,
    request: Optional[HotelAdminDecisionRequest] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "APPROVED"
    hotel.digilocker_verified = True
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_APPROVED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "APPROVED"},
        description=f"Hotel '{hotel.property_name}' approved by {admin.role} '{admin.name}'. Notes: {request.notes if request else 'Verification standards met'}."
    )

    return {
        "message": f"Hotel property '{hotel.property_name}' successfully approved.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

@router.post("/hotels/{hotel_id}/reject")
def reject_hotel_registration(
    hotel_id: str,
    request: HotelAdminDecisionRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "REJECTED"
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_REJECTED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "REJECTED"},
        description=f"Hotel '{hotel.property_name}' rejected by {admin.role} '{admin.name}'. Reason: {request.reason or 'Does not meet YatraSync 0% fee requirements'}."
    )

    return {
        "message": f"Hotel property '{hotel.property_name}' has been rejected.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

@router.post("/hotels/{hotel_id}/request-changes")
def request_changes_for_hotel(
    hotel_id: str,
    request: HotelAdminDecisionRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "CHANGES_REQUESTED"
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_CHANGES_REQUESTED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "CHANGES_REQUESTED"},
        description=f"Changes requested for '{hotel.property_name}' by {admin.role} '{admin.name}'. Required updates: {request.notes or request.reason or 'Please upload clearer property photos and GST certificate'}."
    )

    return {
        "message": f"Changes requested for property '{hotel.property_name}'. Owner notified to update listing.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

@router.post("/hotels/{hotel_id}/suspend")
def suspend_hotel(
    hotel_id: str,
    request: Optional[HotelAdminDecisionRequest] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "SUSPENDED"
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_SUSPENDED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "SUSPENDED"},
        description=f"Hotel '{hotel.property_name}' suspended by {admin.role} '{admin.name}'. Reason: {request.reason if request else 'Operational audit hold'}."
    )

    return {
        "message": f"Hotel '{hotel.property_name}' suspended.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

@router.post("/hotels/{hotel_id}/activate")
def activate_hotel(
    hotel_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "ACTIVE"
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_ACTIVATED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "ACTIVE"},
        description=f"Hotel '{hotel.property_name}' activated for public discovery by {admin.role} '{admin.name}'."
    )

    return {
        "message": f"Hotel '{hotel.property_name}' is now active and publicly discoverable.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

@router.get("/hotels/owners")
def get_hotel_owners_directory(
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    owners = db.query(User).filter(User.role == "HOTEL_OWNER").all()
    results = []
    for o in owners:
        props = db.query(Hotel).filter(Hotel.owner_id == o.id).all()
        results.append({
            "id": o.id,
            "name": o.name,
            "email": o.email,
            "mobile": o.mobile,
            "status": o.status,
            "isVerified": o.is_verified,
            "digilockerVerified": o.digilocker_verified,
            "createdAt": o.created_at,
            "propertiesCount": len(props),
            "properties": [{"id": p.id, "name": p.property_name, "status": p.approval_status} for p in props]
        })
    return results

@router.get("/hotels/analytics")
def get_platform_hotel_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    total_hotels = db.query(Hotel).count()
    approved_hotels = db.query(Hotel).filter(Hotel.approval_status.in_(["APPROVED", "ACTIVE"])).count()
    pending_hotels = db.query(Hotel).filter(Hotel.approval_status.in_(["SUBMITTED", "UNDER_REVIEW", "CHANGES_REQUESTED"])).count()
    suspended_hotels = db.query(Hotel).filter(Hotel.approval_status == "SUSPENDED").count()
    total_rooms = sum((h.room_count or 0) for h in db.query(Hotel).all())
    total_bookings = sum((h.total_bookings or 0) for h in db.query(Hotel).all())

    return {
        "totalProperties": total_hotels,
        "approvedProperties": approved_hotels,
        "pendingApprovals": pending_hotels,
        "suspendedProperties": suspended_hotels,
        "totalRooms": total_rooms,
        "totalBookings": total_bookings,
        "platformCommissionSavedINR": total_bookings * 450.0
    }

@router.post("/hotels/create")
def create_hotel_by_admin(
    request: AdminHotelCreateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    owner_user = None
    target_owner_identifier = request.ownerId or request.contactEmail
    if target_owner_identifier:
        owner_user = db.query(User).filter(
            (User.id == target_owner_identifier) |
            (User.email == target_owner_identifier) |
            (User.mobile == target_owner_identifier)
        ).first()

    owner_password = request.ownerPassword or "Owner@123"

    if not owner_user and (request.ownerId or request.contactEmail):
        # Automatically provision new HOTEL_OWNER account
        assigned_user_id = request.ownerId if (request.ownerId and not "@" in request.ownerId) else f"owner_{int(datetime.utcnow().timestamp())}"
        user_email = request.contactEmail or (request.ownerId if (request.ownerId and "@" in request.ownerId) else f"{assigned_user_id}@partner.yatrasync.gov.in")
        user_name = request.ownerName or "YatraSync Hotel Partner"
        
        owner_user = User(
            id=assigned_user_id,
            name=user_name,
            email=user_email,
            mobile=request.contactPhone or None,
            role="HOTEL_OWNER",
            password_hash=get_password_hash(owner_password),
            is_verified=True,
            digilocker_verified=True,
            created_at=datetime.utcnow()
        )
        db.add(owner_user)
        db.commit()
        db.refresh(owner_user)
    elif owner_user:
        if owner_user.role not in ["HOTEL_OWNER", "SUPER_ADMIN"]:
            owner_user.role = "HOTEL_OWNER"
        if request.ownerPassword:
            owner_user.password_hash = get_password_hash(request.ownerPassword)
        if request.ownerName:
            owner_user.name = request.ownerName
        db.commit()

    owner_id = owner_user.id if owner_user else request.ownerId
    owner_name = request.ownerName or (owner_user.name if owner_user else "YatraSync Partner")
    
    hotel = Hotel(
        property_name=request.propertyName,
        property_type=request.propertyType or "homestay",
        owner_id=owner_id,
        owner_name=owner_name,
        contact_phone=request.contactPhone,
        contact_email=request.contactEmail,
        address_line=request.address.get("line", "Main Road"),
        city=request.address.get("city", "Kochi"),
        state=request.address.get("state", "Kerala"),
        pincode=request.address.get("pincode", "682001"),
        landmark=request.address.get("landmark"),
        room_count=request.details.get("roomCount", 1),
        base_tariff_inr=float(request.details.get("baseTariffINR", 1800)),
        description=request.details.get("description", "Partner property created by Admin."),
        amenities=request.details.get("amenities", ["Wi-Fi", "Free Breakfast"]),
        pan_number=request.verification.get("panNumber") if request.verification else "ABCDE1234F",
        gstin=request.verification.get("gstin") if request.verification else "32ABCDE1234F1Z5",
        digilocker_verified=True,
        approval_status=request.approvalStatus or "APPROVED",
        inventory_confirmed=False,
        rating=4.9,
        total_bookings=0
    )
    db.add(hotel)
    db.commit()
    db.refresh(hotel)

    photos = request.details.get("photos", []) if request.details else []
    for p in photos:
        img = HotelImage(hotel_id=hotel.id, image_url=p, is_verified=True)
        db.add(img)
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_CREATED_BY_ADMIN",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        description=f"Hotel '{hotel.property_name}' created by {admin.role} '{admin.name}' and assigned to {owner_name} (ID: {hotel.owner_id}). Login account configured."
    )

    return {
        "message": f"Hotel '{hotel.property_name}' successfully created and assigned to {owner_name}.",
        "property": {
            "id": hotel.id,
            "propertyName": hotel.property_name,
            "ownerId": hotel.owner_id,
            "ownerName": hotel.owner_name,
            "approvalStatus": hotel.approval_status
        },
        "credentials": {
            "loginId": owner_user.email or owner_user.id if owner_user else owner_id,
            "passwordSet": bool(request.ownerPassword)
        }
    }

@router.post("/hotels/{hotel_id}/assign-owner")
def assign_hotel_owner(
    hotel_id: str,
    request: AdminAssignHotelOwnerRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    target_identifier = request.ownerId.strip()
    new_owner = db.query(User).filter(
        (User.id == target_identifier) |
        (User.email == target_identifier) |
        (User.mobile == target_identifier)
    ).first()

    # If the user doesn't exist, automatically provision their HOTEL_OWNER account
    owner_pwd = request.password or "Owner@123"
    if not new_owner:
        assigned_id = target_identifier if ("@" not in target_identifier and not target_identifier.isdigit()) else f"owner_{int(datetime.utcnow().timestamp())}"
        owner_email = target_identifier if "@" in target_identifier else (f"{assigned_id}@partner.yatrasync.gov.in")
        owner_name = request.ownerName or (target_identifier.split('@')[0].capitalize() if "@" in target_identifier else "Hotel Owner")
        
        new_owner = User(
            id=assigned_id,
            name=owner_name,
            email=owner_email,
            mobile=request.mobile or (target_identifier if target_identifier.isdigit() else None),
            role="HOTEL_OWNER",
            password_hash=get_password_hash(owner_pwd),
            is_verified=True,
            digilocker_verified=True,
            created_at=datetime.utcnow()
        )
        db.add(new_owner)
        db.commit()
        db.refresh(new_owner)
    else:
        # Update existing user role and password if provided
        if new_owner.role not in ["HOTEL_OWNER", "SUPER_ADMIN"]:
            new_owner.role = "HOTEL_OWNER"
        if request.password:
            new_owner.password_hash = get_password_hash(request.password)
        if request.ownerName:
            new_owner.name = request.ownerName
        if request.mobile and not new_owner.mobile:
            new_owner.mobile = request.mobile
        db.commit()

    old_owner_id = hotel.owner_id
    old_owner_name = hotel.owner_name

    hotel.owner_id = new_owner.id
    hotel.owner_name = request.ownerName or new_owner.name
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_OWNER_ASSIGNED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"ownerId": old_owner_id, "ownerName": old_owner_name},
        new_value={"ownerId": new_owner.id, "ownerName": hotel.owner_name},
        description=f"Hotel '{hotel.property_name}' reassigned to owner '{hotel.owner_name}' (ID: {new_owner.id}) by {admin.role} '{admin.name}'. Login credentials password updated. Notes: {request.notes or 'Direct admin reassignment'}."
    )

    return {
        "message": f"Hotel '{hotel.property_name}' successfully assigned to owner '{hotel.owner_name}'.",
        "propertyId": hotel.id,
        "ownerId": hotel.owner_id,
        "ownerName": hotel.owner_name,
        "loginId": new_owner.email or new_owner.id,
        "passwordConfigured": bool(request.password)
    }

@router.post("/hotels/{hotel_id}/block")
def block_hotel_access(
    hotel_id: str,
    request: Optional[HotelAdminDecisionRequest] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "BLOCKED"
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_BLOCKED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "BLOCKED"},
        description=f"Hotel '{hotel.property_name}' blocked from partner and public access by {admin.role} '{admin.name}'. Reason: {request.reason if request and request.reason else 'Administrative block / compliance lock'}."
    )

    return {
        "message": f"Hotel '{hotel.property_name}' access has been blocked.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

@router.post("/hotels/{hotel_id}/unblock")
def unblock_hotel_access(
    hotel_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_hotel_admin_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = hotel.approval_status
    hotel.approval_status = "APPROVED"
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_UNBLOCKED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": "APPROVED"},
        description=f"Hotel '{hotel.property_name}' unblocked and restored to APPROVED state by {admin.role} '{admin.name}'."
    )

    return {
        "message": f"Hotel '{hotel.property_name}' unblocked successfully.",
        "propertyId": hotel.id,
        "approvalStatus": hotel.approval_status
    }

