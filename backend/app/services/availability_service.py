# Changes made by @MdFarhanAhmad
from datetime import datetime, date
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.db.models import Hotel, RoomType, RoomInventoryBlock, RoomBookingItem, Booking, Transaction

def parse_date_flexible(d_val: Optional[str]) -> Optional[date]:
    """Parse flexible date strings like '2026-09-10', '10/09/2026', '10-09-2026'."""
    if not d_val or not isinstance(d_val, str):
        return None
    d_clean = d_val.strip()
    if not d_clean:
        return None
    
    # Try ISO format
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d %b %Y", "%d %B %Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(d_clean, fmt).date()
        except ValueError:
            continue
    return None

def dates_overlap(start1: date, end1: date, start2: date, end2: date) -> bool:
    """Check if interval [start1, end1) overlaps with [start2, end2)."""
    return start1 < end2 and end1 > start2

def extract_dates_from_text(dates_text: str) -> Tuple[Optional[date], Optional[date]]:
    """Extract start and end date from string like '14 Oct - 18 Oct' or '10/09/2026 - 12/09/2026'."""
    if not dates_text or "-" not in dates_text:
        return None, None
    parts = dates_text.split("-")
    if len(parts) >= 2:
        return parse_date_flexible(parts[0]), parse_date_flexible(parts[1])
    return None, None

def calculate_room_type_availability(
    db: Session,
    room_type: RoomType,
    check_in: Optional[date] = None,
    check_out: Optional[date] = None
) -> Dict[str, Any]:
    """Calculate date-aware availability for a specific RoomType."""
    total_inventory = room_type.inventory_count if (room_type.status or "ACTIVE") == "ACTIVE" else 0
    if total_inventory <= 0:
        return {
            "hotelId": room_type.hotel_id,
            "roomTypeId": room_type.id,
            "roomTypeName": room_type.name,
            "basePrice": room_type.base_price,
            "totalInventory": 0,
            "bookedRooms": 0,
            "blockedRooms": 0,
            "availableRooms": 0,
            "status": "SOLD_OUT",
            "checkIn": check_in.isoformat() if check_in else None,
            "checkOut": check_out.isoformat() if check_out else None,
        }

    # Default to today -> tomorrow if not specified
    q_start = check_in or date.today()
    q_end = check_out or (date.today() if check_in else None)
    if q_end is None or q_end <= q_start:
        from datetime import timedelta
        q_end = q_start + timedelta(days=1)

    # 1. Calculate Booked Quantity from RoomBookingItems & Bookings
    booked_count = 0
    booking_items = (
        db.query(RoomBookingItem, Booking)
        .join(Booking, RoomBookingItem.booking_id == Booking.id)
        .filter(
            RoomBookingItem.room_type_id == room_type.id,
            Booking.status.in_(["Confirmed", "Active", "CONFIRMED", "ACTIVE", "Pending", "PENDING"])
        )
        .all()
    )

    for item, b in booking_items:
        # Check explicit item dates or fallback to booking dates
        b_start = parse_date_flexible(item.check_in_date)
        b_end = parse_date_flexible(item.check_out_date)
        if not b_start or not b_end:
            b_start, b_end = extract_dates_from_text(b.dates_text)
        
        # If dates exist, test overlap
        if b_start and b_end:
            if dates_overlap(q_start, q_end, b_start, b_end):
                booked_count += (item.rooms_count or 1)
        else:
            # If no dates available, consider active booking against current inventory
            booked_count += (item.rooms_count or 1)

    # Also check generic bookings that reserved this hotel without explicit room_booking_items (fallback compatibility)
    generic_bookings = (
        db.query(Booking)
        .filter(
            Booking.status.in_(["Confirmed", "Active", "CONFIRMED", "ACTIVE"]),
            Booking.stay_details_json.isnot(None)
        )
        .all()
    )
    for b in generic_bookings:
        stay = b.stay_details_json if isinstance(b.stay_details_json, dict) else {}
        stay_name = stay.get("name", "")
        # Only count if not already linked in room_booking_items
        already_counted = any(b.id == item.booking_id for item, _ in booking_items)
        if not already_counted and (stay.get("roomTypeId") == room_type.id or stay.get("hotelId") == room_type.hotel_id):
            b_start, b_end = extract_dates_from_text(b.dates_text)
            if b_start and b_end:
                if dates_overlap(q_start, q_end, b_start, b_end):
                    booked_count += stay.get("roomsCount", 1)
            elif not check_in:
                booked_count += stay.get("roomsCount", 1)

    # 2. Calculate Blocked Quantity from RoomInventoryBlocks
    blocked_count = 0
    blocks = (
        db.query(RoomInventoryBlock)
        .filter(
            RoomInventoryBlock.room_type_id == room_type.id,
            RoomInventoryBlock.status == "ACTIVE"
        )
        .all()
    )
    for blk in blocks:
        blk_start = parse_date_flexible(blk.start_date)
        blk_end = parse_date_flexible(blk.end_date)
        if blk_start and blk_end:
            if dates_overlap(q_start, q_end, blk_start, blk_end):
                blocked_count += (blk.quantity or 1)
        else:
            blocked_count += (blk.quantity or 1)

    # 3. Available Inventory
    available = max(0, total_inventory - booked_count - blocked_count)
    avail_status = "AVAILABLE"
    if available == 0:
        avail_status = "SOLD_OUT"
    elif available <= max(1, total_inventory // 4):
        avail_status = "LIMITED"

    return {
        "hotelId": room_type.hotel_id,
        "roomTypeId": room_type.id,
        "roomTypeName": room_type.name,
        "basePrice": room_type.base_price,
        "totalInventory": total_inventory,
        "bookedRooms": booked_count,
        "blockedRooms": blocked_count,
        "availableRooms": available,
        "status": avail_status,
        "checkIn": q_start.isoformat(),
        "checkOut": q_end.isoformat(),
    }

def calculate_hotel_availability(
    db: Session,
    hotel: Hotel,
    check_in_str: Optional[str] = None,
    check_out_str: Optional[str] = None
) -> Dict[str, Any]:
    """Calculate date-aware aggregated availability for a Hotel across all its room types."""
    check_in = parse_date_flexible(check_in_str)
    check_out = parse_date_flexible(check_out_str)

    room_types = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).all()
    rt_results = []
    total_rooms = 0
    total_booked = 0
    total_blocked = 0
    total_available = 0

    if room_types:
        for rt in room_types:
            rt_res = calculate_room_type_availability(db, rt, check_in, check_out)
            rt_results.append(rt_res)
            total_rooms += rt_res["totalInventory"]
            total_booked += rt_res["bookedRooms"]
            total_blocked += rt_res["blockedRooms"]
            total_available += rt_res["availableRooms"]
    else:
        # Fallback to hotel.room_count if no room types defined yet
        total_rooms = hotel.room_count or 1
        total_available = total_rooms

    return {
        "hotelId": hotel.id,
        "propertyName": hotel.property_name,
        "city": hotel.city,
        "approvalStatus": hotel.approval_status,
        "inventoryConfirmed": hotel.inventory_confirmed,
        "totalRooms": total_rooms,
        "totalBooked": total_booked,
        "totalBlocked": total_blocked,
        "totalAvailable": total_available,
        "checkIn": check_in.isoformat() if check_in else None,
        "checkOut": check_out.isoformat() if check_out else None,
        "roomTypes": rt_results
    }

def get_hotel_dashboard_metrics(db: Session, hotel: Hotel) -> Dict[str, Any]:
    """Provide real summary metrics for the Hotel Partner Dashboard."""
    avail = calculate_hotel_availability(db, hotel)
    total = avail["totalRooms"]
    booked = avail["totalBooked"]
    blocked = avail["totalBlocked"]
    available = avail["totalAvailable"]
    occupancy = round((booked / total * 100.0), 1) if total > 0 else 0.0

    # Calculate monthly revenue from bookings
    bookings = db.query(Booking).filter(
        Booking.status.in_(["Confirmed", "Active", "Completed", "CONFIRMED", "ACTIVE", "COMPLETED"])
    ).all()
    revenue = 0.0
    for b in bookings:
        stay = b.stay_details_json if isinstance(b.stay_details_json, dict) else {}
        if stay.get("hotelId") == hotel.id or hotel.property_name.lower() in (b.stay_details_json or "").lower():
            revenue += float(b.numeric_total or 0.0)

    return {
        "hotelId": hotel.id,
        "propertyName": hotel.property_name,
        "totalRooms": total,
        "activeBookings": booked,
        "blockedRooms": blocked,
        "availableRooms": available,
        "occupancyRate": occupancy,
        "inventoryConfirmed": hotel.inventory_confirmed,
        "approvalStatus": hotel.approval_status,
        "monthlyRevenueINR": revenue
    }
