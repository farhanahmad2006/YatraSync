# Changes made by @MdFarhanAhmad
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Trip, Booking, User
from app.schemas.schemas import CreateTripRequest
from app.core.permissions import get_current_user_optional, get_current_user
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/trips", tags=["Trip Management"])

@router.get("/summary")
def get_trips_summary(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        return {"bookingsCount": 0, "draftsCount": 0, "totalCount": 0}
    b_count = db.query(Booking).filter(Booking.customer_id == current_user.id, Booking.status != "Cancelled").count()
    t_count = db.query(Trip).filter(Trip.customer_id == current_user.id).count()
    return {
        "bookingsCount": b_count,
        "draftsCount": t_count,
        "totalCount": b_count + t_count
    }

@router.get("", response_model=List[dict])
def list_trips(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        return []
    query = db.query(Trip)
    if current_user.role == "CUSTOMER":
        query = query.filter(Trip.customer_id == current_user.id)
    trips = query.order_by(Trip.created_at.desc()).all()
    results = []
    for t in trips:
        results.append({
            "id": t.id,
            "origin": t.origin,
            "destinationKey": t.destination_key,
            "destinationName": t.destination_name,
            "dates": f"{t.start_date} - {t.end_date}" if (t.start_date and t.end_date and t.start_date != t.end_date) else (t.start_date or "Upcoming"),
            "nights": t.calculated_nights,
            "persona": t.persona,
            "durationDays": t.duration_days,
            "transportId": None,
            "stayId": None,
            "driverId": None,
            "status": t.status,
            "updatedAt": t.updated_at.strftime("%d/%m/%Y, %I:%M %p") if t.updated_at else "Recently"
        })
    return results

@router.post("")
@router.post("/save")
def create_trip(
    request: CreateTripRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    trip_code = f"TRIP-{request.destinationKey.upper()[:3]}-{db.query(Trip).count() + 1:02d}"
    pnr = f"SS-PNR-{db.query(Trip).count() + 1001}"
    
    # Handle dates from either range text or explicit start/end
    start_date = request.startDate
    end_date = request.endDate
    if request.dates and (not start_date or not end_date):
        parts = request.dates.split(" - ")
        start_date = parts[0]
        end_date = parts[1] if len(parts) > 1 else parts[0]
    if not start_date:
        start_date = datetime.utcnow().strftime("%b %d, %Y")
    if not end_date:
        end_date = start_date

    nights = request.nights if request.nights is not None else (request.calculatedNights or 4)

    trip = Trip(
        id=request.id or None,
        customer_id=current_user.id if current_user else None,
        trip_id_code=trip_code,
        pnr=pnr,
        destination_key=request.destinationKey,
        destination_name=request.destinationName,
        origin=request.origin or "Hyderabad",
        start_date=start_date,
        end_date=end_date,
        calculated_nights=nights,
        travelers_count=request.travelersCount or 2,
        duration_days=request.durationDays or 5,
        persona=request.persona or "couple",
        total_cost=request.totalCost or 0.0,
        status="PLANNED"
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)

    log_audit_event(
        db,
        action="TRIP_CREATED",
        entity_type="TRIP",
        entity_id=trip.id,
        actor_user_id=current_user.id if current_user else None,
        actor_role=current_user.role if current_user else "CUSTOMER",
        description=f"Trip '{trip.trip_id_code}' created for {trip.destination_name} starting {trip.start_date}."
    )

    return {
        "message": "Trip draft saved successfully",
        "trip": {
            "id": trip.id,
            "origin": trip.origin,
            "destinationKey": trip.destination_key,
            "destinationName": trip.destination_name,
            "dates": f"{trip.start_date} - {trip.end_date}",
            "nights": trip.calculated_nights,
            "persona": trip.persona,
            "durationDays": trip.duration_days,
            "status": trip.status,
            "updatedAt": "Just now"
        }
    }

@router.delete("/{trip_id}")
def delete_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if current_user and current_user.role == "CUSTOMER" and trip.customer_id and trip.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this trip")
    
    db.delete(trip)
    db.commit()
    return {"message": "Trip draft removed", "tripId": trip_id}

