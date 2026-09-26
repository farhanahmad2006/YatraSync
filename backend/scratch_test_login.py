from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

client = TestClient(app)

res = client.post("/api/v1/auth/login", json={
    "phone_or_email": "priya@example.com",
    "otp": "9568"
})

print("Status:", res.status_code)
print("Response JSON:", res.json())
