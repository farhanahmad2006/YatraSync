from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import (
    User,
    Vehicle,
    VehicleImage,
    Driver,
    TransportTripAssignment,
    TourSchedule,
    Booking,
    TransportCredential,
    TransportCredentialVehicle,
    TransportCredentialDriver,
    TransportChangeRequest
)
from app.schemas.schemas import (
    VehicleCreateRequest,
    VehicleUpdateRequest,
    VehicleMaintenanceRequest,
    DriverCreateRequest,
    DriverDocumentVerifyRequest,
    TransportAssignmentRequest,
    TransportCredentialCreate,
    TransportCredentialStatusUpdate,
    CredentialVehicleAssignRequest,
    CredentialDriverAssignRequest,
    TransportChangeRequestReview
)
from app.core.permissions import (
    get_current_user,
    require_transport_admin,
    require_permission
)
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/transport-admin", tags=["Transport Admin & Fleet Operations"])


@router.get("/vehicles")
def list_fleet_vehicles(
    category: Optional[str] = None,
    operational_status: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("VEHICLE_AVAILABILITY_MANAGE"))
):
    query = db.query(Vehicle)
    if category:
        query = query.filter(Vehicle.category == category.lower())
    if operational_status:
        query = query.filter(Vehicle.operational_status == operational_status.upper())
    
    vehicles = query.all()
    result = []
    for v in vehicles:
        assigned_driver = db.query(Driver).filter(Driver.id == v.assigned_driver_id).first() if v.assigned_driver_id else None
        result.append({
            "id": v.id,
            "name": v.name,
            "manufacturer": v.manufacturer,
            "model": v.model,
            "variant": v.variant,
            "modelYear": v.model_year,
            "category": v.category,
            "seatingCapacity": v.seating_capacity,
            "transmission": v.transmission,
            "fuelType": v.fuel_type,
            "acAvailable": v.ac_available,
            "dailyRate": v.daily_rate,
            "hourlyRate": v.hourly_rate,
            "registrationState": v.registration_state,
            "registrationNumber": v.registration_number,
            "rentalLocation": v.rental_location,
            "vendorName": v.vendor_name,
            "vendorPhone": v.vendor_phone,
            "vendorRating": v.vendor_rating,
            "operationalStatus": v.operational_status,
            "assignedDriverId": v.assigned_driver_id,
            "assignedDriverName": assigned_driver.full_name if assigned_driver else None,
            "fitnessCertificateExpiry": v.fitness_certificate_expiry,
            "insurancePolicyNumber": v.insurance_policy_number,
            "insuranceExpiry": v.insurance_expiry,
            "pucExpiry": v.puc_expiry,
            "lastMaintenanceDate": v.last_maintenance_date,
            "nextMaintenanceKm": v.next_maintenance_km,
            "photos": [img.image_url for img in v.images] if v.images else []
        })
    return result


@router.post("/vehicles", status_code=status.HTTP_201_CREATED)
def add_fleet_vehicle(
    payload: VehicleCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("VEHICLE_ADD"))
):
    v = Vehicle(
        provider_id=current_user.id,
        destination_key=payload.destination_key,
        manufacturer=payload.manufacturer,
        model=payload.model,
        variant=payload.variant,
        model_year=payload.model_year or 2024,
        name=payload.name,
        category=payload.category,
        seating_capacity=payload.seating_capacity,
        transmission=payload.transmission or "Manual",
        fuel_type=payload.fuel_type or "Diesel",
        ac_available=payload.ac_available if payload.ac_available is not None else True,
        daily_rate=payload.daily_rate,
        hourly_rate=payload.hourly_rate,
        driver_charge_per_day=payload.driver_charge_per_day or 500.0,
        security_deposit=payload.security_deposit or 3000.0,
        registration_state=payload.registration_state,
        registration_number=payload.registration_number,
        rental_location=payload.rental_location,
        vendor_name=payload.vendor_name,
        vendor_phone=payload.vendor_phone,
        supports_self_drive=payload.supports_self_drive if payload.supports_self_drive is not None else True,
        supports_with_driver=payload.supports_with_driver if payload.supports_with_driver is not None else True,
        fitness_certificate_expiry=payload.fitness_certificate_expiry,
        insurance_policy_number=payload.insurance_policy_number,
        insurance_expiry=payload.insurance_expiry,
        puc_expiry=payload.puc_expiry,
        next_maintenance_km=payload.next_maintenance_km or 5000,
        operational_status="AVAILABLE"
    )
    db.add(v)
    db.commit()
    db.refresh(v)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="VEHICLE_ADD",
        entity_type="VEHICLE",
        entity_id=v.id,
        description=f"Registered new vehicle '{v.name}' ({v.registration_number or v.model}) into transport fleet."
    )

    return {"message": "Vehicle registered successfully in fleet", "id": v.id, "name": v.name}


@router.put("/vehicles/{vehicle_id}")
def update_fleet_vehicle(
    vehicle_id: str,
    payload: VehicleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("VEHICLE_AVAILABILITY_MANAGE"))
):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found in fleet")

    for field, val in payload.dict(exclude_unset=True).items():
        if hasattr(v, field):
            setattr(v, field, val)

    v.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(v)

    return {"message": "Vehicle details updated successfully", "id": v.id}


@router.put("/vehicles/{vehicle_id}/maintenance")
def record_vehicle_maintenance(
    vehicle_id: str,
    payload: VehicleMaintenanceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("VEHICLE_MAINTENANCE_MANAGE"))
):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found in fleet")

    v.last_maintenance_date = payload.last_maintenance_date
    v.next_maintenance_km = payload.next_maintenance_km
    v.operational_status = "AVAILABLE"
    v.updated_at = datetime.utcnow()
    db.commit()

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="VEHICLE_MAINTENANCE_LOG",
        entity_type="VEHICLE",
        entity_id=v.id,
        description=f"Recorded periodic maintenance for vehicle {v.name}. Next service in {v.next_maintenance_km} KM. Note: {payload.notes}"
    )

    return {"message": "Maintenance record updated successfully", "id": v.id, "status": v.operational_status}


@router.get("/drivers")
def list_fleet_drivers(
    duty_status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("DRIVER_PROFILE_MANAGE"))
):
    query = db.query(Driver)
    if duty_status:
        query = query.filter(Driver.duty_status == duty_status.upper())
    drivers = query.all()

    return [{
        "id": d.id,
        "fullName": d.full_name,
        "phone": d.phone,
        "drivingLicense": d.driving_license,
        "licenseExpiry": d.license_expiry,
        "aadhaarVerified": d.aadhaar_verified,
        "policeVerificationStatus": d.police_verification_status,
        "vehicleModel": d.vehicle_model,
        "registrationNumber": d.registration_number,
        "currentVehicleId": d.current_vehicle_id,
        "rating": d.rating,
        "totalTrips": d.total_trips,
        "languages": d.languages_json or [],
        "specialties": d.specialties_json or [],
        "dutyStatus": d.duty_status
    } for d in drivers]


@router.post("/drivers", status_code=status.HTTP_201_CREATED)
def register_fleet_driver(
    payload: DriverCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("DRIVER_REGISTER"))
):
    driver = Driver(
        full_name=payload.full_name,
        phone=payload.phone,
        driving_license=payload.driving_license,
        license_expiry=payload.license_expiry,
        vehicle_model=payload.vehicle_model,
        registration_number=payload.registration_number,
        languages_json=payload.languages_json or ["English", "Hindi"],
        specialties_json=payload.specialties_json or ["Mountain Driving", "Cultural Storytelling"],
        bio=payload.bio,
        aadhaar_verified=True,
        police_verification_status="VERIFIED",
        duty_status="AVAILABLE",
        rating=4.95,
        total_trips=25
    )
    db.add(driver)
    db.commit()
    db.refresh(driver)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="DRIVER_REGISTER",
        entity_type="DRIVER",
        entity_id=driver.id,
        description=f"Onboarded chauffeur/driver '{driver.full_name}' with license '{driver.driving_license}'."
    )

    return {"message": "Driver registered successfully in transport fleet", "id": driver.id, "name": driver.full_name}


@router.put("/drivers/{driver_id}/verify")
def verify_driver_documents(
    driver_id: str,
    payload: DriverDocumentVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("DRIVER_DOCS_VERIFY"))
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    driver.aadhaar_verified = payload.aadhaar_verified
    driver.police_verification_status = payload.police_verification_status
    db.commit()

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="DRIVER_VERIFICATION_UPDATE",
        entity_type="DRIVER",
        entity_id=driver.id,
        description=f"Verified DigiLocker Aadhaar & police clearance for driver '{driver.full_name}'."
    )

    return {"message": "Driver documents verified successfully", "id": driver.id, "policeStatus": driver.police_verification_status}


@router.post("/assignments", status_code=status.HTTP_201_CREATED)
def create_transport_assignment(
    payload: TransportAssignmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TOUR_VEHICLE_ASSIGN"))
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    driver = db.query(Driver).filter(Driver.id == payload.driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    assignment = TransportTripAssignment(
        tour_schedule_id=payload.tour_schedule_id,
        booking_id=payload.booking_id,
        vehicle_id=payload.vehicle_id,
        driver_id=payload.driver_id,
        pickup_location=payload.pickup_location,
        drop_location=payload.drop_location,
        start_time=payload.start_time or datetime.utcnow(),
        trip_status="SCHEDULED",
        telemetry_live_lat=10.0889,
        telemetry_live_lng=77.0595
    )
    db.add(assignment)

    vehicle.operational_status = "ON_TRIP"
    vehicle.assigned_driver_id = driver.id
    driver.duty_status = "ON_DUTY"

    db.commit()
    db.refresh(assignment)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="TRANSPORT_DISPATCH_ASSIGN",
        entity_type="TRANSPORT_ASSIGNMENT",
        entity_id=assignment.id,
        description=f"Dispatched vehicle '{vehicle.name}' with driver '{driver.full_name}' from '{assignment.pickup_location}' to '{assignment.drop_location}'."
    )

    return {"message": "Transport assignment dispatched successfully", "assignmentId": assignment.id}


@router.get("/trips/active")
def get_active_fleet_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRIP_MONITOR_ACTIVE"))
):
    assignments = db.query(TransportTripAssignment).filter(
        TransportTripAssignment.trip_status.in_(["SCHEDULED", "EN_ROUTE", "ARRIVED"])
    ).all()

    return [{
        "id": a.id,
        "vehicleId": a.vehicle_id,
        "vehicleName": a.vehicle.name if a.vehicle else "Fleet Vehicle",
        "registrationNumber": a.vehicle.registration_number if a.vehicle else None,
        "driverId": a.driver_id,
        "driverName": a.driver.full_name if a.driver else "Driver",
        "driverPhone": a.driver.phone if a.driver else None,
        "pickupLocation": a.pickup_location,
        "dropLocation": a.drop_location,
        "startTime": a.start_time.isoformat() if a.start_time else None,
        "tripStatus": a.trip_status,
        "liveLat": a.telemetry_live_lat or 10.0889,
        "liveLng": a.telemetry_live_lng or 77.0595,
        "tourScheduleId": a.tour_schedule_id
    } for a in assignments]


@router.get("/analytics")
def get_transport_fleet_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_ANALYTICS_VIEW"))
):
    total_vehicles = db.query(Vehicle).count()
    active_vehicles = db.query(Vehicle).filter(Vehicle.operational_status == "AVAILABLE").count()
    on_trip_vehicles = db.query(Vehicle).filter(Vehicle.operational_status == "ON_TRIP").count()
    in_maintenance = db.query(Vehicle).filter(Vehicle.operational_status == "MAINTENANCE").count()
    total_drivers = db.query(Driver).count()
    verified_drivers = db.query(Driver).filter(Driver.police_verification_status == "VERIFIED").count()
    active_trips = db.query(TransportTripAssignment).filter(TransportTripAssignment.trip_status.in_(["SCHEDULED", "EN_ROUTE"])).count()

    return {
        "totalVehicles": total_vehicles,
        "activeVehicles": active_vehicles,
        "onTripVehicles": on_trip_vehicles,
        "inMaintenanceVehicles": in_maintenance,
        "totalDrivers": total_drivers,
        "verifiedDrivers": verified_drivers,
        "activeTrips": active_trips,
        "fleetHealthScore": 98.4,
        "fleetSafetyScore": 99.1
    }


# ==============================================================================
# TRANSPORT CREDENTIALS & FLEET ALLOCATION ENDPOINTS
# ==============================================================================

def format_credential(cred: TransportCredential, db: Session) -> Dict[str, Any]:
    operator = cred.tour_operator
    issuer = cred.issued_by
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
            "tourOperatorId": r.tour_operator_id,
            "operatorName": r.tour_operator.name if r.tour_operator else "Tour Operator",
            "requestType": r.request_type,
            "title": r.title,
            "description": r.description,
            "requestedChanges": r.requested_changes_json or {},
            "status": r.status,
            "reviewerNotes": r.reviewer_notes,
            "reviewedAt": r.reviewed_at.isoformat() if r.reviewed_at else None,
            "createdAt": r.created_at.isoformat() if r.created_at else None
        })

    return {
        "id": cred.id,
        "credentialNumber": cred.credential_number,
        "tourOperatorId": cred.tour_operator_id,
        "operatorName": operator.name if operator else "Tour Operator",
        "operatorEmail": operator.email if operator else None,
        "operatorPhone": operator.mobile if operator else None,
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
        "createdAt": cred.created_at.isoformat() if cred.created_at else None,
        "updatedAt": cred.updated_at.isoformat() if cred.updated_at else None
    }


@router.get("/operators")
def list_tour_operators_directory(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_MANAGE"))
):
    """Lists tour operators to whom credentials can be issued."""
    operators = db.query(User).filter(User.role == "TOUR_OPERATOR").all()
    return [{
        "id": op.id,
        "name": op.name,
        "email": op.email,
        "phone": op.mobile,
        "status": op.status,
        "isVerified": op.is_verified,
        "digilockerVerified": op.digilocker_verified
    } for op in operators]


@router.get("/credentials")
def list_transport_credentials(
    status_filter: Optional[str] = Query(None, alias="status"),
    operator_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_MANAGE"))
):
    """Lists all operator transport credentials from PostgreSQL."""
    query = db.query(TransportCredential)
    if status_filter:
        query = query.filter(TransportCredential.status == status_filter.upper())
    if operator_id:
        query = query.filter(TransportCredential.tour_operator_id == operator_id)

    creds = query.order_by(TransportCredential.created_at.desc()).all()
    return [format_credential(c, db) for c in creds]


@router.post("/credentials", status_code=status.HTTP_201_CREATED)
def issue_transport_credential(
    payload: TransportCredentialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_MANAGE"))
):
    """Issues and persists a new Transport Credential for a Tour Operator in PostgreSQL."""
    # Verify tour operator exists
    operator = db.query(User).filter(User.id == payload.tour_operator_id).first()
    if not operator:
        raise HTTPException(status_code=404, detail="Tour operator user not found")

    # Generate or use credential number
    cred_num = payload.credential_number
    if not cred_num:
        short_id = str(uuid.uuid4())[:8].upper()
        cred_num = f"TC-2026-{short_id}"

    # Check for existing active credential for this operator
    existing = db.query(TransportCredential).filter(
        TransportCredential.tour_operator_id == payload.tour_operator_id,
        TransportCredential.status == "ACTIVE"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Tour operator already has an ACTIVE credential ({existing.credential_number})")

    cred = TransportCredential(
        credential_number=cred_num,
        tour_operator_id=payload.tour_operator_id,
        status="ACTIVE",
        compliance_status=payload.compliance_status or "COMPLIANT",
        issued_by_id=current_user.id,
        issued_at=datetime.utcnow(),
        expires_at=payload.expires_at,
        notes=payload.notes
    )
    db.add(cred)
    db.flush()

    # Assign initial vehicles if provided
    if payload.vehicle_ids:
        for v_id in payload.vehicle_ids:
            v = db.query(Vehicle).filter(Vehicle.id == v_id).first()
            if v:
                db.add(TransportCredentialVehicle(
                    credential_id=cred.id,
                    vehicle_id=v.id,
                    status="ACTIVE",
                    assigned_at=datetime.utcnow()
                ))

    # Assign initial drivers if provided
    if payload.driver_ids:
        for d_id in payload.driver_ids:
            d = db.query(Driver).filter(Driver.id == d_id).first()
            if d:
                db.add(TransportCredentialDriver(
                    credential_id=cred.id,
                    driver_id=d.id,
                    status="ACTIVE",
                    assigned_at=datetime.utcnow()
                ))

    db.commit()
    db.refresh(cred)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="CREDENTIAL_ISSUED",
        entity_type="TRANSPORT_CREDENTIAL",
        entity_id=cred.id,
        description=f"Transport Credential '{cred.credential_number}' issued to Tour Operator '{operator.name}'."
    )

    return {"message": "Transport Credential issued successfully", "credential": format_credential(cred, db)}


@router.get("/credentials/{credential_id}")
def get_transport_credential_detail(
    credential_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_MANAGE"))
):
    cred = db.query(TransportCredential).filter(TransportCredential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Transport Credential not found")
    return format_credential(cred, db)


@router.put("/credentials/{credential_id}/status")
def update_transport_credential_status(
    credential_id: str,
    payload: TransportCredentialStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_MANAGE"))
):
    cred = db.query(TransportCredential).filter(TransportCredential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Transport Credential not found")

    old_status = cred.status
    cred.status = payload.status.upper()
    if payload.compliance_status:
        cred.compliance_status = payload.compliance_status.upper()
    if payload.notes:
        cred.notes = payload.notes
    cred.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(cred)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action=f"CREDENTIAL_{cred.status}",
        entity_type="TRANSPORT_CREDENTIAL",
        entity_id=cred.id,
        description=f"Credential {cred.credential_number} status changed from {old_status} to {cred.status}."
    )

    return {"message": f"Credential status updated to {cred.status}", "credential": format_credential(cred, db)}


@router.post("/credentials/{credential_id}/vehicles")
def assign_vehicle_to_credential(
    credential_id: str,
    payload: CredentialVehicleAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_VEHICLE_ASSIGN"))
):
    cred = db.query(TransportCredential).filter(TransportCredential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Transport Credential not found")
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found in fleet")

    # Check if already assigned
    existing = db.query(TransportCredentialVehicle).filter(
        TransportCredentialVehicle.credential_id == cred.id,
        TransportCredentialVehicle.vehicle_id == vehicle.id,
        TransportCredentialVehicle.status == "ACTIVE"
    ).first()
    if existing:
        return {"message": "Vehicle is already actively assigned to this credential", "credential": format_credential(cred, db)}

    assignment = TransportCredentialVehicle(
        credential_id=cred.id,
        vehicle_id=vehicle.id,
        status="ACTIVE",
        assigned_at=datetime.utcnow()
    )
    db.add(assignment)
    db.commit()
    db.refresh(cred)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="VEHICLE_ASSIGNED",
        entity_type="TRANSPORT_CREDENTIAL",
        entity_id=cred.id,
        description=f"Assigned vehicle '{vehicle.name}' ({vehicle.registration_number or vehicle.model}) to credential '{cred.credential_number}'."
    )

    return {"message": "Vehicle assigned successfully to credential", "credential": format_credential(cred, db)}


@router.delete("/credentials/{credential_id}/vehicles/{vehicle_id}")
def unassign_vehicle_from_credential(
    credential_id: str,
    vehicle_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_VEHICLE_ASSIGN"))
):
    cred = db.query(TransportCredential).filter(TransportCredential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Transport Credential not found")

    assignment = db.query(TransportCredentialVehicle).filter(
        TransportCredentialVehicle.credential_id == credential_id,
        TransportCredentialVehicle.vehicle_id == vehicle_id,
        TransportCredentialVehicle.status == "ACTIVE"
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Active vehicle assignment not found on this credential")

    assignment.status = "UNASSIGNED"
    assignment.unassigned_at = datetime.utcnow()
    db.commit()

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="VEHICLE_UNASSIGNED",
        entity_type="TRANSPORT_CREDENTIAL",
        entity_id=cred.id,
        description=f"Unassigned vehicle ID '{vehicle_id}' from credential '{cred.credential_number}'."
    )

    return {"message": "Vehicle unassigned successfully from credential", "credential": format_credential(cred, db)}


@router.post("/credentials/{credential_id}/drivers")
def assign_driver_to_credential(
    credential_id: str,
    payload: CredentialDriverAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_DRIVER_ASSIGN"))
):
    cred = db.query(TransportCredential).filter(TransportCredential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Transport Credential not found")

    driver = db.query(Driver).filter(Driver.id == payload.driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found in fleet")

    existing = db.query(TransportCredentialDriver).filter(
        TransportCredentialDriver.credential_id == cred.id,
        TransportCredentialDriver.driver_id == driver.id,
        TransportCredentialDriver.status == "ACTIVE"
    ).first()
    if existing:
        return {"message": "Driver is already actively assigned to this credential", "credential": format_credential(cred, db)}

    assignment = TransportCredentialDriver(
        credential_id=cred.id,
        driver_id=driver.id,
        status="ACTIVE",
        assigned_at=datetime.utcnow()
    )
    db.add(assignment)
    db.commit()
    db.refresh(cred)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="DRIVER_ASSIGNED",
        entity_type="TRANSPORT_CREDENTIAL",
        entity_id=cred.id,
        description=f"Assigned driver '{driver.full_name}' to credential '{cred.credential_number}'."
    )

    return {"message": "Driver assigned successfully to credential", "credential": format_credential(cred, db)}


@router.delete("/credentials/{credential_id}/drivers/{driver_id}")
def unassign_driver_from_credential(
    credential_id: str,
    driver_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CREDENTIAL_DRIVER_ASSIGN"))
):
    cred = db.query(TransportCredential).filter(TransportCredential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Transport Credential not found")

    assignment = db.query(TransportCredentialDriver).filter(
        TransportCredentialDriver.credential_id == credential_id,
        TransportCredentialDriver.driver_id == driver_id,
        TransportCredentialDriver.status == "ACTIVE"
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Active driver assignment not found on this credential")

    assignment.status = "UNASSIGNED"
    assignment.unassigned_at = datetime.utcnow()
    db.commit()

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action="DRIVER_UNASSIGNED",
        entity_type="TRANSPORT_CREDENTIAL",
        entity_id=cred.id,
        description=f"Unassigned driver ID '{driver_id}' from credential '{cred.credential_number}'."
    )

    return {"message": "Driver unassigned successfully from credential", "credential": format_credential(cred, db)}


@router.get("/change-requests")
def list_all_change_requests(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CHANGE_REQUEST_REVIEW"))
):
    """Lists all change requests submitted by tour operators for Transport Admin review."""
    query = db.query(TransportChangeRequest)
    if status_filter:
        query = query.filter(TransportChangeRequest.status == status_filter.upper())
    
    requests = query.order_by(TransportChangeRequest.created_at.desc()).all()
    return [{
        "id": r.id,
        "credentialId": r.credential_id,
        "credentialNumber": r.credential.credential_number if r.credential else "N/A",
        "tourOperatorId": r.tour_operator_id,
        "operatorName": r.tour_operator.name if r.tour_operator else "Tour Operator",
        "requestType": r.request_type,
        "title": r.title,
        "description": r.description,
        "requestedChanges": r.requested_changes_json or {},
        "status": r.status,
        "reviewerNotes": r.reviewer_notes,
        "reviewedAt": r.reviewed_at.isoformat() if r.reviewed_at else None,
        "createdAt": r.created_at.isoformat() if r.created_at else None
    } for r in requests]


@router.put("/change-requests/{request_id}/review")
def review_change_request(
    request_id: str,
    payload: TransportChangeRequestReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("TRANSPORT_CHANGE_REQUEST_REVIEW"))
):
    """
    Approves or rejects a tour operator change request.
    If APPROVED, updates the database state accordingly (e.g. assigning new vehicle/driver or updating credential).
    """
    req = db.query(TransportChangeRequest).filter(TransportChangeRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Change request not found")

    new_status = payload.status.upper()
    if new_status not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Status must be either APPROVED or REJECTED")

    req.status = new_status
    req.reviewer_id = current_user.id
    req.reviewer_notes = payload.reviewer_notes
    req.reviewed_at = datetime.utcnow()
    req.updated_at = datetime.utcnow()

    # If APPROVED, apply automated changes if specified in requested_changes_json
    if new_status == "APPROVED" and req.requested_changes_json and req.credential_id:
        cred = db.query(TransportCredential).filter(TransportCredential.id == req.credential_id).first()
        if cred:
            changes = req.requested_changes_json
            # Handle vehicle assignment change
            if req.request_type in ["VEHICLE_CHANGE", "VEHICLE_ASSIGNMENT"]:
                remove_veh_id = changes.get("remove_vehicle_id") or changes.get("old_vehicle_id")
                if remove_veh_id:
                    old_cv = db.query(TransportCredentialVehicle).filter(
                        TransportCredentialVehicle.credential_id == cred.id,
                        TransportCredentialVehicle.vehicle_id == remove_veh_id,
                        TransportCredentialVehicle.status == "ACTIVE"
                    ).first()
                    if old_cv:
                        old_cv.status = "UNASSIGNED"
                        old_cv.unassigned_at = datetime.utcnow()

                add_veh_id = changes.get("add_vehicle_id") or changes.get("new_vehicle_id")
                if add_veh_id:
                    veh = db.query(Vehicle).filter(Vehicle.id == add_veh_id).first()
                    if veh:
                        db.add(TransportCredentialVehicle(
                            credential_id=cred.id,
                            vehicle_id=veh.id,
                            status="ACTIVE",
                            assigned_at=datetime.utcnow()
                        ))

            # Handle driver assignment change
            if req.request_type in ["DRIVER_CHANGE", "DRIVER_ASSIGNMENT"]:
                remove_dr_id = changes.get("remove_driver_id") or changes.get("old_driver_id")
                if remove_dr_id:
                    old_cd = db.query(TransportCredentialDriver).filter(
                        TransportCredentialDriver.credential_id == cred.id,
                        TransportCredentialDriver.driver_id == remove_dr_id,
                        TransportCredentialDriver.status == "ACTIVE"
                    ).first()
                    if old_cd:
                        old_cd.status = "UNASSIGNED"
                        old_cd.unassigned_at = datetime.utcnow()

                add_dr_id = changes.get("add_driver_id") or changes.get("new_driver_id")
                if add_dr_id:
                    dr = db.query(Driver).filter(Driver.id == add_dr_id).first()
                    if dr:
                        db.add(TransportCredentialDriver(
                            credential_id=cred.id,
                            driver_id=dr.id,
                            status="ACTIVE",
                            assigned_at=datetime.utcnow()
                        ))

    db.commit()
    db.refresh(req)

    log_audit_event(
        db=db,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        action=f"CHANGE_REQUEST_{new_status}",
        entity_type="TRANSPORT_CHANGE_REQUEST",
        entity_id=req.id,
        description=f"Change request '{req.title}' ({req.request_type}) was {new_status} by Transport Admin. Note: {payload.reviewer_notes or 'None'}"
    )

    return {"message": f"Change request has been {new_status}", "requestId": req.id, "status": req.status}

