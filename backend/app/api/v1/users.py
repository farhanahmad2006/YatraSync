# Changes made by @MdFarhanAhmad
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.schemas import UserResponse
from app.core.permissions import require_super_admin
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/users", tags=["Users Management"])

@router.get("", response_model=List[UserResponse])
def list_users(
    search: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    query = db.query(User)
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (User.mobile.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )
    if role:
        query = query.filter(User.role == role.upper())
    if status:
        query = query.filter(User.status == status.upper())

    users = query.offset(skip).limit(limit).all()
    return users

@router.put("/{user_id}/status")
def update_user_status(
    user_id: str,
    status_value: str, # ACTIVE, SUSPENDED
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    old_status = user.status
    user.status = status_value.upper()
    db.commit()

    log_audit_event(
        db,
        action="USER_STATUS_CHANGE",
        entity_type="USER",
        entity_id=user.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"status": old_status},
        new_value={"status": user.status},
        description=f"User {user.name} status updated from {old_status} to {user.status}"
    )

    return {"message": f"User status updated to {user.status}", "user_id": user.id, "status": user.status}

@router.put("/{user_id}/role")
def update_user_role(
    user_id: str,
    new_role: str, # SUPER_ADMIN, HOTEL_ADMIN, TRANSPORT_ADMIN, CUSTOMER
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    old_role = user.role
    user.role = new_role.upper()
    db.commit()

    log_audit_event(
        db,
        action="USER_ROLE_CHANGE",
        entity_type="USER",
        entity_id=user.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"role": old_role},
        new_value={"role": user.role},
        description=f"User {user.name} role changed from {old_role} to {user.role}"
    )

    return {"message": f"User role updated to {user.role}", "user_id": user.id, "role": user.role}
