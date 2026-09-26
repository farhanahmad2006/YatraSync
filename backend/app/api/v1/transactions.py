# Changes made by @MdFarhanAhmad
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Transaction, User
from app.core.permissions import get_current_user_optional, require_super_admin

router = APIRouter(prefix="/transactions", tags=["Transaction Management"])

@router.get("", response_model=List[dict])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Transaction)
    if current_user and current_user.role == "CUSTOMER":
        query = query.filter(Transaction.customer_id == current_user.id)

    txns = query.order_by(Transaction.created_at.desc()).all()
    results = []
    for t in txns:
        results.append({
            "id": t.id,
            "transactionReference": t.transaction_reference,
            "bookingId": t.booking_id,
            "amount": t.amount,
            "tax": t.tax,
            "fee": t.fee,
            "discount": t.discount,
            "totalAmount": t.total_amount,
            "currency": t.currency,
            "paymentMethod": t.payment_method,
            "paymentGateway": t.payment_gateway,
            "gatewayTransactionId": t.gateway_transaction_id,
            "status": t.status,
            "createdAt": t.created_at.isoformat()
        })
    return results
