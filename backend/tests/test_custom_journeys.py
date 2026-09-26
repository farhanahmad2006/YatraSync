# Changes made by @MdFarhanAhmad
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import SessionLocal, Base, engine
from app.db.models import User, CustomJourney, CustomJourneyDestination, DestinationActivity
from app.core.security import create_access_token, get_password_hash

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_users():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # User A (Customer A)
        user_a = db.query(User).filter(User.email == "customer.a@example.com").first()
        if not user_a:
            user_a = User(
                id="usr-cust-a",
                name="Customer A",
                email="customer.a@example.com",
                mobile="+91 99111 00001",
                password_hash=get_password_hash("Password@123"),
                role="CUSTOMER",
                status="ACTIVE",
                is_verified=True
            )
            db.add(user_a)

        # User B (Customer B)
        user_b = db.query(User).filter(User.email == "customer.b@example.com").first()
        if not user_b:
            user_b = User(
                id="usr-cust-b",
                name="Customer B",
                email="customer.b@example.com",
                mobile="+91 99111 00002",
                password_hash=get_password_hash("Password@123"),
                role="CUSTOMER",
                status="ACTIVE",
                is_verified=True
            )
            db.add(user_b)

        # Seed test DestinationActivity if needed
        if db.query(DestinationActivity).count() == 0:
            act1 = DestinationActivity(
                id="act-test-mun-1",
                destination_key="munnar",
                name="Kolukkumalai 4x4 Sunrise Jeep Safari",
                category="Adventure",
                duration_hours=3.5,
                approx_cost_inr=1200.0,
                location_name="Kolukkumalai Peak",
                best_time_of_day="Morning",
                description="Early morning off-road jeep ascent through rugged mountain tracks.",
                is_verified=True
            )
            act2 = DestinationActivity(
                id="act-test-mun-2",
                destination_key="munnar",
                name="Lockhart Tea Factory Tour & Sensory Tasting",
                category="Nature",
                duration_hours=1.5,
                approx_cost_inr=350.0,
                location_name="Lockhart Estate",
                best_time_of_day="Morning",
                description="Step inside orthodox tea processing factory.",
                is_verified=True
            )
            act3 = DestinationActivity(
                id="act-test-koc-1",
                destination_key="kochi",
                name="Fort Kochi Heritage Walk",
                category="Heritage",
                duration_hours=2.0,
                approx_cost_inr=400.0,
                location_name="Fort Kochi",
                best_time_of_day="Morning",
                description="Historic walk covering colonial lanes.",
                is_verified=True
            )
            db.add_all([act1, act2, act3])

        db.commit()
    finally:
        db.close()

def get_auth_header(user_id: str, email: str, role: str = "CUSTOMER"):
    token = create_access_token(subject=user_id, role=role)
    return {"Authorization": f"Bearer {token}"}


def test_destinations_catalog_endpoint():
    res = client.get("/api/v1/custom-journeys/destinations")
    assert res.status_code == 200
    data = res.json()
    assert "startingLocations" in data
    assert "destinations" in data
    assert len(data["destinations"]) >= 5
    # Verify Munnar and Kochi are present in catalog
    keys = [d["key"] for d in data["destinations"]]
    assert "munnar" in keys
    assert "kochi" in keys


def test_intelligent_recommendations_proximity_and_preferences():
    # Customer selects Kochi & Munnar with Nature preferences
    payload = {
        "selected_destinations": ["kochi", "munnar"],
        "starting_location": "Hyderabad",
        "user_preferences": ["Nature", "Wildlife"],
        "total_duration_days": 6
    }
    res = client.post("/api/v1/custom-journeys/recommendations", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recommendedDestinations" in data
    assert "recommendedHotels" in data
    assert "transportSegments" in data

    recs = data["recommendedDestinations"]
    assert len(recs) > 0
    # Top recommended destinations near Munnar (such as Thekkady or Alleppey) should be top-ranked
    top_keys = [r["key"] for r in recs[:3]]
    assert "thekkady" in top_keys or "alleppey" in top_keys

    # Verify explainable reason is provided
    assert "explanation" in recs[0]
    assert len(recs[0]["explanation"]) > 10
    assert "distanceKm" in recs[0]
    assert "estimatedTravelHours" in recs[0]


def test_custom_journey_crud_and_ownership_isolation():
    token_a = get_auth_header("usr-cust-a", "customer.a@example.com")
    token_b = get_auth_header("usr-cust-b", "customer.b@example.com")

    # 1. Customer A saves a custom journey
    create_payload = {
        "title": "Kerala Hills & Backwaters Custom Journey",
        "start_location": "Hyderabad",
        "start_date": "2026-10-14",
        "end_date": "2026-10-20",
        "duration_days": 6,
        "total_nights": 5,
        "adults_count": 2,
        "children_count": 0,
        "budget_inr": 35000.0,
        "preferences": ["Nature", "Relaxation"],
        "status": "PLANNING",
        "destinations": [
            {
                "destination_key": "kochi",
                "destination_name": "Kochi",
                "sequence_order": 1,
                "stay_nights": 1,
                "transport_mode": "Flight"
            },
            {
                "destination_key": "munnar",
                "destination_name": "Munnar",
                "sequence_order": 2,
                "stay_nights": 2,
                "transport_mode": "Car / Tourist Vehicle"
            },
            {
                "destination_key": "thekkady",
                "destination_name": "Thekkady",
                "sequence_order": 3,
                "stay_nights": 2,
                "transport_mode": "Car / Tourist Vehicle"
            }
        ],
        "cost_estimate": {
            "hotels": 14500,
            "transport": 7200,
            "activities": 2800,
            "total": 24500
        }
    }

    create_res = client.post("/api/v1/custom-journeys", json=create_payload, headers=token_a)
    assert create_res.status_code == 201
    created_journey = create_res.json()["journey"]
    journey_id = created_journey["id"]
    assert created_journey["customerId"] == "usr-cust-a"
    assert len(created_journey["destinations"]) == 3

    # 2. Customer A can retrieve their journey
    get_res = client.get(f"/api/v1/custom-journeys/{journey_id}", headers=token_a)
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Kerala Hills & Backwaters Custom Journey"

    # 3. Customer A can list their journeys
    list_res = client.get("/api/v1/custom-journeys", headers=token_a)
    assert list_res.status_code == 200
    j_ids = [j["id"] for j in list_res.json()]
    assert journey_id in j_ids

    # 4. STRICT OWNERSHIP CHECK: Customer B CANNOT access Customer A's journey (Must return 403)
    get_b_res = client.get(f"/api/v1/custom-journeys/{journey_id}", headers=token_b)
    assert get_b_res.status_code == 403
    assert "Not authorized" in get_b_res.json()["detail"]

    # 5. Customer B CANNOT update Customer A's journey (Must return 403)
    update_b_res = client.put(f"/api/v1/custom-journeys/{journey_id}", json={"title": "Hacked Journey"}, headers=token_b)
    assert update_b_res.status_code == 403

    # 6. Customer B CANNOT delete Customer A's journey (Must return 403)
    delete_b_res = client.delete(f"/api/v1/custom-journeys/{journey_id}", headers=token_b)
    assert delete_b_res.status_code == 403

    # 7. Customer A can update their journey
    update_res = client.put(f"/api/v1/custom-journeys/{journey_id}", json={"title": "Updated Kerala Circuit"}, headers=token_a)
    assert update_res.status_code == 200
    assert update_res.json()["journey"]["title"] == "Updated Kerala Circuit"

    # 8. Customer A can delete their journey
    del_res = client.delete(f"/api/v1/custom-journeys/{journey_id}", headers=token_a)
    assert del_res.status_code == 200
    assert del_res.json()["journeyId"] == journey_id

    # Verify deleted
    not_found_res = client.get(f"/api/v1/custom-journeys/{journey_id}", headers=token_a)
    assert not_found_res.status_code == 404


def test_destination_activities_endpoint():
    # 1. Fetch activities for Munnar
    res = client.get("/api/v1/custom-journeys/activities?destination_key=munnar")
    assert res.status_code == 200
    acts = res.json()
    assert len(acts) > 0
    assert any("Jeep Safari" in a["name"] or "Tea" in a["name"] for a in acts)

    # 2. Category filtering
    res_adv = client.get("/api/v1/custom-journeys/activities?destination_key=munnar&category=Adventure")
    assert res_adv.status_code == 200
    adv_acts = res_adv.json()
    for a in adv_acts:
        assert "Adventure" in a["category"]

    # 3. Search query
    res_search = client.get("/api/v1/custom-journeys/activities?search=Heritage")
    assert res_search.status_code == 200
    search_acts = res_search.json()
    assert len(search_acts) > 0

