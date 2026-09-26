# Changes made by @MdFarhanAhmad
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import AuditLog

def log_audit_event(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: str = None,
    actor_user_id: str = None,
    actor_role: str = "SYSTEM",
    old_value: dict = None,
    new_value: dict = None,
    description: str = "",
    ip_address: str = None
):
    audit_entry = AuditLog(
        actor_user_id=actor_user_id,
        actor_role=actor_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        old_value_json=old_value,
        new_value_json=new_value,
        description=description,
        ip_address=ip_address,
        created_at=datetime.utcnow()
    )
    db.add(audit_entry)
    db.commit()
    return audit_entry
