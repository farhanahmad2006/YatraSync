# Global Authentication & Identity Verification Test Suite
import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.database import get_db, SessionLocal
from app.db.models import User, Hotel, Driver, Trip, Booking
from app.core.security import get_password_hash

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_seed_users():
    db = SessionLocal()
    try:
        # Seed or ensure core users exist
        users = [
            ("usr-admin-1", "SafarSetu Super Admin", "admin@safarsetu.in", "+91 99999 00000", "Admin@123456", "SUPER_ADMIN"),
            ("usr-hotel-1", "Mathew Joseph", "mathew@munnarteahills.in", "+91 94471 88990", "Hotel@123456", "HOTEL_ADMIN"),
            ("usr-transport-1", "Ramesh Sharma", "ramesh@safarsetu-fleet.in", "+91 98765 11111", "Transport@123456", "TRANSPORT_ADMIN"),
            ("usr-1", "Priya Sundaram", "priya@example.com", "+91 98401 23456", "Customer@123456", "CUSTOMER"),
            ("usr-owner-b", "George Kurian (Wayanad Wild)", "owner_b@wayanadwild.in", "+91 94471 22334", "Owner@123456", "HOTEL_OWNER"),
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

        # Seed hotel for usr-owner-b if not exists
        h = db.query(Hotel).filter(Hotel.owner_id == "usr-owner-b").first()
        if not h:
            h = Hotel(
                id="prop-102",
                property_name="Wayanad Wild Rainforest Lodge",
                property_type="resort",
                owner_id="usr-owner-b",
                owner_name="George Kurian",
                contact_phone="+91 94471 22334",
                contact_email="owner_b@wayanadwild.in",
                destination="Wayanad",
                state="Kerala",
                address="Lakkidi, Wayanad",
                pincode="673576",
                base_price_per_night=5500.0,
                star_rating=4.7,
                total_rooms=12,
                available_rooms=12,
                verified=True,
                status="ACTIVE"
            )
            db.add(h)
        db.commit()
    finally:
        db.close()

import uuid

# 1. TEST REGISTRATION & LOGIN FOR CUSTOMER
def test_customer_registration_and_login():
    rand_sfx = uuid.uuid4().hex[:6]
    email = f"test_cust_{rand_sfx}@example.com"
    mobile = f"9811{uuid.uuid4().int % 1000000:06d}"
    pwd = "TestCustPass@123"

    # 1. Register
    res_reg = client.post("/api/v1/auth/register", json={
        "name": "Test Customer Alpha",
        "phone": mobile,
        "email": email,
        "password": pwd,
        "role": "CUSTOMER"
    })
    assert res_reg.status_code == 200, res_reg.text
    data_reg = res_reg.json()
    assert data_reg["user"]["name"] == "Test Customer Alpha"
    assert data_reg["user"]["email"] == email
    assert data_reg["user"]["role"] == "CUSTOMER"
    token = data_reg["access_token"]

    # 2. Login with correct password
    res_login = client.post("/api/v1/auth/login", json={
        "phone_or_email": email,
        "password": pwd
    })
    assert res_login.status_code == 200
    data_login = res_login.json()
    assert data_login["user"]["name"] == "Test Customer Alpha"
    assert data_login["user"]["email"] == email
    assert data_login["user"]["role"] == "CUSTOMER"

    # 3. GET /api/v1/auth/me returns this exact user
    res_me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    me_data = res_me.json()
    assert me_data["name"] == "Test Customer Alpha"
    assert me_data["email"] == email

# 2. TEST REGISTRATION & LOGIN FOR HOTEL ADMIN
def test_hotel_admin_registration_and_login():
    rand_sfx = uuid.uuid4().hex[:6]
    email = f"test_hadmin_{rand_sfx}@example.com"
    mobile = f"9822{uuid.uuid4().int % 1000000:06d}"
    pwd = "HotelAdminPass@123"

    res_reg = client.post("/api/v1/auth/register", json={
        "name": "Rohan Verma",
        "phone": mobile,
        "email": email,
        "password": pwd,
        "role": "HOTEL_ADMIN"
    })
    assert res_reg.status_code == 200
    data_reg = res_reg.json()
    assert data_reg["user"]["name"] == "Rohan Verma"
    assert data_reg["user"]["role"] == "HOTEL_ADMIN"

    # Login
    res_login = client.post("/api/v1/auth/login", json={
        "phone_or_email": email,
        "password": pwd
    })
    assert res_login.status_code == 200
    data_login = res_login.json()
    assert data_login["user"]["name"] == "Rohan Verma"
    assert data_login["user"]["role"] == "HOTEL_ADMIN"

# 3. TEST REGISTRATION & LOGIN FOR TRANSPORT ADMIN
def test_transport_admin_registration_and_login():
    rand_sfx = uuid.uuid4().hex[:6]
    email = f"test_driver_{rand_sfx}@example.com"
    mobile = f"9833{uuid.uuid4().int % 1000000:06d}"
    pwd = "DriverPass@123"

    res_reg = client.post("/api/v1/auth/register", json={
        "name": "Arun Kumar Driver",
        "phone": mobile,
        "email": email,
        "password": pwd,
        "role": "TRANSPORT_ADMIN",
        "operator_sub_role": "GUIDE_DRIVER"
    })
    assert res_reg.status_code == 200
    data_reg = res_reg.json()
    assert data_reg["user"]["name"] == "Arun Kumar Driver"
    assert data_reg["user"]["role"] == "TRANSPORT_ADMIN"
    assert data_reg["user"]["partnerId"] is not None

    # Login
    res_login = client.post("/api/v1/auth/login", json={
        "phone_or_email": email,
        "password": pwd
    })
    assert res_login.status_code == 200
    data_login = res_login.json()
    assert data_login["user"]["name"] == "Arun Kumar Driver"
    assert data_login["user"]["partnerId"] is not None
    assert res_login.status_code == 200
    data_login = res_login.json()
    assert data_login["user"]["name"] == "Arun Kumar Driver"
    assert data_login["user"]["partnerId"] is not None

# 4. TEST WRONG PASSWORD REJECTION (HTTP 401)
def test_wrong_password_rejected():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "priya@example.com",
        "password": "CompletelyWrongPassword!123"
    })
    assert res.status_code == 401
    assert "Invalid login credentials" in res.json()["detail"]

# 5. TEST NONEXISTENT ACCOUNT (HTTP 401 / 404)
def test_nonexistent_account_rejected():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "doesnotexist_random_9999@example.com",
        "password": "SomePassword@123"
    })
    assert res.status_code == 401

# 6. TEST MASTER OTP IN DEV ENVIRONMENT
def test_master_otp_authentication():
    # Customer uses 9568
    res1 = client.post("/api/v1/auth/login", json={
        "phone_or_email": "priya@example.com",
        "otp": "9568"
    })
    assert res1.status_code == 200
    assert res1.json()["user"]["name"] == "Priya Sundaram"

    # Super Admin uses 8659
    res2 = client.post("/api/v1/auth/login", json={
        "phone_or_email": "admin@safarsetu.in",
        "otp": "8659"
    })
    assert res2.status_code == 200
    assert res2.json()["user"]["role"] == "SUPER_ADMIN"

    # Super Admin with wrong OTP 9568 fails
    res3 = client.post("/api/v1/auth/login", json={
        "phone_or_email": "admin@safarsetu.in",
        "otp": "9568"
    })
    assert res3.status_code == 400

# 7. TEST ROLE SPOOFING PREVENTION
def test_prevent_super_admin_self_provisioning():
    rand_sfx = uuid.uuid4().hex[:6]
    email = f"malicious_{rand_sfx}@example.com"
    mobile = f"9877{uuid.uuid4().int % 1000000:06d}"

    res = client.post("/api/v1/auth/register", json={
        "name": "Fake Admin",
        "phone": mobile,
        "email": email,
        "password": "Password123",
        "role": "SUPER_ADMIN"
    })
    assert res.status_code == 200
    # Must be sanitized to CUSTOMER
    assert res.json()["user"]["role"] == "CUSTOMER"

# 8. TEST HOTEL OWNER LOGIN & PROPERTY RESOLUTION
def test_hotel_owner_login_and_property_resolution():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "owner_b@wayanadwild.in",
        "password": "Owner@123456"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "HOTEL_OWNER"
    assert data["user"]["email"] == "owner_b@wayanadwild.in"
    assert data["user"]["hotelPropertyId"] == "prop-102"
    token = data["access_token"]

    # Verify /api/v1/auth/me returns HOTEL_OWNER and hotelPropertyId
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["role"] == "HOTEL_OWNER"
    assert me_data["hotelPropertyId"] == "prop-102"
