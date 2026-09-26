# Changes made by @MdFarhanAhmad
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Cart, CartItem, User
from app.schemas.schemas import AddToCartRequest
from app.core.permissions import get_current_user_optional, get_current_user
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/cart", tags=["Cart System"])

def get_or_create_cart(db: Session, customer_id: Optional[str]) -> Cart:
    if not customer_id or customer_id == "guest-cart-user":
        guest_user = db.query(User).filter(User.id == "guest-cart-user").first()
        if not guest_user:
            guest_user = User(
                id="guest-cart-user",
                name="Guest Traveler",
                mobile="+91 00000 00000",
                role="CUSTOMER",
                status="ACTIVE"
            )
            db.add(guest_user)
            db.commit()
        customer_id = guest_user.id

    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if not cart:
        cart = Cart(customer_id=customer_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.get("")
def get_cart(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else "guest-cart-user"
    cart = get_or_create_cart(db, user_id)
    
    items_list = []
    subtotal = 0.0
    for item in cart.items:
        item_total = item.price_snapshot * item.quantity
        subtotal += item_total
        items_list.append({
            "id": item.id,
            "serviceType": item.service_type,
            "itemData": item.item_data_json,
            "priceSnapshot": item.price_snapshot,
            "quantity": item.quantity,
            "startDate": item.start_date,
            "endDate": item.end_date,
            "total": item_total
        })

    tax_gst = round(subtotal * 0.18, 2)
    grand_total = round(subtotal + tax_gst, 2)

    return {
        "cartId": cart.id,
        "items": items_list,
        "subtotal": subtotal,
        "taxGst": tax_gst,
        "grandTotal": grand_total,
        "itemCount": len(items_list)
    }

@router.post("/items")
def add_to_cart(
    request: AddToCartRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else "guest-cart-user"
    cart = get_or_create_cart(db, user_id)

    item = CartItem(
        cart_id=cart.id,
        service_type=request.service_type.upper(),
        item_data_json=request.item_data,
        price_snapshot=request.price_snapshot,
        quantity=request.quantity,
        start_date=request.start_date,
        end_date=request.end_date
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    log_audit_event(
        db,
        action="CART_ADD_ITEM",
        entity_type="CART",
        entity_id=cart.id,
        actor_user_id=current_user.id if current_user else None,
        actor_role=current_user.role if current_user else "CUSTOMER",
        description=f"Added service {request.service_type} to cart (price: ₹{request.price_snapshot})."
    )

    return {"message": "Item added to cart", "itemId": item.id}

@router.delete("/items/{item_id}")
def remove_from_cart(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

@router.delete("/clear")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else "guest-cart-user"
    cart = get_or_create_cart(db, user_id)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
