# SafarSetu Transport Credential, RBAC, and Destination-Based Customer Discovery Automated Test Suite
import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.database import SessionLocal
from app.db.models import (
    User,
    UserRole,
    TourPackage,
    TourSchedule,
    Vehicle,
    Driver,
    TransportCredential,
    TransportCredentialVehicle,
    TransportCredentialDriver,
    TransportChangeRequest
)
from app.core.security import create_access_token, get_password_hash
from app.services.rbac_service import seed_rbac_data

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_credential_test_environment():
    db = SessionLocal()
    try:
        seed_rbac_data(db)

        test_uids = ["usr-cred-op-a", "usr-cred-op-b", "usr-cred-trans-adm", "usr-cred-customer-x"]

        cred_ids = [c[0] for c in db.query(TransportCredential.id).filter(TransportCredential.tour_operator_id.in_(test_uids)).all()]
        if cred_ids:
            db.query(TransportCredentialVehicle).filter(TransportCredentialVehicle.credential_id.in_(cred_ids)).delete(synchronize_session=False)
            db.query(TransportCredentialDriver).filter(TransportCredentialDriver.credential_id.in_(cred_ids)).delete(synchronize_session=False)
            db.commit()

        db.query(TransportChangeRequest).filter(TransportChangeRequest.tour_operator_id.in_(test_uids)).delete(synchronize_session=False)
        db.query(TransportCredential).filter(TransportCredential.tour_operator_id.in_(test_uids)).delete(synchronize_session=False)
        db.query(TourPackage).filter(TourPackage.operator_id.in_(test_uids)).delete(synchronize_session=False)
        db.commit()

        test_users = [
            ("usr-cred-op-a", "Tour Operator A", "cred.op.a@test.in", "+91 91999 11111", "Pass@123", "TOUR_OPERATOR"),
            ("usr-cred-op-b", "Tour Operator B", "cred.op.b@test.in", "+91 91999 22222", "Pass@123", "TOUR_OPERATOR"),
            ("usr-cred-trans-adm", "Transport Admin One", "cred.trans.adm@test.in", "+91 91999 33333", "Pass@123", "TRANSPORT_ADMIN"),
            ("usr-cred-customer-x", "Customer Explorer", "cred.cust.x@test.in", "+91 91999 44444", "Pass@123", "CUSTOMER")
        ]

        for uid, name, email, mobile, pwd, role in test_users:
            u = db.query(User).filter(User.id == uid).first()
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
                u.name = name
                u.email = email
                u.mobile = mobile
                u.role = role
                u.password_hash = get_password_hash(pwd)
                u.status = "ACTIVE"
        db.commit()

        # Ensure fleet vehicles exist for test
        v1 = db.query(Vehicle).filter(Vehicle.id == "veh-test-innova").first()
        if not v1:
            v1 = Vehicle(
                id="veh-test-innova",
                destination_key="himachal",
                manufacturer="Toyota",
                model="Innova Crysta",
                variant="ZX 7-Seater",
                name="Toyota Innova Crysta (Test)",
                category="muv",
                seating_capacity=7,
                daily_rate=4500.0,
                registration_state="HP-01",
                registration_number="HP-01-AA-9988",
                rental_location="Shimla Transit Hub",
                vendor_name="Himachal Express",
                vendor_phone="+91 98000 00001",
                operational_status="AVAILABLE"
            )
            db.add(v1)

        v2 = db.query(Vehicle).filter(Vehicle.id == "veh-test-traveller").first()
        if not v2:
            v2 = Vehicle(
                id="veh-test-traveller",
                destination_key="delhi",
                manufacturer="Force",
                model="Traveller",
                variant="12 Seater Luxury",
                name="Force Traveller 12-Seater (Test)",
                category="tempo_traveller",
                seating_capacity=12,
                daily_rate=7500.0,
                registration_state="DL-01",
                registration_number="DL-01-TA-7744",
                rental_location="Delhi Central Hub",
                vendor_name="Capital Fleet",
                vendor_phone="+91 98000 00002",
                operational_status="AVAILABLE"
            )
            db.add(v2)

        # Ensure drivers exist for test
        d1 = db.query(Driver).filter(Driver.id == "dr-test-rajesh").first()
        if not d1:
            d1 = Driver(
                id="dr-test-rajesh",
                full_name="Rajesh Thakur",
                phone="+91 98111 22334",
                driving_license="HP-01-2015-112233",
                license_expiry="2034-12-31",
                police_verification_status="VERIFIED",
                duty_status="AVAILABLE"
            )
            db.add(d1)

        db.commit()
    finally:
        db.close()


def get_token_for(user_id: str, role: str = None) -> str:
    if not role:
        role_map = {
            "usr-cred-trans-adm": "TRANSPORT_ADMIN",
            "usr-cred-op-a": "TOUR_OPERATOR",
            "usr-cred-op-b": "TOUR_OPERATOR",
            "usr-cred-cust-1": "CUSTOMER"
        }
        role = role_map.get(user_id, "CUSTOMER")
    return create_access_token(subject=user_id, role=role)



# ==============================================================================
# TESTS 1 - 4: TRANSPORT ADMIN ISSUES CREDENTIAL & ASSIGNS VEHICLE/DRIVER
# ==============================================================================

def test_1_transport_admin_issues_credential_saved_in_db():
    token = get_token_for("usr-cred-trans-adm")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "tour_operator_id": "usr-cred-op-a",
        "credential_number": "TC-TEST-OP-A-001",
        "compliance_status": "COMPLIANT",
        "notes": "Authorized for Northern India operations",
        "vehicle_ids": ["veh-test-innova"],
        "driver_ids": ["dr-test-rajesh"]
    }

    res = client.post("/api/v1/transport-admin/credentials", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["credential"]["credentialNumber"] == "TC-TEST-OP-A-001"
    assert data["credential"]["tourOperatorId"] == "usr-cred-op-a"
    assert len(data["credential"]["assignedVehicles"]) == 1
    assert data["credential"]["assignedVehicles"][0]["vehicleId"] == "veh-test-innova"
    assert len(data["credential"]["assignedDrivers"]) == 1
    assert data["credential"]["assignedDrivers"][0]["driverId"] == "dr-test-rajesh"


def test_2_transport_admin_assigns_and_unassigns_vehicle():
    token = get_token_for("usr-cred-trans-adm")
    headers = {"Authorization": f"Bearer {token}"}

    # Query credential for OP A
    creds_res = client.get("/api/v1/transport-admin/credentials?operator_id=usr-cred-op-a", headers=headers)
    assert creds_res.status_code == 200
    cred_id = creds_res.json()[0]["id"]

    # Assign secondary vehicle
    assign_res = client.post(f"/api/v1/transport-admin/credentials/{cred_id}/vehicles", json={"vehicle_id": "veh-test-traveller"}, headers=headers)
    assert assign_res.status_code == 200
    assert len(assign_res.json()["credential"]["assignedVehicles"]) == 2

    # Unassign secondary vehicle
    unassign_res = client.delete(f"/api/v1/transport-admin/credentials/{cred_id}/vehicles/veh-test-traveller", headers=headers)
    assert unassign_res.status_code == 200
    assert len(unassign_res.json()["credential"]["assignedVehicles"]) == 1


def test_3_transport_admin_updates_credential_status():
    token = get_token_for("usr-cred-trans-adm")
    headers = {"Authorization": f"Bearer {token}"}

    creds_res = client.get("/api/v1/transport-admin/credentials?operator_id=usr-cred-op-a", headers=headers)
    cred_id = creds_res.json()[0]["id"]

    # Suspend credential
    res = client.put(f"/api/v1/transport-admin/credentials/{cred_id}/status", json={"status": "SUSPENDED", "compliance_status": "UNDER_REVIEW"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["credential"]["status"] == "SUSPENDED"

    # Reactivate credential
    res2 = client.put(f"/api/v1/transport-admin/credentials/{cred_id}/status", json={"status": "ACTIVE", "compliance_status": "COMPLIANT"}, headers=headers)
    assert res2.status_code == 200
    assert res2.json()["credential"]["status"] == "ACTIVE"


# ==============================================================================
# TESTS 5 - 7: TOUR OPERATOR ISOLATION & PERMISSION RESTRICTIONS
# ==============================================================================

def test_5_tour_operator_views_own_credential():
    token = get_token_for("usr-cred-op-a")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/tour-operator/credential", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["credentialNumber"] == "TC-TEST-OP-A-001"
    assert data["tourOperatorId"] == "usr-cred-op-a"
    assert len(data["assignedVehicles"]) == 1
    assert data["assignedVehicles"][0]["name"] == "Toyota Innova Crysta (Test)"


def test_6_tour_operator_b_cannot_access_operator_a_credential():
    token = get_token_for("usr-cred-op-b")
    headers = {"Authorization": f"Bearer {token}"}

    # Tour Operator B has no credential issued -> should get 404
    res = client.get("/api/v1/tour-operator/credential", headers=headers)
    assert res.status_code == 404

    # Tour Operator B cannot list Transport Admin credentials
    admin_list_res = client.get("/api/v1/transport-admin/credentials", headers=headers)
    assert admin_list_res.status_code == 403


def test_7_tour_operator_cannot_modify_fleet_vehicles_directly():
    token = get_token_for("usr-cred-op-a")
    headers = {"Authorization": f"Bearer {token}"}

    # Tour Operator cannot register or modify fleet vehicles directly
    res = client.post("/api/v1/transport-admin/vehicles", json={"name": "Fake Bus"}, headers=headers)
    assert res.status_code == 403

    res2 = client.put("/api/v1/transport-admin/vehicles/veh-test-innova", json={"registration_number": "HACKED"}, headers=headers)
    assert res2.status_code == 403


# ==============================================================================
# TESTS 8 - 9: TOUR OPERATOR CHANGE REQUEST SYSTEM & ADMIN REVIEW
# ==============================================================================

def test_8_tour_operator_submits_vehicle_change_request():
    token = get_token_for("usr-cred-op-a")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "request_type": "VEHICLE_CHANGE",
        "title": "Request Upgrade to 12-Seater Tempo Traveller for Peak Group Tour",
        "description": "Current Innova 7-seater is insufficient for upcoming 12-passenger departure.",
        "requested_changes_json": {
            "old_vehicle_id": "veh-test-innova",
            "new_vehicle_id": "veh-test-traveller",
            "reason": "Batch capacity expansion"
        }
    }

    res = client.post("/api/v1/tour-operator/change-requests", json=payload, headers=headers)
    assert res.status_code == 201
    assert res.json()["status"] == "PENDING"
    global change_request_id
    change_request_id = res.json()["requestId"]


def test_9_transport_admin_approves_change_request_and_updates_assignment():
    admin_token = get_token_for("usr-cred-trans-adm")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Review & approve
    res = client.put(
        f"/api/v1/transport-admin/change-requests/{change_request_id}/review",
        json={"status": "APPROVED", "reviewer_notes": "Approved for 12-passenger peak departure."},
        headers=admin_headers
    )
    assert res.status_code == 200
    assert res.json()["status"] == "APPROVED"

    # Verify Operator A's credential now reflects the new vehicle (veh-test-traveller)
    op_token = get_token_for("usr-cred-op-a")
    op_headers = {"Authorization": f"Bearer {op_token}"}
    cred_res = client.get("/api/v1/tour-operator/credential", headers=op_headers)
    assert cred_res.status_code == 200
    assigned_veh_ids = [v["vehicleId"] for v in cred_res.json()["assignedVehicles"]]
    assert "veh-test-traveller" in assigned_veh_ids
    assert "veh-test-innova" not in assigned_veh_ids


# ==============================================================================
# TESTS 10 - 18: DYNAMIC DESTINATION-BASED CUSTOMER DISCOVERY
# ==============================================================================

def test_10_tour_operator_creates_shimla_tour_saved_in_db():
    token = get_token_for("usr-cred-op-a")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "title": "Shimla & Kufri Himalayan Ridge Explorer",
        "destination_key": "shimla",
        "destination_name": "Himachal Pradesh (Shimla)",
        "destinations_json": ["shimla", "kufri", "himachal"],
        "category": "heritage",
        "duration_days": 4,
        "duration_nights": 3,
        "base_price_inr": 16500.0,
        "discounted_price_inr": 14999.0,
        "max_capacity_per_batch": 12,
        "inclusions_json": ["Heritage Resort Stay", "Toy Train Heritage Ride"],
        "cover_image_url": "https://example.com/shimla.jpg"
    }

    res = client.post("/api/v1/tour-operator/packages", json=payload, headers=headers)
    assert res.status_code == 201
    global shimla_package_id
    shimla_package_id = res.json()["id"]


def test_11_customer_searches_shimla_discovers_tour():
    res = client.get("/api/v1/tour-operator/public/discover?destination=shimla")
    assert res.status_code == 200
    tours = res.json()
    titles = [t["title"] for t in tours]
    assert any("Shimla & Kufri Himalayan Ridge Explorer" in title for title in titles)


def test_12_customer_searches_kerala_does_not_find_shimla_only_tour():
    res = client.get("/api/v1/tour-operator/public/discover?destination=kerala")
    assert res.status_code == 200
    tours = res.json()
    titles = [t["title"] for t in tours]
    assert "Shimla & Kufri Himalayan Ridge Explorer" not in titles


def test_13_15_tour_operator_updates_price_and_availability_reflected_to_customer():
    op_token = get_token_for("usr-cred-op-a")
    op_headers = {"Authorization": f"Bearer {op_token}"}

    # Update price to 18,000 INR and max capacity to 8
    res = client.put(
        f"/api/v1/tour-operator/packages/{shimla_package_id}",
        json={"base_price_inr": 18000.0, "max_capacity_per_batch": 8},
        headers=op_headers
    )
    assert res.status_code == 200

    # Customer searches again -> must immediately see ₹18,000 and max capacity 8
    search_res = client.get("/api/v1/tour-operator/public/discover?destination=shimla")
    assert search_res.status_code == 200
    matched = next((t for t in search_res.json() if t["id"] == shimla_package_id), None)
    assert matched is not None
    assert matched["basePriceINR"] == 18000.0
    assert matched["maxCapacityPerBatch"] == 8


def test_16_tour_operator_unpublishes_tour_removed_from_customer_discovery():
    op_token = get_token_for("usr-cred-op-a")
    op_headers = {"Authorization": f"Bearer {op_token}"}

    # Pause/unpublish tour
    res = client.put(
        f"/api/v1/tour-operator/packages/{shimla_package_id}",
        json={"status": "PAUSED"},
        headers=op_headers
    )
    assert res.status_code == 200

    # Customer searches again -> tour must no longer be discoverable
    search_res = client.get("/api/v1/tour-operator/public/discover?destination=shimla")
    assert search_res.status_code == 200
    matched = next((t for t in search_res.json() if t["id"] == shimla_package_id), None)
    assert matched is None


def test_17_multi_destination_tour_discoverable_across_all_destinations():
    op_token = get_token_for("usr-cred-op-a")
    op_headers = {"Authorization": f"Bearer {op_token}"}

    # Create Delhi -> Agra -> Jaipur multi-destination tour
    payload = {
        "title": "Delhi, Agra & Jaipur Grand Royal Circuit",
        "destination_key": "delhi",
        "destination_name": "Delhi-Agra-Jaipur",
        "destinations_json": ["delhi", "agra", "jaipur"],
        "category": "heritage",
        "duration_days": 6,
        "duration_nights": 5,
        "base_price_inr": 26000.0,
        "status": "PUBLISHED"
    }

    res = client.post("/api/v1/tour-operator/packages", json=payload, headers=op_headers)
    assert res.status_code == 201

    # Search by "Delhi"
    res_delhi = client.get("/api/v1/tour-operator/public/discover?destination=delhi")
    assert any("Grand Royal Circuit" in t["title"] for t in res_delhi.json())

    # Search by "Agra"
    res_agra = client.get("/api/v1/tour-operator/public/discover?destination=agra")
    assert any("Grand Royal Circuit" in t["title"] for t in res_agra.json())

    # Search by "Jaipur"
    res_jaipur = client.get("/api/v1/tour-operator/public/discover?destination=jaipur")
    assert any("Grand Royal Circuit" in t["title"] for t in res_jaipur.json())


def test_19_tour_operator_b_cannot_modify_operator_a_package():
    op_b_token = get_token_for("usr-cred-op-b")
    op_b_headers = {"Authorization": f"Bearer {op_b_token}"}

    res = client.put(
        f"/api/v1/tour-operator/packages/{shimla_package_id}",
        json={"title": "Hacked Title"},
        headers=op_b_headers
    )
    assert res.status_code == 403

