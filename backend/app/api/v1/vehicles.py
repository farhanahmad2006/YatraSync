# Changes made by @MdFarhanAhmad
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Vehicle, VehicleImage, Booking, User
from app.schemas.schemas import VehicleAvailabilityCheckRequest, VehicleImageVerificationRequest, RentalVehicleResponse
from app.core.permissions import get_current_user_optional, require_transport_admin
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/vehicles", tags=["Vehicle & Rental Management"])

def format_vehicle_response(v: Vehicle) -> dict:
    # STRICT VEHICLE IMAGE MATCHING RULE
    # Check if there is an image with is_verified = True AND vehicle_match_verified = True
    verified_image = None
    if v.images:
        for img in v.images:
            if img.is_verified and img.vehicle_match_verified:
                verified_image = img
                break

    image_url = verified_image.image_url if verified_image else ""
    image_verified = verified_image.is_verified if verified_image else False
    image_vehicle_match = verified_image.vehicle_match_verified if verified_image else False

    return {
        "id": v.id,
        "destinationKey": v.destination_key,
        "manufacturer": v.manufacturer,
        "model": v.model,
        "variant": v.variant,
        "modelYear": v.model_year,
        "name": v.name,
        "category": v.category,
        "categoryLabel": v.category.upper().replace("_", " "),
        "seatingCapacity": v.seating_capacity,
        "transmission": v.transmission,
        "fuelType": v.fuel_type,
        "acAvailable": v.ac_available,
        "dailyRate": v.daily_rate,
        "hourlyRate": v.hourly_rate,
        "driverChargePerDay": v.driver_charge_per_day,
        "securityDeposit": v.security_deposit,
        "registrationState": v.registration_state,
        "rentalLocation": v.rental_location,
        "vendorName": v.vendor_name,
        "vendorPhone": v.vendor_phone,
        "vendorRating": v.vendor_rating,
        "supportsSelfDrive": v.supports_self_drive,
        "supportsWithDriver": v.supports_with_driver,
        "features": v.features_json or ["GPS Navigation", "Air Conditioning"],
        "termsAndConditions": v.terms_json or ["Valid Driving License required", "Zero security deduction guarantee"],
        "zeroCommissionVerified": v.zero_commission_verified,
        "image_url": image_url,
        "image_source": "Verified Partner Fleet" if image_verified else "Neutral Placeholder",
        "image_verified": image_verified,
        "image_vehicle_match": image_vehicle_match
    }

@router.get("", response_model=List[dict])
def list_vehicles(
    destinationKey: Optional[str] = None,
    category: Optional[str] = None,
    self_drive: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle).filter(Vehicle.status == "AVAILABLE")
    if destinationKey:
        query = query.filter(Vehicle.destination_key == destinationKey)
    if category:
        query = query.filter(Vehicle.category == category)
    if self_drive is not None:
        if self_drive:
            query = query.filter(Vehicle.supports_self_drive == True)

    vehicles = query.all()
    return [format_vehicle_response(v) for v in vehicles]

@router.post("/check-availability")
def check_availability(
    request: VehicleAvailabilityCheckRequest,
    db: Session = Depends(get_db)
):
    # Check existing bookings for overlap
    vehicle = db.query(Vehicle).filter(Vehicle.id == request.vehicleId).first()
    if not vehicle:
        return {"available": True, "vehicleId": request.vehicleId, "startDate": request.startDate, "endDate": request.endDate}

    # Check active bookings containing this rental vehicle
    bookings = db.query(Booking).filter(Booking.status.in_(["Confirmed", "Active"])).all()
    is_overlap = False

    for b in bookings:
        rv = b.rental_vehicle_details_json
        if rv and isinstance(rv, dict) and rv.get("vehicle", {}).get("id") == request.vehicleId:
            p_start = rv.get("pickupDate")
            p_end = rv.get("returnDate")
            if p_start and p_end:
                if not (request.endDate <= p_start or request.startDate >= p_end):
                    is_overlap = True
                    break

    return {
        "available": not is_overlap,
        "vehicleId": request.vehicleId,
        "startDate": request.startDate,
        "endDate": request.endDate
    }

@router.post("/image-verification")
def verify_vehicle_image(
    request: VehicleImageVerificationRequest,
    db: Session = Depends(get_db),
    admin: Optional[User] = Depends(get_current_user_optional)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == request.vehicleId).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    images = db.query(VehicleImage).filter(VehicleImage.vehicle_id == vehicle.id).all()
    if not images:
        img = VehicleImage(
            vehicle_id=vehicle.id,
            image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
            is_verified=request.verified,
            vehicle_match_verified=request.match,
            verified_at=datetime.utcnow(),
            verified_by=admin.name if admin else "Transport Inspector"
        )
        db.add(img)
    else:
        for img in images:
            img.is_verified = request.verified
            img.vehicle_match_verified = request.match
            img.verified_at = datetime.utcnow()
            img.verified_by = admin.name if admin else "Transport Inspector"

    db.commit()

    log_audit_event(
        db,
        action="VEHICLE_IMAGE_VERIFICATION",
        entity_type="VEHICLE",
        entity_id=vehicle.id,
        actor_user_id=admin.id if admin else None,
        actor_role=admin.role if admin else "ADMIN",
        new_value={"is_verified": request.verified, "vehicle_match_verified": request.match},
        description=f"Vehicle image verification updated for {vehicle.manufacturer} {vehicle.model} (verified={request.verified}, match={request.match})."
    )

    return {
        "message": "Vehicle image verification updated",
        "vehicleId": vehicle.id,
        "image_verified": request.verified,
        "image_vehicle_match": request.match
    }
