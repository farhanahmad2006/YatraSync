# Changes made by @MdFarhanAhmad
import pytest
import uuid
from datetime import datetime, timedelta
import sys
import os
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.config import settings
from app.db.database import SessionLocal
from app.db.models import User, OTPVerificationSession

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_users():
    db = SessionLocal()
    try:
        # Clean OTP sessions between test runs
        db.query(OTPVerificationSession).delete()
        db.commit()

        # 1. Customer User
        cust = db.query(User).filter(User.mobile == "+91 98401 23456").first()
        if not cust:
            cust = User(name="Test Customer", mobile="+91 98401 23456", email="priya@example.com", role="CUSTOMER", is_verified=True)
            db.add(cust)

        # 2. Hotel Admin User
        hotel = db.query(User).filter(User.mobile == "+91 94471 88990").first()
        if not hotel:
            hotel = User(name="Test Hotel Admin", mobile="+91 94471 88990", email="mathew@munnarteahills.in", role="HOTEL_ADMIN", is_verified=True)
            db.add(hotel)

        # 3. Transport Admin User
        transport = db.query(User).filter(User.mobile == "+91 98765 11111").first()
        if not transport:
            transport = User(name="Test Transport Admin", mobile="+91 98765 11111", email="ramesh@safarsetu-fleet.in", role="TRANSPORT_ADMIN", is_verified=True)
            db.add(transport)

        # 4. Super Admin User
        admin = db.query(User).filter(User.mobile == "+91 99999 00000").first()
        if not admin:
            admin = User(name="Test Super Admin", mobile="+91 99999 00000", email="admin@safarsetu.in", role="SUPER_ADMIN", is_verified=True)
            db.add(admin)

        db.commit()
    finally:
        db.close()

# -------------------------------------------------------------
# 1. CUSTOMER + 9568 -> Success in Development
# -------------------------------------------------------------
def test_customer_master_otp_success():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "+91 98401 23456",
        "otp": "9568"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "CUSTOMER"

# -------------------------------------------------------------
# 2. CUSTOMER + Wrong OTP -> Failure
# -------------------------------------------------------------
def test_customer_wrong_otp_failure():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "+91 98401 23456",
        "otp": "1111"
    })
    assert res.status_code == 400
    assert "Enter the correct otp" in str(res.json())

# -------------------------------------------------------------
# 3. HOTEL_ADMIN + 9568 -> Success in Development
# -------------------------------------------------------------
def test_hotel_admin_master_otp_success():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "mathew@munnarteahills.in",
        "otp": "9568"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

# -------------------------------------------------------------
# 4. TRANSPORT_ADMIN + 9568 -> Success in Development
# -------------------------------------------------------------
def test_transport_admin_master_otp_success():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "ramesh@safarsetu-fleet.in",
        "otp": "9568"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

# -------------------------------------------------------------
# 5. SUPER_ADMIN + 8659 -> Success in Development
# -------------------------------------------------------------
def test_super_admin_master_otp_success():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "admin@safarsetu.in",
        "otp": "8659"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

# -------------------------------------------------------------
# 6. SUPER_ADMIN + 9568 -> Failure (Super admin OTP required)
# -------------------------------------------------------------
def test_super_admin_with_non_super_otp_fails():
    res = client.post("/api/v1/auth/login", json={
        "phone_or_email": "admin@safarsetu.in",
        "otp": "9568"
    })
    assert res.status_code == 400
    assert "Enter the correct otp" in str(res.json())

# -------------------------------------------------------------
# 7, 8, 9. NON-SUPER-ADMIN + 8659 -> Failure (Role Safety)
# -------------------------------------------------------------
def test_non_super_admins_with_super_otp_fails():
    for phone in ["+91 98401 23456", "mathew@munnarteahills.in", "ramesh@safarsetu-fleet.in"]:
        res = client.post("/api/v1/auth/login", json={
            "phone_or_email": phone,
            "otp": "8659"
        })
        assert res.status_code == 400
        assert "Enter the correct otp" in str(res.json())

# -------------------------------------------------------------
# 10, 11, 12, 13. Attempt Count Tracking & 3-Attempt Session Termination
# -------------------------------------------------------------
def test_otp_attempt_limits_and_lockout():
    phone = "+91 98888 77777"
    
    # Request challenge
    req_res = client.post("/api/v1/auth/request-otp", json={
        "phone_or_email": phone,
        "purpose": "LOGIN"
    })
    assert req_res.status_code == 200
    session_id = req_res.json()["session_id"]

    # Attempt 1: Wrong
    res1 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "0000"})
    assert res1.status_code == 400

    # Attempt 2: Wrong
    res2 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "0000"})
    assert res2.status_code == 400

    # Attempt 3: Wrong -> LOCKOUT (OTP_ATTEMPTS_EXCEEDED)
    res3 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "0000"})
    assert res3.status_code == 400
    err_data = res3.json()["detail"]
    assert err_data["error_code"] == "OTP_ATTEMPTS_EXCEEDED"
    assert "OTP verification session expired" in err_data["message"]

    # Attempt 4: Fourth attempt on locked session -> Fails
    res4 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "9568"})
    assert res4.status_code == 400
    assert res4.json()["detail"]["error_code"] == "OTP_ATTEMPTS_EXCEEDED"

# -------------------------------------------------------------
# 14. Server-side attempt count protection (Frontend cannot reset attempt_count)
# -------------------------------------------------------------
def test_frontend_cannot_reset_attempt_count():
    phone = "+91 97777 66666"
    req_res = client.post("/api/v1/auth/request-otp", json={"phone_or_email": phone, "purpose": "LOGIN"})
    session_id = req_res.json()["session_id"]

    # Send 2 wrong attempts
    client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "0000"})
    client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "0000"})

    # Attempt to pass attempt_count = 0 in payload
    res3 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "0000", "attempt_count": 0})
    assert res3.status_code == 400
    assert res3.json()["detail"]["error_code"] == "OTP_ATTEMPTS_EXCEEDED"

# -------------------------------------------------------------
# 15. Expired OTP Session -> Reject
# -------------------------------------------------------------
def test_expired_otp_session_fails():
    db = SessionLocal()
    try:
        phone = "+91 96666 55555"
        expired_session = OTPVerificationSession(
            mobile_or_email=phone,
            purpose="LOGIN",
            status="PENDING",
            expires_at=datetime.utcnow() - timedelta(minutes=5),
            attempt_count=0,
            max_attempts=3
        )
        db.add(expired_session)
        db.commit()
        db.refresh(expired_session)

        res = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": expired_session.id, "otp": "9568"})
        assert res.status_code == 400
        assert res.json()["detail"]["error_code"] == "OTP_SESSION_EXPIRED"
    finally:
        db.close()

# -------------------------------------------------------------
# 16 & 17. Successful OTP and Reusing Verified Session -> Reject
# -------------------------------------------------------------
def test_reuse_verified_session_fails():
    phone = "+91 95555 44444"
    req_res = client.post("/api/v1/auth/request-otp", json={"phone_or_email": phone, "purpose": "LOGIN"})
    session_id = req_res.json()["session_id"]

    # First successful login
    res1 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "9568"})
    assert res1.status_code == 200

    # Second attempt with same verified session -> Reject
    res2 = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "session_id": session_id, "otp": "9568"})
    assert res2.status_code == 400

# -------------------------------------------------------------
# 19, 20, 21. Registration via OTP
# -------------------------------------------------------------
def test_registrations_via_master_otp():
    rand_sfx = uuid.uuid4().hex[:6]
    phone1 = f"+91 911{uuid.uuid4().int % 1000000:07d}"
    phone2 = f"+91 922{uuid.uuid4().int % 1000000:07d}"
    email1 = f"newcust_{rand_sfx}@example.com"
    email2 = f"hotelier_{rand_sfx}@example.com"

    # Customer registration
    res1 = client.post("/api/v1/auth/register", json={
        "name": "New Customer",
        "phone": phone1,
        "email": email1,
        "role": "CUSTOMER",
        "otp": "9568"
    })
    assert res1.status_code == 200
    assert res1.json()["user"]["role"] == "CUSTOMER"

    # Hotel Admin registration
    res2 = client.post("/api/v1/auth/register", json={
        "name": "New Hotelier",
        "phone": phone2,
        "email": email2,
        "role": "HOTEL_ADMIN",
        "otp": "9568"
    })
    assert res2.status_code == 200

# -------------------------------------------------------------
# Production Environment Check (Master OTP Disabled)
# -------------------------------------------------------------
def test_production_environment_disables_master_otp():
    original_env = settings.APP_ENV
    try:
        settings.APP_ENV = "production"
        res = client.post("/api/v1/auth/login", json={
            "phone_or_email": "+91 98401 23456",
            "otp": "9568"
        })
        assert res.status_code == 400
    finally:
        settings.APP_ENV = original_env
