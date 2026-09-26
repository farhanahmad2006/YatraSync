# Changes made by @MdFarhanAhmad
from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Booking, Transaction, User, RoomType, Hotel, RoomBookingItem
from app.schemas.schemas import CreateBookingRequest
from app.core.permissions import get_current_user_optional, get_current_user
from app.services.audit_service import log_audit_event
from app.services.availability_service import (
    calculate_room_type_availability,
    calculate_hotel_availability,
    parse_date_flexible,
    extract_dates_from_text
)
from app.websocket.ws_manager import ws_manager

router = APIRouter(prefix="/bookings", tags=["Booking Management"])

@router.get("", response_model=List[dict])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        return []
    query = db.query(Booking)
    if current_user.role == "CUSTOMER":
        query = query.filter(Booking.customer_id == current_user.id)
    elif current_user.role in ["HOTEL_OWNER", "HOTEL_ADMIN"]:
        # Hotel owners/admins only see bookings relating to their properties
        owner_hotels = db.query(Hotel).filter(Hotel.owner_id == current_user.id).all()
        hotel_names = [h.property_name.lower() for h in owner_hotels]
        all_bookings = query.order_by(Booking.created_at.desc()).all()
        filtered = []
        for b in all_bookings:
            stay_name = (b.stay_details_json.get("name") if isinstance(b.stay_details_json, dict) else (b.stay_details_json or "")).lower()
            if any(hn in stay_name or stay_name in hn for hn in hotel_names):
                filtered.append(b)
        bookings = filtered
        results = []
        for b in bookings:
            results.append({
                "id": b.id,
                "pnr": b.pnr,
                "origin": b.origin,
                "destinationKey": b.destination_key,
                "destinationName": b.destination_name,
                "dates": b.dates_text,
                "nights": b.nights,
                "guests": b.guests_count,
                "transport": b.transport_details_json.get("title", "") if b.transport_details_json and isinstance(b.transport_details_json, dict) else (b.transport_details_json or "Express Chauffeur"),
                "stay": b.stay_details_json.get("name", "") if b.stay_details_json and isinstance(b.stay_details_json, dict) else (b.stay_details_json or "Heritage Homestay"),
                "driver": b.driver_details_json.get("name", "") if b.driver_details_json and isinstance(b.driver_details_json, dict) else (b.driver_details_json or "Certified Chauffeur"),
                "rentalVehicle": b.rental_vehicle_details_json,
                "totalCost": b.total_cost_text,
                "numericTotal": b.numeric_total,
                "status": b.status,
                "paymentMethod": b.payment_method,
                "timestamp": b.created_at.strftime("%d/%m/%Y"),
                "travelerName": b.traveler_name,
                "travelerPhone": b.traveler_phone
            })
        return results

    bookings = query.order_by(Booking.created_at.desc()).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "pnr": b.pnr,
            "origin": b.origin,
            "destinationKey": b.destination_key,
            "destinationName": b.destination_name,
            "dates": b.dates_text,
            "nights": b.nights,
            "guests": b.guests_count,
            "transport": b.transport_details_json.get("title", "") if b.transport_details_json and isinstance(b.transport_details_json, dict) else (b.transport_details_json or "Express Chauffeur"),
            "stay": b.stay_details_json.get("name", "") if b.stay_details_json and isinstance(b.stay_details_json, dict) else (b.stay_details_json or "Heritage Homestay"),
            "driver": b.driver_details_json.get("name", "") if b.driver_details_json and isinstance(b.driver_details_json, dict) else (b.driver_details_json or "Certified Chauffeur"),
            "rentalVehicle": b.rental_vehicle_details_json,
            "totalCost": b.total_cost_text,
            "numericTotal": b.numeric_total,
            "status": b.status,
            "paymentMethod": b.payment_method,
            "timestamp": b.created_at.strftime("%d/%m/%Y"),
            "travelerName": b.traveler_name,
            "travelerPhone": b.traveler_phone
        })
    return results

@router.post("")
def create_booking(
    request: CreateBookingRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # Parse dates from string
    d_start, d_end = extract_dates_from_text(request.dates)
    if not d_start:
        d_start = date.today()
    if not d_end:
        from datetime import timedelta
        d_end = d_start + timedelta(days=max(1, request.nights or 1))

    transport_val = request.transportTitle or request.transport
    stay_val = request.stayName or request.stay
    driver_val = request.driverName or request.driver
    traveler_name = request.travelerName or (current_user.name if current_user else "Traveler")
    traveler_phone = request.travelerPhone or (current_user.mobile if current_user else "")

    # Room Type & Availability Verification
    room_type = None
    rooms_requested = 1
    
    if stay_val:
        # Search for room type or hotel matching stayName
        room_type = db.query(RoomType).filter(RoomType.name.ilike(f"%{stay_val}%")).first()
        if not room_type:
            # Check if stayName matches a hotel property
            hotel = db.query(Hotel).filter(Hotel.property_name.ilike(f"%{stay_val}%")).first()
            if hotel:
                # Check hotel approval status
                if hotel.approval_status not in ["APPROVED", "ACTIVE"]:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Hotel property '{hotel.property_name}' is currently {hotel.approval_status} and not open for public booking."
                    )
                room_type = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()

    if room_type:
        # Perform date-aware availability calculation under lock/transaction
        avail = calculate_room_type_availability(db, room_type, d_start, d_end)
        if avail["availableRooms"] < rooms_requested:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Overbooking prevented: '{room_type.name}' only has {avail['availableRooms']} room(s) available for the selected dates."
            )

    pnr = request.pnr or f"4582-{request.destinationKey.upper()[:3]}-{db.query(Booking).count() + 9001}"
    booking_id = request.id or f"SS-CONFIRM-{db.query(Booking).count() + 94815}"

    stay_json = {"name": stay_val} if stay_val else None
    if room_type and stay_json:
        stay_json["roomTypeId"] = room_type.id
        stay_json["hotelId"] = room_type.hotel_id
        stay_json["roomsCount"] = rooms_requested

    booking = Booking(
        id=booking_id,
        pnr=pnr,
        customer_id=current_user.id if current_user else None,
        destination_key=request.destinationKey,
        destination_name=request.destinationName,
        origin=request.origin or "Hyderabad",
        dates_text=request.dates,
        nights=request.nights or 4,
        guests_count=request.guests or 2,
        transport_details_json={"title": transport_val} if transport_val else None,
        stay_details_json=stay_json,
        driver_details_json={"name": driver_val} if driver_val else None,
        rental_vehicle_details_json=request.rentalVehicle,
        total_cost_text=request.totalCost,
        numeric_total=request.numericTotal,
        status="Confirmed",
        payment_status="Paid",
        payment_method=request.paymentMethod or "UPI",
        traveler_name=traveler_name,
        traveler_phone=traveler_phone
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # If a room type was booked, persist the RoomBookingItem
    if room_type:
        room_item = RoomBookingItem(
            booking_id=booking.id,
            room_type_id=room_type.id,
            check_in_date=d_start.isoformat(),
            check_out_date=d_end.isoformat(),
            rooms_count=rooms_requested,
            rate_per_night=room_type.base_price,
            total_price=room_type.base_price * max(1, request.nights or 1)
        )
        db.add(room_item)
        db.commit()

    # Automatically log financial transaction
    tax_amt = round(request.numericTotal * 0.18, 2)
    tx_ref = f"TXN-SETU-{int(datetime.utcnow().timestamp())}"
    txn = Transaction(
        transaction_reference=tx_ref,
        customer_id=current_user.id if current_user else None,
        booking_id=booking.id,
        amount=request.numericTotal - tax_amt,
        tax=tax_amt,
        total_amount=request.numericTotal,
        payment_method=request.paymentMethod or "UPI",
        gateway_transaction_id=f"PAY-{pnr}",
        status="SUCCESS"
    )
    db.add(txn)
    db.commit()

    log_audit_event(
        db,
        action="BOOKING_CREATED",
        entity_type="BOOKING",
        entity_id=booking.id,
        actor_user_id=current_user.id if current_user else None,
        actor_role=current_user.role if current_user else "CUSTOMER",
        description=f"Booking '{booking.id}' (PNR: {booking.pnr}) confirmed for {booking.traveler_name} to {booking.destination_name} (Amount: {booking.total_cost_text})."
    )

    # Real-time WebSocket notification broadcast
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.ensure_future(ws_manager.broadcast({
                "event": "BOOKING_CREATED",
                "bookingId": booking.id,
                "pnr": booking.pnr,
                "status": booking.status,
                "travelerName": booking.traveler_name,
                "hotelId": room_type.hotel_id if room_type else None,
                "roomTypeId": room_type.id if room_type else None
            }))
    except Exception:
        pass

    formatted_booking = {
        "id": booking.id,
        "pnr": booking.pnr,
        "origin": booking.origin,
        "destinationKey": booking.destination_key,
        "destinationName": booking.destination_name,
        "dates": booking.dates_text,
        "nights": booking.nights,
        "guests": booking.guests_count,
        "transport": transport_val or "Express Chauffeur",
        "stay": stay_val or "Heritage Homestay",
        "driver": driver_val or "Certified Chauffeur",
        "rentalVehicle": booking.rental_vehicle_details_json,
        "totalCost": booking.total_cost_text,
        "numericTotal": booking.numeric_total,
        "status": booking.status,
        "paymentMethod": booking.payment_method,
        "timestamp": booking.created_at.strftime("%d/%m/%Y"),
        "travelerName": booking.traveler_name,
        "travelerPhone": booking.traveler_phone
    }

    return {
        "message": "Booking created successfully",
        "booking": formatted_booking
    }

@router.put("/{booking_id}/cancel")
@router.post("/{booking_id}/cancel")
def cancel_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    if current_user and current_user.role == "CUSTOMER" and b.customer_id and b.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    old_status = b.status
    b.status = "Cancelled"
    db.commit()

    log_audit_event(
        db,
        action="BOOKING_CANCELLED",
        entity_type="BOOKING",
        entity_id=b.id,
        actor_user_id=current_user.id if current_user else None,
        actor_role=current_user.role if current_user else "CUSTOMER",
        old_value={"status": old_status},
        new_value={"status": "Cancelled"},
        description=f"Booking '{b.id}' cancelled according to 0% fee cancellation policy."
    )

    # Real-time WebSocket notification broadcast
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.ensure_future(ws_manager.broadcast({
                "event": "BOOKING_CANCELLED",
                "bookingId": b.id,
                "pnr": b.pnr,
                "status": "Cancelled"
            }))
    except Exception:
        pass

    return {"message": "Booking cancelled successfully", "bookingId": b.id, "status": "Cancelled"}
