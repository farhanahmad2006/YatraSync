# Changes made by @MdFarhanAhmad
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Notification, User
from app.core.permissions import get_current_user_optional

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[dict])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        return [
            {
                "id": "notif-1",
                "title": "Welcome to YatraSync",
                "message": "Explore 0% commission homestays and verified Indian rental vehicles across all 28 states.",
                "type": "INFO",
                "isRead": False,
                "createdAt": "Just now"
            }
        ]

    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    results = []
    for n in notifs:
        results.append({
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "isRead": n.is_read,
            "createdAt": n.created_at.isoformat()
        })
    return results
