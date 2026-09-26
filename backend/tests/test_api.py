# Changes made by @MdFarhanAhmad
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "PostgreSQL" in data["database"]

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={
        "phone_or_email": "+91 98401 23456",
        "otp": "9568"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "CUSTOMER"

def test_list_vehicles():
    response = client.get("/api/v1/vehicles")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Strict image matching check
    for vehicle in data:
        if not (vehicle["image_verified"] and vehicle["image_vehicle_match"]):
            assert vehicle["image_url"] == "" or vehicle["image_source"] == "Neutral Placeholder"

def test_check_vehicle_availability():
    response = client.post("/api/v1/vehicles/check-availability", json={
        "vehicleId": "kerala-rv-innova",
        "startDate": "2026-10-14",
        "endDate": "2026-10-18"
    })
    assert response.status_code == 200
    data = response.json()
    assert "available" in data

def test_hotel_search():
    response = client.get("/api/v1/hotels?city=Munnar")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_cart_operations():
    # 1. Get cart
    response = client.get("/api/v1/cart")
    assert response.status_code == 200
    
    # 2. Add item to cart
    add_resp = client.post("/api/v1/cart/items", json={
        "service_type": "RENT_VEHICLE",
        "item_data": {"vehicleName": "Toyota Innova Crysta"},
        "price_snapshot": 3200.0,
        "quantity": 1,
        "start_date": "2026-10-14",
        "end_date": "2026-10-18"
    })
    assert add_resp.status_code == 200
    item_id = add_resp.json()["itemId"]

    # 3. Clear cart
    clear_resp = client.delete("/api/v1/cart/clear")
    assert clear_resp.status_code == 200

def test_analytics_dashboard():
    response = client.get("/api/v1/analytics/dashboard?role=SUPER_ADMIN")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "SUPER_ADMIN"
    assert "totalRevenueINR" in data
