# Changes made by @MdFarhanAhmad
import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.database import SessionLocal
from app.db.models import User, Hotel, RoomType, RoomInventoryBlock
from app.core.security import create_access_token, get_password_hash

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_rbac_test_data():
    db = SessionLocal()
    try:
        users = [
            ("usr-rbac-owner-1", "Owner Alpha", "owner_alpha@hotel.in", "+91 91000 11111", "Owner@123", "HOTEL_OWNER"),
            ("usr-rbac-owner-2", "Owner Beta", "owner_beta@hotel.in", "+91 91000 22222", "Owner@123", "HOTEL_OWNER"),
            ("usr-rbac-admin-1", "Hotel Admin Charlie", "admin_charlie@hotel.in", "+91 91000 33333", "Admin@123", "HOTEL_ADMIN"),
            ("usr-rbac-cust-1", "Customer David", "customer_david@travel.in", "+91 91000 44444", "Customer@123", "CUSTOMER"),
            ("usr-rbac-super-1", "Super Admin Root", "super_root@safarsetu.in", "+91 91000 55555", "Super@123", "SUPER_ADMIN"),
        ]
        for uid, name, email, mobile, pwd, role in users:
            existing = db.query(User).filter((User.id == uid) | (User.email == email)).first()
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

        # Reset owner assignments so test fixture matches exact expected hotel IDs
        db.query(Hotel).filter(Hotel.owner_id == "usr-rbac-owner-1", Hotel.id != "hotel-rbac-alpha").update({"owner_id": None}, synchronize_session=False)
        db.query(Hotel).filter(Hotel.owner_id == "usr-rbac-owner-2", Hotel.id != "hotel-rbac-beta").update({"owner_id": None}, synchronize_session=False)

        # Hotel 1 owned by Owner Alpha
        h1 = db.query(Hotel).filter(Hotel.id == "hotel-rbac-alpha").first()
        if not h1:
            h1 = Hotel(
                id="hotel-rbac-alpha",
                property_name="Alpha Heritage Retreat",
                property_type="resort",
                owner_id="usr-rbac-owner-1",
                owner_name="Owner Alpha",
                contact_phone="+91 91000 11111",
                contact_email="owner_alpha@hotel.in",
                city="Munnar",
                state="Kerala",
                address_line="Chithirapuram, Munnar",
                pincode="685565",
                base_tariff_inr=4500.0,
                room_count=10,
                approval_status="APPROVED",
                inventory_confirmed=True
            )
            db.add(h1)
        else:
            h1.owner_id = "usr-rbac-owner-1"
            h1.approval_status = "APPROVED"

        # Hotel 2 owned by Owner Beta
        h2 = db.query(Hotel).filter(Hotel.id == "hotel-rbac-beta").first()
        if not h2:
            h2 = Hotel(
                id="hotel-rbac-beta",
                property_name="Beta Mountain Lodge",
                property_type="hotel",
                owner_id="usr-rbac-owner-2",
                owner_name="Owner Beta",
                contact_phone="+91 91000 22222",
                contact_email="owner_beta@hotel.in",
                city="Wayanad",
                state="Kerala",
                address_line="Vythiri, Wayanad",
                pincode="673576",
                base_tariff_inr=3500.0,
                room_count=8,
                approval_status="APPROVED",
                inventory_confirmed=True
            )
            db.add(h2)
        else:
            h2.owner_id = "usr-rbac-owner-2"
            h2.approval_status = "APPROVED"

        # Room type in Hotel 1
        r1 = db.query(RoomType).filter(RoomType.id == "room-rbac-alpha-1").first()
        if not r1:
            r1 = RoomType(
                id="room-rbac-alpha-1",
                hotel_id="hotel-rbac-alpha",
                name="Deluxe Plantation Suite",
                base_price=4500.0,
                inventory_count=10,
                max_occupancy=2,
                status="ACTIVE"
            )
            db.add(r1)

        db.commit()
    finally:
        db.close()


def auth_header(user_id: str, role: str) -> dict:
    token = create_access_token(subject=user_id, role=role)
    return {"Authorization": f"Bearer {token}"}


# 1. HOTEL_OWNER LOGIN RETURNS OWNER PERMISSIONS & HOTEL ID
def test_hotel_owner_login_permissions():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "owner_alpha@hotel.in",
        "password": "Owner@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "HOTEL_OWNER"
    assert data["user"]["hotelPropertyId"] == "hotel-rbac-alpha"
    perms = data["user"]["permissions"]
    assert "HOTEL_UPDATE_OWN" in perms
    assert "ROOM_TYPE_CREATE_OWN" in perms
    assert "ROOM_TYPE_UPDATE_OWN" in perms
    assert "ROOM_TARIFF_UPDATE_OWN" in perms
    assert "HOTEL_ADMIN_ASSIGN" in perms


# 2. HOTEL_OWNER CAN CREATE ROOM TYPES ON OWNED PROPERTY
def test_hotel_owner_can_create_room_type():
    headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    res = client.post("/api/v1/hotels/hotel-rbac-alpha/rooms", json={
        "name": "Luxury Jacuzzi Villa",
        "basePrice": 7500.0,
        "inventoryCount": 4,
        "maxOccupancy": 3
    }, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Luxury Jacuzzi Villa"


# 3. HOTEL_ADMIN CANNOT CREATE ROOM TYPES (403 FORBIDDEN)
def test_hotel_admin_cannot_create_room_type():
    headers = auth_header("usr-rbac-admin-1", "HOTEL_ADMIN")
    res = client.post("/api/v1/hotels/hotel-rbac-alpha/rooms", json={
        "name": "Unauthorized Room Type",
        "basePrice": 2000.0,
        "inventoryCount": 2,
        "maxOccupancy": 2
    }, headers=headers)
    assert res.status_code == 403
    assert "Missing required permission" in res.json()["detail"]


# 4. CROSS-TENANT HOTEL OWNER ACCESS DENIED (403 FORBIDDEN)
def test_cross_tenant_hotel_owner_access_denied():
    # Owner Alpha trying to create a room type in Owner Beta's hotel
    headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    res = client.post("/api/v1/hotels/hotel-rbac-beta/rooms", json={
        "name": "Hostile Takeover Suite",
        "basePrice": 9999.0,
        "inventoryCount": 1,
        "maxOccupancy": 2
    }, headers=headers)
    assert res.status_code == 403
    assert "You do not own this hotel property" in res.json()["detail"]


# 5. CUSTOMER CANNOT CREATE INVENTORY BLOCKS (403 FORBIDDEN)
def test_customer_cannot_create_inventory_block():
    headers = auth_header("usr-rbac-cust-1", "CUSTOMER")
    res = client.post("/api/v1/hotels/room-types/room-rbac-alpha-1/blocks", json={
        "quantity": 2,
        "startDate": "2026-10-01",
        "endDate": "2026-10-05",
        "reason": "MAINTENANCE"
    }, headers=headers)
    assert res.status_code == 403


# 6. SUPER_ADMIN HAS FULL ACCESS TO ALL PROPERTIES
def test_super_admin_has_full_property_access():
    headers = auth_header("usr-rbac-super-1", "SUPER_ADMIN")
    res = client.post("/api/v1/hotels/hotel-rbac-beta/rooms", json={
        "name": "Super Admin Executive Villa",
        "basePrice": 6000.0,
        "inventoryCount": 3,
        "maxOccupancy": 2
    }, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Super Admin Executive Villa"


# 7. HOTEL_OWNER CANNOT ACCESS PLATFORM PENDING HOTELS (403 FORBIDDEN)
def test_hotel_owner_cannot_access_pending_admin_endpoint():
    headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    res = client.get("/api/v1/admin/hotels/pending", headers=headers)
    assert res.status_code == 403
    assert "Hotel Admin" in res.json()["detail"] or "Forbidden" in res.json()["detail"] or "Access denied" in res.json()["detail"]


# 8. HOTEL_OWNER CANNOT APPROVE OR REJECT HOTELS (403 FORBIDDEN)
def test_hotel_owner_cannot_approve_hotels():
    headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    res = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/approve", headers=headers)
    assert res.status_code == 403

    res2 = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/reject", json={"reason": "Test"}, headers=headers)
    assert res2.status_code == 403


# 9. HOTEL_ADMIN CAN VIEW PENDING HOTELS AND APPROVE/REJECT
def test_hotel_admin_can_manage_hotels():
    admin_headers = auth_header("usr-rbac-admin-1", "HOTEL_ADMIN")
    res = client.get("/api/v1/admin/hotels/pending", headers=admin_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    res_app = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/approve", headers=admin_headers)
    assert res_app.status_code == 200
    assert res_app.json()["approvalStatus"] == "APPROVED"

    res_req = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/request-changes", json={"notes": "Please upload GST certificate"}, headers=admin_headers)
    assert res_req.status_code == 200
    assert res_req.json()["approvalStatus"] == "CHANGES_REQUESTED"

    res_act = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/activate", headers=admin_headers)
    assert res_act.status_code == 200
    assert res_act.json()["approvalStatus"] == "ACTIVE"

    res_susp = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/suspend", json={"reason": "Audit"}, headers=admin_headers)
    assert res_susp.status_code == 200
    assert res_susp.json()["approvalStatus"] == "SUSPENDED"


# 10. HOTEL_ADMIN CAN CREATE A HOTEL AND ASSIGN IT TO HOTEL OWNER
def test_hotel_admin_can_create_hotel_and_assign_owner():
    admin_headers = auth_header("usr-rbac-admin-1", "HOTEL_ADMIN")
    res = client.post("/api/v1/admin/hotels/create", json={
        "propertyName": "Kochi Backwaters Homestay",
        "propertyType": "homestay",
        "ownerId": "usr-rbac-owner-1",
        "ownerName": "Owner Alpha",
        "contactPhone": "+91 91000 11111",
        "contactEmail": "owner_alpha@hotel.in",
        "address": {
          "line": "Fort Kochi Pier Road",
          "city": "Kochi",
          "state": "Kerala",
          "pincode": "682001"
        },
        "details": {
          "roomCount": 6,
          "baseTariffINR": 2200.0
        }
    }, headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["property"]["propertyName"] == "Kochi Backwaters Homestay"
    assert data["property"]["ownerId"] == "usr-rbac-owner-1"
    assert data["property"]["approvalStatus"] == "APPROVED"


# 11. HOTEL_ADMIN CAN REASSIGN HOTEL OWNER
def test_hotel_admin_can_reassign_hotel_owner():
    admin_headers = auth_header("usr-rbac-admin-1", "HOTEL_ADMIN")
    res = client.post("/api/v1/admin/hotels/hotel-rbac-beta/assign-owner", json={
        "ownerId": "usr-rbac-owner-1",
        "ownerName": "Owner Alpha",
        "notes": "Transferred management to Owner Alpha"
    }, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["ownerId"] == "usr-rbac-owner-1"


# 12. HOTEL_ADMIN CAN BLOCK ACCESS TO HOTEL
def test_hotel_admin_can_block_hotel_access():
    admin_headers = auth_header("usr-rbac-admin-1", "HOTEL_ADMIN")
    res = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/block", json={
        "reason": "Temporary compliance audit lock"
    }, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["approvalStatus"] == "BLOCKED"


# 13. BLOCKED HOTEL OWNER CANNOT MODIFY ROOM TYPES OR INVENTORY (403 FORBIDDEN)
def test_blocked_hotel_owner_cannot_modify_rooms():
    owner_headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    # Attempt to create room type in blocked hotel
    res = client.post("/api/v1/hotels/hotel-rbac-alpha/rooms", json={
        "name": "Blocked Villa Test",
        "basePrice": 3000.0,
        "inventoryCount": 2,
        "maxOccupancy": 2
    }, headers=owner_headers)
    assert res.status_code == 403
    assert "blocked/suspended" in res.json()["detail"]


# 14. HOTEL_ADMIN CAN UNBLOCK HOTEL ACCESS
def test_hotel_admin_can_unblock_hotel_access():
    admin_headers = auth_header("usr-rbac-admin-1", "HOTEL_ADMIN")
    res = client.post("/api/v1/admin/hotels/hotel-rbac-alpha/unblock", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["approvalStatus"] == "APPROVED"


# 15. UNBLOCKED HOTEL OWNER CAN NOW MANAGE ROOM TYPES AND INVENTORY
def test_unblocked_hotel_owner_can_manage_rooms():
    owner_headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    res = client.post("/api/v1/hotels/hotel-rbac-alpha/rooms", json={
        "name": "Unblocked Sunset Suite",
        "basePrice": 3800.0,
        "inventoryCount": 3,
        "maxOccupancy": 2
    }, headers=owner_headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Unblocked Sunset Suite"


# 16. HOTEL_OWNER CAN LIST ASSIGNED PROPERTIES
def test_hotel_owner_get_assigned_properties():
    owner_headers = auth_header("usr-rbac-owner-1", "HOTEL_OWNER")
    res = client.get("/api/v1/hotels/assigned", headers=owner_headers)
    assert res.status_code == 200
    props = res.json()
    assert isinstance(props, list)
    prop_ids = [p["id"] for p in props]
    assert "hotel-rbac-alpha" in prop_ids

