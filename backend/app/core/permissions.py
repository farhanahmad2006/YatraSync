# Changes made by @MdFarhanAhmad
from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user

def get_current_user(
    user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided or valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.status == "SUSPENDED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended by system administrator."
        )
    return user

class RequireRoles:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        # SUPER_ADMIN always has full privileges
        if current_user.role == "SUPER_ADMIN":
            return current_user
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not authorized to access this resource."
            )
        return current_user

from app.services.rbac_service import user_has_permission, get_user_permissions

def require_super_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super Admin privileges required."
        )
    return current_user

def require_hotel_admin(current_user: User = Depends(get_current_user)) -> User:
    """Strict Hotel Admin operational role (does not automatically inherit owner privileges)."""
    if current_user.role not in ["SUPER_ADMIN", "HOTEL_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hotel Admin operational privileges required."
        )
    return current_user

def require_hotel_owner(current_user: User = Depends(get_current_user)) -> User:
    """Strict Hotel Owner property management role."""
    if current_user.role not in ["SUPER_ADMIN", "HOTEL_OWNER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hotel Owner property management privileges required."
        )
    return current_user

def require_hotel_owner_or_admin(current_user: User = Depends(get_current_user)) -> User:
    """Only for explicitly shared read/inventory views."""
    if current_user.role not in ["SUPER_ADMIN", "HOTEL_OWNER", "HOTEL_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hotel Partner/Owner privileges required."
        )
    return current_user

def require_permission(permission_code: str):
    """FastAPI Dependency factory enforcing granular RBAC permission checks."""
    def permission_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
    ) -> User:
        if current_user.role == "SUPER_ADMIN":
            return current_user
        if not user_has_permission(db, current_user, permission_code):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Missing required permission '{permission_code}'."
            )
        return current_user
    return permission_checker

def verify_hotel_ownership(hotel, current_user: User) -> None:
    """Ensure user is SUPER_ADMIN or owns the specific hotel property and the property is not blocked/suspended."""
    if current_user.role == "SUPER_ADMIN":
        return
    if current_user.role != "HOTEL_OWNER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Hotel Owner role required for property management."
        )
    if not hotel.owner_id or hotel.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not own this hotel property."
        )
    if getattr(hotel, "approval_status", "") in ["SUSPENDED", "BLOCKED"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: This hotel property has been blocked/suspended by the administrator."
        )

def require_transport_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["SUPER_ADMIN", "TRANSPORT_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Transport Admin privileges required."
        )
    return current_user

def require_tour_operator(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["SUPER_ADMIN", "TOUR_OPERATOR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tour Operator privileges required."
        )
    return current_user


