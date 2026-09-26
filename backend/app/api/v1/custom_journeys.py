# Changes made by @MdFarhanAhmad
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import (
    User,
    CustomJourney,
    CustomJourneyDestination,
    DestinationActivity,
    Hotel,
    Vehicle,
    Driver
)
from app.schemas.schemas import (
    RecommendationRequest,
    CustomJourneyCreateRequest,
    CustomJourneyUpdateRequest,
    CustomJourneyDestinationInput
)
from app.core.permissions import (
    get_current_user_optional,
    get_current_user
)
from app.services.audit_service import log_audit_event
from app.services.recommendation_service import (
    DESTINATION_CATALOG,
    STARTING_LOCATIONS,
    compute_destination_recommendations,
    get_hotel_recommendations_for_destination,
    get_transport_recommendations,
    get_segment_transit_info
)

router = APIRouter(prefix="/custom-journeys", tags=["Custom Journey Builder & Intelligent Recommendations"])


# ==============================================================================
# CATALOG & RECOMMENDATION ENDPOINTS
# ==============================================================================

@router.get("/destinations")
def get_destinations_catalog():
    """Returns available starting hubs and destination catalog for journey building."""
    dest_list = list(DESTINATION_CATALOG.values())
    return {
        "startingLocations": STARTING_LOCATIONS,
        "destinations": dest_list
    }


@router.get("/activities")
def get_destination_activities(
    destination_key: Optional[str] = Query(None, description="Destination key filter (e.g. 'kochi', 'munnar')"),
    category: Optional[str] = Query(None, description="Category filter (e.g. 'Culture', 'Nature')"),
    search: Optional[str] = Query(None, description="Search keyword in name or description"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Returns verified destination activities from PostgreSQL.
    Completely universal and destination-agnostic with multi-field search and category filtering.
    """
    query = db.query(DestinationActivity).filter(DestinationActivity.is_verified == True)

    if destination_key:
        clean_key = destination_key.strip().lower().replace("-", "_")
        query = query.filter(DestinationActivity.destination_key == clean_key)

    if category and category.lower() != "all":
        query = query.filter(DestinationActivity.category.ilike(f"%{category.strip()}%"))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (DestinationActivity.name.ilike(term)) |
            (DestinationActivity.description.ilike(term)) |
            (DestinationActivity.location_name.ilike(term))
        )

    results = query.order_by(DestinationActivity.category, DestinationActivity.name).limit(limit).all()

    # Fallback/augmentation if DB doesn't have records for a specific destination key yet
    if not results and destination_key:
        dest_meta = DESTINATION_CATALOG.get(destination_key.strip().lower().replace("-", "_"))
        if dest_meta and "popular_activities" in dest_meta:
            catalog_acts = dest_meta.get("popular_activities", [])
            formatted = []
            for a in catalog_acts:
                act_cat = a.get("category", "Culture")
                act_name = a.get("name", "")
                if category and category.lower() != "all" and category.lower() not in act_cat.lower():
                    continue
                if search and search.strip():
                    s_term = search.strip().lower()
                    if s_term not in act_name.lower() and s_term not in act_cat.lower():
                        continue

                formatted.append({
                    "id": a.get("id"),
                    "destinationKey": destination_key.strip().lower(),
                    "name": a.get("name"),
                    "category": act_cat,
                    "cost": a.get("cost", 0.0),
                    "approxCostInr": a.get("cost", 0.0),
                    "duration": a.get("duration", "2.0 hrs"),
                    "durationHours": 2.0,
                    "locationName": dest_meta.get("name"),
                    "timeOfDay": "Morning",
                    "description": f"Verified activity in {dest_meta.get('name')}",
                    "isVerified": True
                })
            return formatted

    return [
        {
            "id": act.id,
            "destinationKey": act.destination_key,
            "name": act.name,
            "category": act.category,
            "cost": act.approx_cost_inr,
            "approxCostInr": act.approx_cost_inr,
            "duration": f"{act.duration_hours} hrs" if act.duration_hours else "2.0 hrs",
            "durationHours": act.duration_hours,
            "locationName": act.location_name,
            "timeOfDay": act.best_time_of_day,
            "description": act.description,
            "isVerified": act.is_verified
        }
        for act in results
    ]


@router.post("/recommendations")
def get_intelligent_recommendations(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Computes intelligent, explainable recommendations for:
    1. Nearby and preference-matching destinations
    2. Real hotel room availability for selected destinations
    3. Verified destination activities
    4. Vehicle & driver transport options
    """
    # 1. Destination suggestions
    dest_suggestions = compute_destination_recommendations(
        selected_keys=request.selected_destinations,
        user_preferences=request.user_preferences,
        starting_location=request.starting_location or "Hyderabad",
        budget_inr=request.budget_inr,
        total_duration_days=request.total_duration_days or 5,
        db=db
    )

    # 2. Hotel recommendations for each currently selected destination
    hotels_by_dest = {}
    for d_key in request.selected_destinations:
        hotels_by_dest[d_key] = get_hotel_recommendations_for_destination(
            db=db,
            destination_key=d_key,
            max_budget_per_night=request.budget_inr
        )

    # 3. Transport suggestions for current segments
    segments_transport = []
    current_stops = [request.starting_location or "Hyderabad"] + request.selected_destinations
    for i in range(len(current_stops) - 1):
        orig = current_stops[i]
        dest = current_stops[i + 1]
        t_info = get_transport_recommendations(db, orig, dest)
        segments_transport.append(t_info)

    # 4. Extract verified activities from PostgreSQL for currently selected destinations
    activities_by_dest = {}
    for d_key in request.selected_destinations:
        clean_key = d_key.lower().replace("-", "_")
        db_acts = db.query(DestinationActivity).filter(
            DestinationActivity.destination_key == clean_key,
            DestinationActivity.is_verified == True
        ).all()

        if db_acts:
            activities_by_dest[d_key] = [
                {
                    "id": a.id,
                    "destinationKey": a.destination_key,
                    "name": a.name,
                    "category": a.category,
                    "cost": a.approx_cost_inr,
                    "approxCostInr": a.approx_cost_inr,
                    "duration": f"{a.duration_hours} hrs" if a.duration_hours else "2.0 hrs",
                    "durationHours": a.duration_hours,
                    "locationName": a.location_name,
                    "timeOfDay": a.best_time_of_day,
                    "description": a.description,
                    "isVerified": a.is_verified
                }
                for a in db_acts
            ]
        else:
            dest_meta = DESTINATION_CATALOG.get(clean_key)
            activities_by_dest[d_key] = dest_meta.get("popular_activities", []) if dest_meta else []

    return {
        "recommendedDestinations": dest_suggestions,
        "recommendedHotels": hotels_by_dest,
        "recommendedActivities": activities_by_dest,
        "transportSegments": segments_transport
    }


# ==============================================================================
# CUSTOM JOURNEYS CRUD & OWNERSHIP ISOLATION
# ==============================================================================

def format_custom_journey(j: CustomJourney) -> Dict[str, Any]:
    dest_items = []
    for d in j.destinations:
        dest_items.append({
            "id": d.id,
            "destinationKey": d.destination_key,
            "destinationName": d.destination_name,
            "sequenceOrder": d.sequence_order,
            "arrivalDate": d.arrival_date,
            "departureDate": d.departure_date,
            "stayNights": d.stay_nights,
            "selectedHotelId": d.selected_hotel_id,
            "selectedHotelName": d.selected_hotel_name,
            "selectedRoomTypeId": d.selected_room_type_id,
            "selectedActivities": d.selected_activities_json or [],
            "transportMode": d.transport_mode,
            "distanceKm": d.distance_km,
            "travelTimeHours": d.travel_time_hours,
            "notes": d.notes
        })

    return {
        "id": j.id,
        "customerId": j.customer_id,
        "title": j.title,
        "startLocation": j.start_location,
        "startDate": j.start_date,
        "endDate": j.end_date,
        "durationDays": j.duration_days,
        "totalNights": j.total_nights,
        "adultsCount": j.adults_count,
        "childrenCount": j.children_count,
        "budgetINR": j.budget_inr,
        "preferences": j.preferences_json or [],
        "status": j.status,
        "destinations": dest_items,
        "itinerary": j.itinerary_json or [],
        "costEstimate": j.cost_estimate_json or {},
        "createdAt": j.created_at.isoformat() if j.created_at else None,
        "updatedAt": j.updated_at.isoformat() if j.updated_at else None
    }


@router.get("", response_model=List[Dict[str, Any]])
def list_custom_journeys(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Lists saved custom journeys for the current authenticated customer."""
    if not current_user:
        return []

    query = db.query(CustomJourney)
    if current_user.role != "SUPER_ADMIN":
        query = query.filter(CustomJourney.customer_id == current_user.id)

    journeys = query.order_by(CustomJourney.updated_at.desc()).all()
    return [format_custom_journey(j) for j in journeys]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_custom_journey(
    payload: CustomJourneyCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Creates/saves a new custom journey with multi-destination segments and itinerary."""
    journey = CustomJourney(
        id=payload.id or None,
        customer_id=current_user.id if current_user else None,
        title=payload.title or "My Custom Journey",
        start_location=payload.start_location or "Hyderabad",
        start_date=payload.start_date,
        end_date=payload.end_date,
        duration_days=payload.duration_days or 5,
        total_nights=payload.total_nights or 4,
        adults_count=payload.adults_count or 2,
        children_count=payload.children_count or 0,
        budget_inr=payload.budget_inr,
        preferences_json=payload.preferences or [],
        status=payload.status or "DRAFT",
        itinerary_json=payload.itinerary or [],
        cost_estimate_json=payload.cost_estimate or {}
    )
    db.add(journey)
    db.flush()

    # Add destination segments
    for idx, d_in in enumerate(payload.destinations):
        dest_seg = CustomJourneyDestination(
            journey_id=journey.id,
            destination_key=d_in.destination_key,
            destination_name=d_in.destination_name,
            sequence_order=d_in.sequence_order if d_in.sequence_order is not None else idx + 1,
            stay_nights=d_in.stay_nights or 1,
            selected_hotel_id=d_in.selected_hotel_id,
            selected_hotel_name=d_in.selected_hotel_name,
            selected_room_type_id=d_in.selected_room_type_id,
            selected_activities_json=d_in.selected_activities or [],
            transport_mode=d_in.transport_mode or "Car / Tourist Vehicle",
            distance_km=d_in.distance_km,
            travel_time_hours=d_in.travel_time_hours,
            notes=d_in.notes
        )
        db.add(dest_seg)

    db.commit()
    db.refresh(journey)

    log_audit_event(
        db,
        action="CUSTOM_JOURNEY_CREATED",
        entity_type="CUSTOM_JOURNEY",
        entity_id=journey.id,
        actor_user_id=current_user.id if current_user else None,
        actor_role=current_user.role if current_user else "CUSTOMER",
        description=f"Custom journey '{journey.title}' created with {len(payload.destinations)} stops."
    )

    return {
        "message": "Custom journey saved successfully",
        "journey": format_custom_journey(journey)
    }


@router.get("/{journey_id}")
def get_custom_journey(
    journey_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Retrieves custom journey details.
    Strictly enforces authorization: Customer A cannot access Customer B's journey (403 Forbidden).
    """
    journey = db.query(CustomJourney).filter(CustomJourney.id == journey_id).first()
    if not journey:
        raise HTTPException(status_code=404, detail="Custom journey not found")

    # Ownership & RBAC check
    if journey.customer_id:
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required to view this journey")
        if current_user.role != "SUPER_ADMIN" and journey.customer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this custom journey")

    return format_custom_journey(journey)


@router.put("/{journey_id}")
def update_custom_journey(
    journey_id: str,
    payload: CustomJourneyUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Updates an existing custom journey.
    Strictly enforces ownership: Customer A cannot modify Customer B's journey (403 Forbidden).
    """
    journey = db.query(CustomJourney).filter(CustomJourney.id == journey_id).first()
    if not journey:
        raise HTTPException(status_code=404, detail="Custom journey not found")

    # Ownership check
    if journey.customer_id:
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required to modify this journey")
        if current_user.role != "SUPER_ADMIN" and journey.customer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to modify this custom journey")

    # Update top-level fields
    if payload.title is not None:
        journey.title = payload.title
    if payload.start_location is not None:
        journey.start_location = payload.start_location
    if payload.start_date is not None:
        journey.start_date = payload.start_date
    if payload.end_date is not None:
        journey.end_date = payload.end_date
    if payload.duration_days is not None:
        journey.duration_days = payload.duration_days
    if payload.total_nights is not None:
        journey.total_nights = payload.total_nights
    if payload.adults_count is not None:
        journey.adults_count = payload.adults_count
    if payload.children_count is not None:
        journey.children_count = payload.children_count
    if payload.budget_inr is not None:
        journey.budget_inr = payload.budget_inr
    if payload.preferences is not None:
        journey.preferences_json = payload.preferences
    if payload.status is not None:
        journey.status = payload.status
    if payload.itinerary is not None:
        journey.itinerary_json = payload.itinerary
    if payload.cost_estimate is not None:
        journey.cost_estimate_json = payload.cost_estimate

    # Update destinations if provided
    if payload.destinations is not None:
        # Delete old destination segments
        db.query(CustomJourneyDestination).filter(CustomJourneyDestination.journey_id == journey.id).delete()
        for idx, d_in in enumerate(payload.destinations):
            dest_seg = CustomJourneyDestination(
                journey_id=journey.id,
                destination_key=d_in.destination_key,
                destination_name=d_in.destination_name,
                sequence_order=d_in.sequence_order if d_in.sequence_order is not None else idx + 1,
                stay_nights=d_in.stay_nights or 1,
                selected_hotel_id=d_in.selected_hotel_id,
                selected_hotel_name=d_in.selected_hotel_name,
                selected_room_type_id=d_in.selected_room_type_id,
                selected_activities_json=d_in.selected_activities or [],
                transport_mode=d_in.transport_mode or "Car / Tourist Vehicle",
                distance_km=d_in.distance_km,
                travel_time_hours=d_in.travel_time_hours,
                notes=d_in.notes
            )
            db.add(dest_seg)

    journey.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(journey)

    return {
        "message": "Custom journey updated successfully",
        "journey": format_custom_journey(journey)
    }


@router.delete("/{journey_id}")
def delete_custom_journey(
    journey_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Deletes a custom journey.
    Strictly enforces ownership check (403 Forbidden).
    """
    journey = db.query(CustomJourney).filter(CustomJourney.id == journey_id).first()
    if not journey:
        raise HTTPException(status_code=404, detail="Custom journey not found")

    if journey.customer_id:
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required")
        if current_user.role != "SUPER_ADMIN" and journey.customer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this custom journey")

    db.delete(journey)
    db.commit()

    return {"message": "Custom journey deleted successfully", "journeyId": journey_id}
