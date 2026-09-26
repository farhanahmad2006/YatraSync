# Changes made by @MdFarhanAhmad
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Driver, Vehicle, Booking, AuditLog, Notification
from app.core.permissions import get_current_user_optional
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/partner", tags=["Partner Portal & Operations"])

@router.get("/dashboard")
def get_partner_dashboard(
    x_partner_id: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    driver = None
    if current_user:
        driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver and x_partner_id:
        driver = db.query(Driver).filter(Driver.id == x_partner_id).first()
    
    full_name = current_user.name if current_user else (driver.full_name if driver else "Partner")
    partner_id = driver.id if driver else (x_partner_id or (current_user.id if current_user else "ptr-1"))

    return {
        "partnerId": partner_id,
        "fullName": full_name,
        "rating": driver.rating if driver else 4.96,
        "completedTrips": driver.total_trips if driver else 0,
        "cancellationRate": "0.0%",
        "onTimeRate": "100.0%",
        "availabilityStatus": driver.availability_status if driver else "AVAILABLE",
        "monthlyEarningsINR": 0.0 if not driver or driver.total_trips == 0 else 48500.0,
        "pendingPayoutINR": 0.0 if not driver or driver.total_trips == 0 else 12400.0
    }

@router.get("/assignments")
def get_partner_assignments(
    x_partner_id: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    driver = None
    if current_user:
        driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver and x_partner_id:
        driver = db.query(Driver).filter(Driver.id == x_partner_id).first()

    partner_name = current_user.name if current_user else (driver.full_name if driver else "Partner")
    partner_id = driver.id if driver else (x_partner_id or "ptr-1")

    bookings = db.query(Booking).all()
    assignments = []
    for idx, b in enumerate(bookings):
        assignments.append({
            "id": f"asg-{idx + 101}",
            "tripId": b.trip_id or "TRIP-KER-01",
            "bookingId": b.id,
            "pnr": b.pnr,
            "partnerId": partner_id,
            "partnerName": partner_name,
            "assignedRole": "DRIVER_STORYTELLER",
            "travelerName": b.traveler_name,
            "travelerPhone": b.traveler_phone,
            "guestsCount": b.guests_count,
            "luggageCount": "2 Bags",
            "pickupDate": "14/10/2026",
            "pickupTime": "09:30 AM",
            "pickupLocation": "Cochin International Airport (COK) — Gate 3",
            "pickupGate": "Gate 3",
            "pickupCoordinates": {"lat": 10.1518, "lng": 76.3930},
            "dropDate": "18/10/2026",
            "dropTime": "05:00 PM",
            "dropLocation": "Kumarakom Vembanad Heritage Homestay",
            "dropCoordinates": {"lat": 9.6175, "lng": 76.4301},
            "destinationName": b.destination_name,
            "destinationKey": b.destination_key,
            "serviceType": "Full Day Chauffeur & Storyteller",
            "status": "ACCEPTED",
            "statusTimeline": [
                {"status": "OFFERED", "timestamp": "12/09/2026, 10:00 AM"},
                {"status": "ACCEPTED", "timestamp": "12/09/2026, 10:05 AM"}
            ],
            "estimatedDistanceKm": 145,
            "estimatedDurationHours": 4.5,
            "currentStopIndex": 0,
            "stops": [],
            "travelerPreferences": {
                "travelStyle": "Relaxed Heritage & Spices",
                "interests": ["Spice Gardens", "Folklore Lore", "Kathakali Art"],
                "languagePreference": "English & Malayalam",
                "specialRequirements": ["Child Seat", "Non-smoking vehicle"],
                "dietary": "Vegetarian & Kerala Local Seafood"
            },
            "safarSetuInstructions": {
                "version": "2.4",
                "updatedAt": "14/10/2026",
                "items": ["Provide cool sandalwood wipes at pickup", "Brief traveler on Western Ghats biodiversity"],
                "acknowledgedByPartner": True
            },
            "earnings": {
                "baseFare": 2500,
                "distanceComponent": 1800,
                "waitingAllowance": 300,
                "storytellerFee": 1200,
                "bonus": 400,
                "totalPayable": 6200,
                "payoutStatus": "PENDING"
            },
            "preTripChecklistCompleted": True,
            "postTripChecklistCompleted": False,
            "chatMessages": []
        })
    return assignments

@router.get("/documents")
def get_partner_documents(
    x_partner_id: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    return [
        {
            "id": "doc-101",
            "type": "DRIVING_LICENSE",
            "title": "Commercial Driving License",
            "documentNumber": "KL-07-2010-009481",
            "validUntil": "2030-05-15",
            "status": "VERIFIED",
            "issuer": "RTO Ernakulam, Kerala",
            "uploadedAt": "2024-01-10"
        },
        {
            "id": "doc-102",
            "type": "VEHICLE_RC",
            "title": "Vehicle Registration Certificate (RC)",
            "documentNumber": "KL-07-CS-4412",
            "validUntil": "2038-09-20",
            "status": "VERIFIED",
            "issuer": "Motor Vehicles Dept, Kerala",
            "uploadedAt": "2024-01-10"
        },
        {
            "id": "doc-103",
            "type": "AADHAAR_DIGILOCKER",
            "title": "DigiLocker Aadhaar Verification",
            "documentNumber": "•••• •••• 9812",
            "validUntil": "Lifetime",
            "status": "VERIFIED",
            "issuer": "UIDAI / DigiLocker India",
            "uploadedAt": "2024-01-10"
        }
    ]

@router.get("/support/tickets")
def get_partner_support_tickets(
    x_partner_id: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    partner_id = x_partner_id or (current_user.id if current_user else "ptr-1")
    return [
        {
            "id": "TCK-8819",
            "partnerId": partner_id,
            "category": "Traveler Problem",
            "priority": "NORMAL",
            "subject": "Traveler flight delayed by 45 minutes",
            "status": "RESOLVED",
            "createdAt": "14/10/2026, 08:30 AM",
            "updatedAt": "14/10/2026, 09:15 AM",
            "assignedAgent": "YatraSync Ops Control",
            "messages": [
                {"sender": "Partner", "text": "Traveler flight 6E-6518 is delayed by 45 mins. Waiting at arrival lounge.", "time": "08:30 AM"},
                {"sender": "Support", "text": "Acknowledged. Waiting allowance added to payout.", "time": "08:35 AM"}
            ]
        }
    ]
