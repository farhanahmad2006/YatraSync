# Changes made by @MdFarhanAhmad
import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.database import SessionLocal
from app.db.models import (
    User,
    TourPackage,
    TourGuide,
    TourSchedule,
    Vehicle,
    Driver,
    TransportTripAssignment
)
from app.core.security import create_access_token, get_password_hash
from app.services.rbac_service import seed_rbac_data

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_tour_transport_rbac_test_data():
    db = SessionLocal()
    try:
        seed_rbac_data(db)

        test_users = [
            ("usr-tour-test-1", "Anand Tour Operator", "anand.test@tour.in", "+91 98000 11111", "Tour@123", "TOUR_OPERATOR"),
            ("usr-trans-test-1", "Ramesh Fleet Admin", "ramesh.test@fleet.in", "+91 98000 22222", "Fleet@123", "TRANSPORT_ADMIN"),
            ("usr-cust-test-1", "Sunita Traveler", "sunita.test@travel.in", "+91 98000 33333", "Cust@123", "CUSTOMER"),
            ("usr-hotel-test-1", "Mathew Hotel Owner", "mathew.test@hotel.in", "+91 98000 44444", "Hotel@123", "HOTEL_OWNER")
        ]

        for uid, name, email, mobile, pwd, role in test_users:
            u = db.query(User).filter((User.id == uid) | (User.email == email)).first()
            if not u:
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
                u.role = role
                u.password_hash = get_password_hash(pwd)
                u.status = "ACTIVE"
        db.commit()
    finally:
        db.close()


def get_headers(user_id: str, role: str) -> dict:
    token = create_access_token(subject=user_id, role=role)
    return {"Authorization": f"Bearer {token}"}


def test_tour_operator_can_create_package_itinerary_and_guide():
    headers = get_headers("usr-tour-test-1", "TOUR_OPERATOR")

    # 1. Create Tour Package
    pkg_payload = {
        "title": "4-Day Test Munnar Mist Odyssey",
        "destination_key": "kerala",
        "destination_name": "Kerala (Munnar)",
        "category": "eco_adventure",
        "duration_days": 4,
        "duration_nights": 3,
        "base_price_inr": 15000.0,
        "max_capacity_per_batch": 12,
        "inclusions_json": ["Breakfast", "Jeep Trek"],
        "itinerary_days": [
            {
                "day_number": 1,
                "title": "Ascent to Misty Munnar",
                "description": "Scenic mountain transfer",
                "meals_included": ["Welcome Drink"],
                "overnight_stay": "Tea Hills Resort",
                "activities": [
                    {
                        "activity_name": "Tea Valley Walk",
                        "activity_type": "HERITAGE_WALK",
                        "start_time": "10:00 AM",
                        "duration_hours": 2.0,
                        "location_name": "Munnar Estate"
                    }
                ]
            }
        ]
    }
    res = client.post("/api/v1/tour-operator/packages", json=pkg_payload, headers=headers)
    assert res.status_code == 201
    pkg_data = res.json()
    pkg_id = pkg_data["id"]
    assert pkg_id is not None

    # 2. Onboard Tour Guide
    guide_payload = {
        "full_name": "Joseph Storyteller",
        "phone": "+91 94470 12345",
        "languages_json": ["English", "Malayalam"],
        "specialty": "Flora and Fauna Guide",
        "badge_number": "KTDC-TEST-001"
    }
    g_res = client.post("/api/v1/tour-operator/guides", json=guide_payload, headers=headers)
    assert g_res.status_code == 201
    guide_id = g_res.json()["id"]

    # 3. Create Schedule for Package
    sch_payload = {
        "package_id": pkg_id,
        "guide_id": guide_id,
        "start_date": "2026-12-01",
        "end_date": "2026-12-04",
        "batch_capacity": 12
    }
    s_res = client.post(f"/api/v1/tour-operator/packages/{pkg_id}/schedules", json=sch_payload, headers=headers)
    assert s_res.status_code == 200

    # 4. Read packages
    list_res = client.get("/api/v1/tour-operator/packages", headers=headers)
    assert list_res.status_code == 200
    packages = list_res.json()
    assert any(p["id"] == pkg_id for p in packages)


def test_tour_operator_forbidden_from_transport_fleet_management():
    headers = get_headers("usr-tour-test-1", "TOUR_OPERATOR")

    veh_payload = {
        "destination_key": "kerala",
        "manufacturer": "Mahindra",
        "model": "Thar 4x4",
        "variant": "Hard Top",
        "name": "Mahindra Thar 4x4 Safari",
        "category": "suv",
        "seating_capacity": 4,
        "daily_rate": 4500.0,
        "registration_state": "KL-07",
        "rental_location": "Munnar",
        "vendor_name": "Safari Rentals",
        "vendor_phone": "+91 98400 00000"
    }

    # Tour operator should NOT have VEHICLE_ADD permission
    res = client.post("/api/v1/transport-admin/vehicles", json=veh_payload, headers=headers)
    assert res.status_code == 403

    # Tour operator should NOT have DRIVER_REGISTER permission
    dr_payload = {
        "full_name": "Test Driver",
        "phone": "+91 98400 11111",
        "driving_license": "KL-07-2020-001"
    }
    dr_res = client.post("/api/v1/transport-admin/drivers", json=dr_payload, headers=headers)
    assert dr_res.status_code == 403


def test_transport_admin_can_manage_vehicles_drivers_and_dispatch():
    headers = get_headers("usr-trans-test-1", "TRANSPORT_ADMIN")

    # 1. Register Fleet Vehicle
    veh_payload = {
        "destination_key": "kerala",
        "manufacturer": "Force",
        "model": "Traveller 12",
        "variant": "Deluxe AC",
        "name": "Force Traveller 12-Seater Group Van",
        "category": "tempo_traveller",
        "seating_capacity": 12,
        "daily_rate": 7500.0,
        "registration_state": "KL-07",
        "registration_number": "KL-07-TRAV-90",
        "rental_location": "Kochi Airport",
        "vendor_name": "SafarSetu Fleet",
        "vendor_phone": "+91 98000 22222"
    }
    v_res = client.post("/api/v1/transport-admin/vehicles", json=veh_payload, headers=headers)
    assert v_res.status_code == 201
    veh_id = v_res.json()["id"]

    # 2. Record Vehicle Maintenance
    maint_payload = {
        "last_maintenance_date": "2026-09-15",
        "next_maintenance_km": 6000,
        "notes": "Regular 10,000 km oil service completed"
    }
    m_res = client.put(f"/api/v1/transport-admin/vehicles/{veh_id}/maintenance", json=maint_payload, headers=headers)
    assert m_res.status_code == 200

    # 3. Register Driver
    dr_payload = {
        "full_name": "Govind Raj",
        "phone": "+91 98470 99881",
        "driving_license": "KL-07-2018-998812",
        "license_expiry": "2038-05-20"
    }
    d_res = client.post("/api/v1/transport-admin/drivers", json=dr_payload, headers=headers)
    assert d_res.status_code == 201
    driver_id = d_res.json()["id"]

    # 4. Verify Driver DigiLocker Docs
    verify_payload = {
        "aadhaar_verified": True,
        "police_verification_status": "VERIFIED"
    }
    doc_res = client.put(f"/api/v1/transport-admin/drivers/{driver_id}/verify", json=verify_payload, headers=headers)
    assert doc_res.status_code == 200

    # 5. Dispatch Assignment
    assign_payload = {
        "vehicle_id": veh_id,
        "driver_id": driver_id,
        "pickup_location": "Cochin Airport (COK)",
        "drop_location": "Munnar Tea Hills Resort"
    }
    disp_res = client.post("/api/v1/transport-admin/assignments", json=assign_payload, headers=headers)
    assert disp_res.status_code == 201


def test_transport_admin_forbidden_from_tour_package_creation():
    headers = get_headers("usr-trans-test-1", "TRANSPORT_ADMIN")

    pkg_payload = {
        "title": "Unauthorized Tour Attempt",
        "destination_key": "kerala",
        "destination_name": "Kerala",
        "category": "heritage",
        "duration_days": 3,
        "duration_nights": 2,
        "base_price_inr": 9000.0,
        "max_capacity_per_batch": 10
    }

    res = client.post("/api/v1/tour-operator/packages", json=pkg_payload, headers=headers)
    assert res.status_code == 403


def test_customer_and_unauthenticated_blocked_from_management():
    # 1. Unauthenticated request
    unauth_res = client.get("/api/v1/tour-operator/packages")
    assert unauth_res.status_code == 401

    # 2. Customer user request
    cust_headers = get_headers("usr-cust-test-1", "CUSTOMER")
    tour_res = client.post("/api/v1/tour-operator/packages", json={"title": "Test"}, headers=cust_headers)
    assert tour_res.status_code == 403

    trans_res = client.get("/api/v1/transport-admin/vehicles", headers=cust_headers)
    assert trans_res.status_code == 403
