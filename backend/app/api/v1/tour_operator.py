# Changes made by @MdFarhanAhmad
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.database import get_db
from app.db.models import (
    User,
    TourPackage,
    TourItineraryDay,
    TourActivity,
    TourGuide,
    TourSchedule,
    TourBookingItem,
    Booking,
    TransportCredential,
    TransportCredentialVehicle,
    TransportCredentialDriver,
    TransportChangeRequest,
    Driver,
    Vehicle
)
from app.schemas.schemas import (
    TourPackageCreate,
    TourPackageUpdate,
    TourItineraryDayCreate,
    TourActivityCreate,
    TourGuideCreate,
    TourScheduleCreate,
    TransportChangeRequestCreate
)
from app.core.permissions import (
    get_current_user,
    require_tour_operator,
    require_permission
)
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/tour-operator", tags=["Tour Operator Management"])


def format_package(pkg: TourPackage) -> Dict[str, Any]:
    days = []
    for day in pkg.itinerary_days:
        acts = [{
            "id": a.id,
            "activityName": a.activity_name,
            "activityType": a.activity_type,
            "startTime": a.start_time,
            "durationHours": a.duration_hours,
            "locationName": a.location_name,
            "isOptional": a.is_optional,
            "extraCostInr": a.extra_cost_inr
        } for a in day.activities]
        days.append({
            "id": day.id,
            "dayNumber": day.day_number,
            "title": day.title,
            "description": day.description,
            "mealsIncluded": day.meals_included or [],
            "overnightStay": day.overnight_stay,
            "activities": acts
        })

    schedules = [{
        "id": s.id,
        "startDate": s.start_date,
        "endDate": s.end_date,
        "batchCapacity": s.batch_capacity,
        "bookedSeats": s.booked_seats,
        "availableSeats": max(0, (s.batch_capacity or 15) - (s.booked_seats or 0)),
        "status": s.status,
        "guideId": s.guide_id,
        "guideName": s.guide.full_name if s.guide else None
    } for s in pkg.schedules]

    return {
        "id": pkg.id,
        "operatorId": pkg.operator_id,
        "operatorName": pkg.operator.name if pkg.operator else "Verified Tour Operator",
        "title": pkg.title,
        "destinationKey": pkg.destination_key,
        "destinationName": pkg.destination_name,
        "destinations": pkg.destinations_json or [pkg.destination_key],
        "category": pkg.category,
        "durationDays": pkg.duration_days,
        "durationNights": pkg.duration_nights,
        "basePriceINR": pkg.base_price_inr,
        "discountedPriceINR": pkg.discounted_price_inr,
        "maxCapacityPerBatch": pkg.max_capacity_per_batch,
        "minCapacityPerBatch": pkg.min_capacity_per_batch,
        "difficultyLevel": pkg.difficulty_level,
        "guideRequirement": pkg.guide_requirement,
        "inclusions": pkg.inclusions_json or [],
        "exclusions": pkg.exclusions_json or [],
        "cancellationPolicy": pkg.cancellation_policy,
        "status": pkg.status,
        "rating": pkg.rating,
        "totalBookings": pkg.total_bookings,
        "coverImageUrl": pkg.cover_image_url,
        "gallery": pkg.gallery_json or [],
        "itineraryDays": days,
        "schedules": schedules,
        "createdAt": pkg.created_at.isoformat() if pkg.created_at else None,
        "updatedAt": pkg.updated_at.isoformat() if pkg.updated_at else None
    }


@router.get("/packages")
def list_tour_packages(
    destination: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_PACKAGE_VIEW_OWN"))
):
    query = db.query(TourPackage)
    if current_user.role != "SUPER_ADMIN":
        query = query.filter(TourPackage.operator_id == current_user.id)
    if destination:
        query = query.filter(TourPackage.destination_key == destination.lower())
    if status_filter:
        query = query.filter(TourPackage.status == status_filter.upper())
    packages = query.order_by(TourPackage.created_at.desc()).all()

    return [format_package(p) for p in packages]


@router.post("/packages", status_code=status.HTTP_201_CREATED)
def create_tour_package(
    payload: TourPackageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_PACKAGE_CREATE"))
):
    dest_list = payload.destinations_json or [payload.destination_key]
    pkg = TourPackage(
        operator_id=current_user.id,
        title=payload.title,
        destination_key=payload.destination_key,
        destination_name=payload.destination_name,
        destinations_json=dest_list,
        category=payload.category or "heritage",
        duration_days=payload.duration_days,
        duration_nights=payload.duration_nights,
        base_price_inr=payload.base_price_inr,
        discounted_price_inr=payload.discounted_price_inr,
        max_capacity_per_batch=payload.max_capacity_per_batch,
        min_capacity_per_batch=payload.min_capacity_per_batch,
        difficulty_level=payload.difficulty_level or "MODERATE",
        guide_requirement=payload.guide_requirement or "LICENSED_STORYTELLER",
        inclusions_json=payload.inclusions_json or [],
        exclusions_json=payload.exclusions_json or [],
        cancellation_policy=payload.cancellation_policy,
        status="PUBLISHED",
        cover_image_url=payload.cover_image_url,
        gallery_json=payload.gallery_json or []
    )
    db.add(pkg)
    db.flush()

    if payload.itinerary_days:
        for day_data in payload.itinerary_days:
            day_obj = TourItineraryDay(
                package_id=pkg.id,
                day_number=day_data.day_number,
                title=day_data.title,
                description=day_data.description,
                meals_included=day_data.meals_included or [],
                overnight_stay=day_data.overnight_stay
            )
            db.add(day_obj)
            db.flush()

            if day_data.activities:
                for act_data in day_data.activities:
                    act_obj = TourActivity(
                        itinerary_day_id=day_obj.id,
                        package_id=pkg.id,
                        activity_name=act_data.activity_name,
                        activity_type=act_data.activity_type or "HERITAGE_WALK",
                        start_time=act_data.start_time or "09:00 AM",
                        duration_hours=act_data.duration_hours or 2.0,
                        location_name=act_data.location_name,
                        is_optional=act_data.is_optional or False,
                        extra_cost_inr=act_data.extra_cost_inr or 0.0
                    )
                    db.add(act_obj)

    db.commit()
    db.refresh(pkg)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="TOUR_PACKAGE_CREATE",
        entity_type="TOUR_PACKAGE",
        entity_id=pkg.id,
        description=f"Created tour package '{pkg.title}' in destination '{pkg.destination_name}'."
    )

    return {"message": "Tour package created successfully", "id": pkg.id, "package": format_package(pkg)}


@router.get("/packages/{package_id}")
def get_tour_package(
    package_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_PACKAGE_VIEW_OWN"))
):
    pkg = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    if current_user.role != "SUPER_ADMIN" and pkg.operator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: You do not own this tour package")

    return format_package(pkg)


@router.put("/packages/{package_id}")
def update_tour_package(
    package_id: str,
    payload: TourPackageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_PACKAGE_UPDATE_OWN"))
):
    pkg = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    if current_user.role != "SUPER_ADMIN" and pkg.operator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: You do not own this tour package")

    for field, val in payload.dict(exclude_unset=True).items():
        if field == "inclusions_json":
            pkg.inclusions_json = val
        elif field == "exclusions_json":
            pkg.exclusions_json = val
        elif field == "gallery_json":
            pkg.gallery_json = val
        elif field == "destinations_json":
            pkg.destinations_json = val
        elif hasattr(pkg, field):
            setattr(pkg, field, val)

    pkg.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(pkg)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="TOUR_PACKAGE_UPDATE",
        entity_type="TOUR_PACKAGE",
        entity_id=pkg.id,
        description=f"Updated tour package '{pkg.title}' details/status to {pkg.status}."
    )

    return {"message": "Tour package updated successfully", "id": pkg.id, "package": format_package(pkg)}


@router.delete("/packages/{package_id}")
def delete_tour_package(
    package_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_PACKAGE_DELETE_OWN"))
):
    pkg = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    if current_user.role != "SUPER_ADMIN" and pkg.operator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: You do not own this tour package")

    pkg.status = "ARCHIVED"
    db.commit()

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="TOUR_PACKAGE_DELETE",
        entity_type="TOUR_PACKAGE",
        entity_id=pkg.id,
        description=f"Archived tour package '{pkg.title}'."
    )
    return {"message": "Tour package archived successfully"}


@router.post("/packages/{package_id}/itinerary")
def add_itinerary_day(
    package_id: str,
    payload: TourItineraryDayCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_ITINERARY_MANAGE_OWN"))
):
    pkg = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    if current_user.role != "SUPER_ADMIN" and pkg.operator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: You do not own this tour package")

    day_obj = TourItineraryDay(
        package_id=pkg.id,
        day_number=payload.day_number,
        title=payload.title,
        description=payload.description,
        meals_included=payload.meals_included or [],
        overnight_stay=payload.overnight_stay
    )
    db.add(day_obj)
    db.flush()

    if payload.activities:
        for act in payload.activities:
            act_obj = TourActivity(
                itinerary_day_id=day_obj.id,
                package_id=pkg.id,
                activity_name=act.activity_name,
                activity_type=act.activity_type or "HERITAGE_WALK",
                start_time=act.start_time or "09:00 AM",
                duration_hours=act.duration_hours or 2.0,
                location_name=act.location_name,
                is_optional=act.is_optional or False,
                extra_cost_inr=act.extra_cost_inr or 0.0
            )
            db.add(act_obj)

    db.commit()
    db.refresh(day_obj)
    return {"message": "Itinerary day added successfully", "dayId": day_obj.id}


@router.post("/packages/{package_id}/schedules")
def create_tour_schedule(
    package_id: str,
    payload: TourScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_SCHEDULE_MANAGE_OWN"))
):
    pkg = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    if current_user.role != "SUPER_ADMIN" and pkg.operator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: You do not own this tour package")

    schedule = TourSchedule(
        package_id=pkg.id,
        guide_id=payload.guide_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        batch_capacity=payload.batch_capacity or pkg.max_capacity_per_batch,
        booked_seats=0,
        status="OPEN"
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return {"message": "Tour departure schedule created successfully", "scheduleId": schedule.id}


@router.get("/guides")
def list_tour_guides(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_GUIDE_MANAGE_OWN"))
):
    query = db.query(TourGuide)
    if current_user.role != "SUPER_ADMIN":
        query = query.filter(TourGuide.operator_id == current_user.id)
    guides = query.all()

    return [{
        "id": g.id,
        "operatorId": g.operator_id,
        "fullName": g.full_name,
        "phone": g.phone,
        "email": g.email,
        "languages": g.languages_json or [],
        "specialty": g.specialty,
        "badgeNumber": g.badge_number,
        "rating": g.rating,
        "status": g.status
    } for g in guides]


@router.post("/guides", status_code=status.HTTP_201_CREATED)
def create_tour_guide(
    payload: TourGuideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_GUIDE_MANAGE_OWN"))
):
    guide = TourGuide(
        operator_id=current_user.id,
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        languages_json=payload.languages_json or [],
        specialty=payload.specialty or "Storyteller & Cultural Historian",
        badge_number=payload.badge_number,
        status=payload.status or "ACTIVE",
        rating=4.95
    )
    db.add(guide)
    db.commit()
    db.refresh(guide)

    return {"message": "Tour guide registered successfully", "id": guide.id, "name": guide.full_name}


@router.get("/bookings")
def list_tour_bookings(
    package_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_BOOKINGS_VIEW_OWN"))
):
    query = db.query(TourBookingItem).join(TourPackage, TourBookingItem.package_id == TourPackage.id)
    if current_user.role != "SUPER_ADMIN":
        query = query.filter(TourPackage.operator_id == current_user.id)
    if package_id:
        query = query.filter(TourBookingItem.package_id == package_id)

    items = query.order_by(TourBookingItem.created_at.desc()).all()
    return [{
        "id": item.id,
        "bookingId": item.booking_id,
        "packageId": item.package_id,
        "packageTitle": item.package.title if item.package else "Custom Tour",
        "scheduleId": item.schedule_id,
        "customerName": item.customer_name,
        "customerPhone": item.customer_phone,
        "customerEmail": item.customer_email,
        "travelersCount": item.travelers_count,
        "totalPrice": item.total_price,
        "specialRequests": item.special_requests,
        "status": item.status,
        "createdAt": item.created_at.isoformat() if item.created_at else None
    } for item in items]


@router.get("/analytics")
def get_tour_operator_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_ANALYTICS_VIEW_OWN"))
):
    pkg_query = db.query(TourPackage)
    if current_user.role != "SUPER_ADMIN":
        pkg_query = pkg_query.filter(TourPackage.operator_id == current_user.id)
    packages = pkg_query.all()
    pkg_ids = [p.id for p in packages]

    guides_count = db.query(TourGuide).filter(TourGuide.operator_id == current_user.id).count() if current_user.role != "SUPER_ADMIN" else db.query(TourGuide).count()
    
    booking_items = db.query(TourBookingItem).filter(TourBookingItem.package_id.in_(pkg_ids)).all() if pkg_ids else []
    total_revenue = sum(b.total_price for b in booking_items)
    total_passengers = sum(b.travelers_count for b in booking_items)

    return {
        "activePackages": len([p for p in packages if p.status == "PUBLISHED"]),
        "totalPackages": len(packages),
        "totalGuides": guides_count,
        "totalBookings": len(booking_items),
        "totalPassengers": total_passengers,
        "grossRevenueINR": total_revenue,
        "avgTourRating": 4.92,
        "topPerformingPackage": packages[0].title if packages else None
    }


# ==============================================================================
# TOUR OPERATOR TRANSPORT CREDENTIAL & CHANGE REQUESTS
# ==============================================================================

@router.get("/credential")
def get_own_transport_credential(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_VIEW_OWN"))
):
    """
    Returns the transport credential, assigned vehicles, and assigned drivers for the authenticated tour operator.
    Strictly verifies ownership: Tour Operator A can only see Tour Operator A's credential.
    """
    cred = db.query(TransportCredential).filter(
        TransportCredential.tour_operator_id == current_user.id
    ).order_by(TransportCredential.created_at.desc()).first()

    if not cred:
        raise HTTPException(
            status_code=404,
            detail="No Transport Credential has been issued to your operator account yet. Please contact Transport Admin."
        )

    vehicles = []
    for cv in cred.assigned_vehicles:
        if cv.status == "ACTIVE" and cv.vehicle:
            v = cv.vehicle
            assigned_driver = db.query(Driver).filter(Driver.id == v.assigned_driver_id).first() if v.assigned_driver_id else None
            vehicles.append({
                "assignmentId": cv.id,
                "vehicleId": v.id,
                "name": v.name,
                "manufacturer": v.manufacturer,
                "model": v.model,
                "variant": v.variant,
                "category": v.category,
                "seatingCapacity": v.seating_capacity,
                "registrationNumber": v.registration_number,
                "registrationState": v.registration_state,
                "transmission": v.transmission,
                "fuelType": v.fuel_type,
                "acAvailable": v.ac_available,
                "dailyRate": v.daily_rate,
                "operationalStatus": v.operational_status,
                "assignedDriverName": assigned_driver.full_name if assigned_driver else None,
                "fitnessCertificateExpiry": v.fitness_certificate_expiry,
                "insuranceExpiry": v.insurance_expiry,
                "pucExpiry": v.puc_expiry,
                "lastMaintenanceDate": v.last_maintenance_date,
                "assignedAt": cv.assigned_at.isoformat() if cv.assigned_at else None,
                "status": cv.status
            })

    drivers = []
    for cd in cred.assigned_drivers:
        if cd.status == "ACTIVE" and cd.driver:
            d = cd.driver
            drivers.append({
                "assignmentId": cd.id,
                "driverId": d.id,
                "fullName": d.full_name,
                "phone": d.phone,
                "drivingLicense": d.driving_license,
                "licenseExpiry": d.license_expiry,
                "policeVerificationStatus": d.police_verification_status,
                "aadhaarVerified": d.aadhaar_verified,
                "rating": d.rating,
                "totalTrips": d.total_trips,
                "dutyStatus": d.duty_status,
                "languages": d.languages_json or [],
                "specialties": d.specialties_json or [],
                "assignedAt": cd.assigned_at.isoformat() if cd.assigned_at else None,
                "status": cd.status
            })

    reqs = []
    for r in cred.change_requests:
        reqs.append({
            "id": r.id,
            "requestType": r.request_type,
            "title": r.title,
            "description": r.description,
            "requestedChanges": r.requested_changes_json or {},
            "status": r.status,
            "reviewerNotes": r.reviewer_notes,
            "reviewedAt": r.reviewed_at.isoformat() if r.reviewed_at else None,
            "createdAt": r.created_at.isoformat() if r.created_at else None
        })

    issuer = cred.issued_by
    return {
        "id": cred.id,
        "credentialNumber": cred.credential_number,
        "tourOperatorId": cred.tour_operator_id,
        "operatorName": current_user.name,
        "status": cred.status,
        "complianceStatus": cred.compliance_status,
        "issuedById": cred.issued_by_id,
        "issuedByName": issuer.name if issuer else "Transport Authority",
        "issuedAt": cred.issued_at.isoformat() if cred.issued_at else None,
        "expiresAt": cred.expires_at.isoformat() if cred.expires_at else None,
        "notes": cred.notes,
        "assignedVehicles": vehicles,
        "assignedDrivers": drivers,
        "changeRequests": reqs,
        "createdAt": cred.created_at.isoformat() if cred.created_at else None
    }


@router.post("/change-requests", status_code=status.HTTP_201_CREATED)
def create_tour_operator_change_request(
    payload: TransportChangeRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CHANGE_REQUEST_CREATE"))
):
    """
    Tour Operator submits a change request for vehicle, driver, or operational transport changes.
    Enforces that the request is saved in PostgreSQL for Transport Admin review.
    """
    cred = None
    if payload.credential_id:
        cred = db.query(TransportCredential).filter(TransportCredential.id == payload.credential_id).first()
    if not cred:
        cred = db.query(TransportCredential).filter(
            TransportCredential.tour_operator_id == current_user.id,
            TransportCredential.status == "ACTIVE"
        ).first()

    req = TransportChangeRequest(
        credential_id=cred.id if cred else None,
        tour_operator_id=current_user.id,
        request_type=payload.request_type,
        title=payload.title,
        description=payload.description,
        requested_changes_json=payload.requested_changes_json or {},
        status="PENDING"
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="CHANGE_REQUEST_CREATED",
        entity_type="TRANSPORT_CHANGE_REQUEST",
        entity_id=req.id,
        description=f"Tour Operator '{current_user.name}' submitted change request '{req.title}' ({req.request_type})."
    )

    return {
        "message": "Change request submitted successfully to Transport Admin",
        "requestId": req.id,
        "status": req.status
    }


@router.get("/change-requests")
def list_own_change_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CHANGE_REQUEST_VIEW_OWN"))
):
    """Lists change requests submitted by the currently authenticated Tour Operator."""
    query = db.query(TransportChangeRequest)
    if current_user.role != "SUPER_ADMIN":
        query = query.filter(TransportChangeRequest.tour_operator_id == current_user.id)
    
    requests = query.order_by(TransportChangeRequest.created_at.desc()).all()
    return [{
        "id": r.id,
        "credentialId": r.credential_id,
        "credentialNumber": r.credential.credential_number if r.credential else None,
        "requestType": r.request_type,
        "title": r.title,
        "description": r.description,
        "requestedChanges": r.requested_changes_json or {},
        "status": r.status,
        "reviewerNotes": r.reviewer_notes,
        "reviewedAt": r.reviewed_at.isoformat() if r.reviewed_at else None,
        "createdAt": r.created_at.isoformat() if r.created_at else None
    } for r in requests]


# ==============================================================================
# PUBLIC DESTINATION-BASED CUSTOMER DISCOVERY ENDPOINT
# ==============================================================================

@router.get("/public/discover")
def discover_public_tour_packages(
    destination: Optional[str] = Query(None, description="Destination name or key (e.g. 'shimla', 'kerala', 'delhi')"),
    category: Optional[str] = None,
    max_price: Optional[float] = None,
    min_price: Optional[float] = None,
    duration_days: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Public customer endpoint for dynamic destination-based tour operator discovery.
    Returns only PUBLISHED and active packages from PostgreSQL.
    Searches destination_key, destination_name, and multi-destination list (destinations_json).
    Completely database-driven with zero destination hardcoding.
    """
    query = db.query(TourPackage).filter(TourPackage.status == "PUBLISHED")

    if destination and destination.strip():
        term = destination.strip().lower()
        clean_key = term.replace("-", "_").replace(" ", "_")
        query = query.filter(
            or_(
                TourPackage.destination_key.ilike(f"%{term}%"),
                TourPackage.destination_key.ilike(f"%{clean_key}%"),
                TourPackage.destination_name.ilike(f"%{term}%"),
                TourPackage.title.ilike(f"%{term}%")
            )
        )

    if category and category.upper() != "ALL":
        query = query.filter(TourPackage.category == category.lower())

    if max_price:
        query = query.filter(TourPackage.base_price_inr <= max_price)
    if min_price:
        query = query.filter(TourPackage.base_price_inr >= min_price)
    if duration_days:
        query = query.filter(TourPackage.duration_days == duration_days)

    packages = query.order_by(TourPackage.rating.desc(), TourPackage.created_at.desc()).all()
    
    # Also check destinations_json in python for any multi-destination match if SQL search missed nested JSON
    if destination and destination.strip():
        term = destination.strip().lower()
        matched = list(packages)
        all_published = db.query(TourPackage).filter(TourPackage.status == "PUBLISHED").all()
        for p in all_published:
            if p not in matched and p.destinations_json:
                dest_list = [str(d).lower() for d in p.destinations_json]
                if any(term in d or d in term for d in dest_list):
                    matched.append(p)
        packages = matched

    return [format_package(p) for p in packages]

