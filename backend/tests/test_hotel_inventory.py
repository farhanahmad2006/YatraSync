# Changes made by @MdFarhanAhmad
import pytest
import sys
import os
from datetime import datetime, timedelta, date
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.database import SessionLocal
from app.db.models import User, Hotel, RoomType, RoomInventoryBlock, Booking, RoomBookingItem
from app.core.security import create_access_token, get_password_hash

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_environment():
    db = SessionLocal()
    try:
        users = [
            ("usr-super-admin-test", "SafarSetu Super Admin", "admin@safarsetu.in", "+91 99999 00000", "Admin@123456", "SUPER_ADMIN"),
            ("usr-owner-a", "Mathew Joseph Owner", "owner_a@munnartea.in", "+91 94471 88990", "Hotel@123456", "HOTEL_OWNER"),
            ("usr-owner-b", "George Kurian Owner", "owner_b@wayanadwild.in", "+91 94471 11223", "Hotel@123456", "HOTEL_OWNER"),
            ("usr-customer-priya", "Priya Sundaram", "priya@example.com", "+91 98401 23456", "Customer@123456", "CUSTOMER"),
            ("usr-transport-ramesh", "Ramesh Sharma Transport", "ramesh@safarsetu-fleet.in", "+91 98765 11111", "Transport@123456", "TRANSPORT_ADMIN"),
        ]
        for uid, name, email, mobile, pwd, role in users:
            existing = db.query(User).filter((User.id == uid) | (User.email == email) | (User.mobile == mobile)).first()
            if not existing:
                u = User(
                    id=uid,
                    name=name,
                    email=email,
                    mobile=mobile,
                    password_hash=get_password_hash(pwd),
                    role=role,
                    status="ACTIVE",
                    is_verified=True,
                    digilocker_verified=True
                )
                db.add(u)
            else:
                existing.role = role
                existing.password_hash = get_password_hash(pwd)
                existing.status = "ACTIVE"
        db.commit()
    finally:
        db.close()

def get_auth_token(user_identifier: str, role: str) -> str:
    db = SessionLocal()
    u = db.query(User).filter(
        (User.id == user_identifier) | (User.email == user_identifier) | (User.mobile == user_identifier)
    ).first()
    if not u:
        u = db.query(User).filter(User.role == role).first()
    uid = u.id if u else user_identifier
    actual_role = u.role if u else role
    db.close()
    return create_access_token(subject=uid, role=actual_role)

# -------------------------------------------------------------
# TEST 1: Create Hotel Owner -> Create Hotel with 20 rooms -> Customer sees 20 available
# -------------------------------------------------------------
def test_1_create_hotel_with_inventory():
    owner_token = get_auth_token("usr-owner-a", "HOTEL_OWNER")
    headers = {"Authorization": f"Bearer {owner_token}"}

    db = SessionLocal()
    # Clean old test hotels and associated records
    old_hotels = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").all()
    for h in old_hotels:
        db.query(RoomInventoryBlock).filter(RoomInventoryBlock.hotel_id == h.id).delete()
        rt_ids = [r.id for r in db.query(RoomType).filter(RoomType.hotel_id == h.id).all()]
        if rt_ids:
            db.query(RoomBookingItem).filter(RoomBookingItem.room_type_id.in_(rt_ids)).delete()
        db.query(RoomType).filter(RoomType.hotel_id == h.id).delete()
        db.delete(h)
    
    # Clean test bookings
    test_bookings = db.query(Booking).filter(Booking.traveler_name == "Priya Sundaram").all()
    for b in test_bookings:
        db.query(RoomBookingItem).filter(RoomBookingItem.booking_id == b.id).delete()
        db.delete(b)
    db.commit()
    db.close()

    # 1. Onboard hotel
    onboard_res = client.post("/api/v1/hotels/onboard", headers=headers, json={
        "propertyName": "Munnar Tea Hills Luxury Resort",
        "propertyType": "resort",
        "ownerName": "Mathew Joseph Owner",
        "contactPhone": "+91 94471 88990",
        "contactEmail": "owner_a@munnartea.in",
        "address": {"line": "Chinnakanal", "city": "Munnar", "state": "Kerala", "pincode": "685612"},
        "details": {"roomCount": 0, "baseTariffINR": 2800, "description": "Lush tea plantation resort.", "photos": []},
        "verification": {"panNumber": "ABCDE1234F", "gstin": "32ABCDE1234F1Z5"}
    })
    assert onboard_res.status_code == 200
    hotel_id = onboard_res.json()["property"]["id"]

    # 2. Super Admin approves the hotel
    admin_token = get_auth_token("usr-super-admin-test", "SUPER_ADMIN")
    approve_res = client.put(f"/api/v1/hotels/{hotel_id}/status", headers={"Authorization": f"Bearer {admin_token}"}, json={
        "approvalStatus": "APPROVED"
    })
    assert approve_res.status_code == 200

    # 3. Hotel Owner creates Room Type with 20 rooms inventory
    room_res = client.post(f"/api/v1/hotels/{hotel_id}/rooms", headers=headers, json={
        "name": "Tea Valley Deluxe Suite",
        "bedConfig": "King Bed",
        "roomSizeSqft": 420,
        "inventoryCount": 20,
        "maxOccupancy": 3,
        "adultCapacity": 2,
        "childCapacity": 1,
        "basePrice": 3200,
        "extraAdultPrice": 750,
        "extraChildPrice": 350,
        "amenities": ["Wi-Fi", "Balcony", "Breakfast"]
    })
    assert room_res.status_code == 200
    room_id = room_res.json()["id"]

    # 4. Customer queries availability
    avail_res = client.get(f"/api/v1/hotels/{hotel_id}/availability?check_in=2026-10-10&check_out=2026-10-14")
    assert avail_res.status_code == 200
    avail_data = avail_res.json()
    assert avail_data["totalRooms"] == 20
    assert avail_data["totalBooked"] == 0
    assert avail_data["totalBlocked"] == 0
    assert avail_data["totalAvailable"] == 20

# -------------------------------------------------------------
# TEST 2: Book 5 rooms -> Backend calculates 15 available
# -------------------------------------------------------------
def test_2_book_5_rooms_availability():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    db.close()

    cust_token = get_auth_token("usr-customer-priya", "CUSTOMER")
    book_res = client.post("/api/v1/bookings", headers={"Authorization": f"Bearer {cust_token}"}, json={
        "destinationKey": "munnar",
        "destinationName": "Munnar, Kerala",
        "origin": "Kochi",
        "dates": "10/10/2026 - 14/10/2026",
        "nights": 4,
        "guests": 2,
        "stayName": room.name,
        "totalCost": "₹12,800",
        "numericTotal": 12800,
        "paymentMethod": "UPI",
        "travelerName": "Priya Sundaram",
        "travelerPhone": "+91 98401 23456"
    })
    assert book_res.status_code == 200
    booking_id = book_res.json()["booking"]["id"]

    # Manually update RoomBookingItem to 5 rooms to test 5-room booking
    db = SessionLocal()
    item = db.query(RoomBookingItem).filter(RoomBookingItem.booking_id == booking_id).first()
    item.rooms_count = 5
    db.commit()
    db.close()

    # Query availability for same dates
    avail_res = client.get(f"/api/v1/hotels/{hotel.id}/availability?check_in=2026-10-10&check_out=2026-10-14")
    assert avail_res.status_code == 200
    data = avail_res.json()
    assert data["totalRooms"] == 20
    assert data["totalBooked"] == 5
    assert data["totalAvailable"] == 15

# -------------------------------------------------------------
# TEST 3: Block 3 rooms for maintenance -> Backend calculates 12 available
# -------------------------------------------------------------
def test_3_block_3_rooms_for_maintenance():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    db.close()

    owner_token = get_auth_token("usr-owner-a", "HOTEL_OWNER")
    block_res = client.post(f"/api/v1/hotels/room-types/{room.id}/blocks", headers={"Authorization": f"Bearer {owner_token}"}, json={
        "quantity": 3,
        "startDate": "2026-10-10",
        "endDate": "2026-10-14",
        "reason": "MAINTENANCE",
        "note": "Annual HVAC maintenance"
    })
    assert block_res.status_code == 200

    avail_res = client.get(f"/api/v1/hotels/{hotel.id}/availability?check_in=2026-10-10&check_out=2026-10-14")
    data = avail_res.json()
    assert data["totalRooms"] == 20
    assert data["totalBooked"] == 5
    assert data["totalBlocked"] == 3
    assert data["totalAvailable"] == 12

# -------------------------------------------------------------
# TEST 4: Cancel the 5-room booking -> Availability restores accordingly (17 available)
# -------------------------------------------------------------
def test_4_cancel_booking_restores_availability():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    booking = db.query(Booking).filter(Booking.traveler_name == "Priya Sundaram", Booking.status == "Confirmed").first()
    db.close()

    cust_token = get_auth_token("usr-customer-priya", "CUSTOMER")
    cancel_res = client.put(f"/api/v1/bookings/{booking.id}/cancel", headers={"Authorization": f"Bearer {cust_token}"})
    assert cancel_res.status_code == 200

    # Availability check: Total 20 - Booked 0 - Blocked 3 = 17 available
    avail_res = client.get(f"/api/v1/hotels/{hotel.id}/availability?check_in=2026-10-10&check_out=2026-10-14")
    data = avail_res.json()
    assert data["totalRooms"] == 20
    assert data["totalBooked"] == 0
    assert data["totalBlocked"] == 3
    assert data["totalAvailable"] == 17

# -------------------------------------------------------------
# TEST 5: Try to book more rooms than available -> Booking rejected
# -------------------------------------------------------------
def test_5_overbooking_attempt_rejected():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    room_id = room.id
    room_name = room.name
    # Set inventory temporarily to 1 room
    room.inventory_count = 1
    db.commit()
    db.close()

    try:
        cust_token = get_auth_token("usr-customer-priya", "CUSTOMER")
        res = client.post("/api/v1/bookings", headers={"Authorization": f"Bearer {cust_token}"}, json={
            "destinationKey": "munnar",
            "destinationName": "Munnar, Kerala",
            "origin": "Kochi",
            "dates": "10/10/2026 - 14/10/2026",
            "nights": 4,
            "guests": 2,
            "stayName": room_name,
            "totalCost": "₹3,200",
            "numericTotal": 3200,
            "paymentMethod": "UPI",
            "travelerName": "Priya Sundaram",
            "travelerPhone": "+91 98401 23456"
        })
        # Since 3 rooms are blocked and inventory is 1 (available = 0), booking must fail
        assert res.status_code == 400
        assert "Overbooking prevented" in res.json()["detail"]
    finally:
        # Restore inventory back to 20
        db = SessionLocal()
        r = db.query(RoomType).filter(RoomType.id == room_id).first()
        if r:
            r.inventory_count = 20
            db.commit()
        db.close()

# -------------------------------------------------------------
# TEST 6: Concurrency / Overbooking Safety Re-check
# -------------------------------------------------------------
def test_6_concurrency_and_inventory_calculation():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    db.close()

    avail = client.get(f"/api/v1/hotels/room-types/{room.id}/availability?check_in=2026-10-10&check_out=2026-10-14").json()
    assert avail["availableRooms"] == 17
    assert avail["status"] == "AVAILABLE"

# -------------------------------------------------------------
# TEST 7: Hotel Owner changes inventory count -> Customer availability updates immediately
# -------------------------------------------------------------
def test_7_owner_updates_inventory_count():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    db.close()

    owner_token = get_auth_token("usr-owner-a", "HOTEL_OWNER")
    # Increase total inventory to 30
    upd_res = client.put(f"/api/v1/hotels/rooms/{room.id}", headers={"Authorization": f"Bearer {owner_token}"}, json={
        "inventoryCount": 30
    })
    assert upd_res.status_code == 200
    assert upd_res.json()["inventoryCount"] == 30

    # Customer sees 30 - 3 blocked = 27 available
    avail_res = client.get(f"/api/v1/hotels/{hotel.id}/availability?check_in=2026-10-10&check_out=2026-10-14")
    assert avail_res.json()["totalAvailable"] == 27

# -------------------------------------------------------------
# TEST 8: Hotel Owner A attempts to modify Hotel Owner B's hotel -> 403 Forbidden
# -------------------------------------------------------------
def test_8_cross_owner_hotel_modification_denied():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    db.close()

    # Owner B attempts to modify Owner A's room type
    owner_b_token = get_auth_token("usr-owner-b", "HOTEL_OWNER")
    res = client.put(f"/api/v1/hotels/rooms/{room.id}", headers={"Authorization": f"Bearer {owner_b_token}"}, json={
        "basePrice": 9999
    })
    assert res.status_code == 403
    assert "Access denied: You do not own this hotel property" in res.json()["detail"]

# -------------------------------------------------------------
# TEST 9: Customer attempts to modify room inventory -> 403 Forbidden
# -------------------------------------------------------------
def test_9_customer_cannot_modify_inventory():
    db = SessionLocal()
    room = db.query(RoomType).first()
    db.close()

    cust_token = get_auth_token("usr-customer-priya", "CUSTOMER")
    res = client.put(f"/api/v1/hotels/rooms/{room.id}", headers={"Authorization": f"Bearer {cust_token}"}, json={
        "inventoryCount": 50
    })
    assert res.status_code == 403

# -------------------------------------------------------------
# TEST 10: Transport Admin attempts to modify hotel inventory -> 403 Forbidden
# -------------------------------------------------------------
def test_10_transport_admin_cannot_modify_inventory():
    db = SessionLocal()
    room = db.query(RoomType).first()
    db.close()

    transport_token = get_auth_token("usr-transport-ramesh", "TRANSPORT_ADMIN")
    res = client.put(f"/api/v1/hotels/rooms/{room.id}", headers={"Authorization": f"Bearer {transport_token}"}, json={
        "inventoryCount": 50
    })
    assert res.status_code == 403

# -------------------------------------------------------------
# TEST 11: Super Admin accesses and modifies Hotel Owner's hotel -> 200 OK
# -------------------------------------------------------------
def test_11_super_admin_full_access():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    room = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).first()
    db.close()

    admin_token = get_auth_token("usr-super-admin-test", "SUPER_ADMIN")
    res = client.put(f"/api/v1/hotels/rooms/{room.id}", headers={"Authorization": f"Bearer {admin_token}"}, json={
        "name": "Tea Valley Grand Royal Suite"
    })
    assert res.status_code == 200
    assert res.json()["name"] == "Tea Valley Grand Royal Suite"

# -------------------------------------------------------------
# TEST 12: Inactive/unapproved hotel -> Not publicly bookable
# -------------------------------------------------------------
def test_12_unapproved_hotel_not_bookable():
    owner_token = get_auth_token("usr-owner-a", "HOTEL_OWNER")
    draft_res = client.post("/api/v1/hotels/onboard", headers={"Authorization": f"Bearer {owner_token}"}, json={
        "propertyName": "Draft Secret Homestay",
        "propertyType": "homestay",
        "ownerName": "Mathew Joseph Owner",
        "contactPhone": "+91 94471 88990",
        "contactEmail": "owner_a@munnartea.in",
        "address": {"line": "Old Town", "city": "Kochi", "state": "Kerala", "pincode": "682001"},
        "details": {"roomCount": 5, "baseTariffINR": 1500, "description": "Private unapproved homestay."},
        "verification": {"panNumber": "ABCDE1234F"}
    })
    assert draft_res.status_code == 200

    # Public hotel search should NOT include the unapproved hotel
    search_res = client.get("/api/v1/hotels?city=Kochi")
    for h in search_res.json():
        assert h["propertyName"] != "Draft Secret Homestay"

# -------------------------------------------------------------
# TEST 13: Hotel Owner uploads photos -> 200 OK & verifies files
# -------------------------------------------------------------
def test_13_hotel_photo_upload():
    db = SessionLocal()
    hotel = db.query(Hotel).filter(Hotel.property_name == "Munnar Tea Hills Luxury Resort").first()
    db.close()

    owner_token = get_auth_token("usr-owner-a", "HOTEL_OWNER")
    
    # Generate a dummy 100x100 PNG in memory
    from io import BytesIO
    from PIL import Image
    
    img_byte_arr = BytesIO()
    img = Image.new("RGB", (100, 100), color=(73, 109, 137))
    img.save(img_byte_arr, format="PNG")
    img_bytes = img_byte_arr.getvalue()

    # Test single file upload via 'files' key
    files = [("files", ("test_room.png", img_bytes, "image/png"))]
    res = client.post(
        f"/api/v1/hotels/{hotel.id}/images",
        headers={"Authorization": f"Bearer {owner_token}"},
        files=files
    )
    assert res.status_code == 200
    data = res.json()
    assert "Successfully uploaded" in data["message"]
    assert len(data["images"]) >= 1

    # Verify photos can be fetched
    fetch_res = client.get(f"/api/v1/hotels/{hotel.id}/images")
    assert fetch_res.status_code == 200
    images = fetch_res.json()
    assert any("test_room" in img["imageUrl"] for img in images)

