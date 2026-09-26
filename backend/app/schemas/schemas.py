# Changes made by @MdFarhanAhmad
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Auth & User Schemas
class OTPChallengeRequest(BaseModel):
    phone_or_email: str
    purpose: Optional[str] = "LOGIN"  # LOGIN or REGISTRATION
    role: Optional[str] = None

class OTPChallengeResponse(BaseModel):
    session_id: str
    phone_or_email: str
    purpose: str
    expires_at: datetime
    message: str

class UserLoginRequest(BaseModel):
    phone_or_email: str
    session_id: Optional[str] = None
    password: Optional[str] = None
    otp: Optional[str] = None

class UserRegisterRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    password: Optional[str] = None
    otp: Optional[str] = None
    session_id: Optional[str] = None
    role: Optional[str] = "CUSTOMER" # SUPER_ADMIN, HOTEL_ADMIN, TRANSPORT_ADMIN, CUSTOMER
    operator_sub_role: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    mobile: str
    role: str
    operator_sub_role: Optional[str] = None
    status: str
    is_verified: bool
    digilocker_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Hotel Schemas
class HotelOnboardRequest(BaseModel):
    propertyName: str
    propertyType: str
    ownerName: str
    contactPhone: str
    contactEmail: str
    address: Dict[str, Any]
    details: Dict[str, Any]
    verification: Optional[Dict[str, Any]] = None

class HotelStatusUpdateRequest(BaseModel):
    approvalStatus: str # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, SUSPENDED

class HotelAdminActionRequest(BaseModel):
    reason: Optional[str] = None
    note: Optional[str] = None

class AdminHotelCreateRequest(BaseModel):
    propertyName: str
    propertyType: str = "homestay"
    ownerId: Optional[str] = None
    ownerName: Optional[str] = None
    ownerPassword: Optional[str] = None
    contactPhone: str
    contactEmail: str
    address: Dict[str, Any]
    details: Dict[str, Any] = {}
    verification: Optional[Dict[str, Any]] = None
    approvalStatus: Optional[str] = "APPROVED"

class AdminAssignHotelOwnerRequest(BaseModel):
    ownerId: str
    ownerName: Optional[str] = None
    password: Optional[str] = None
    mobile: Optional[str] = None
    notes: Optional[str] = None

class HotelResponse(BaseModel):
    id: str
    propertyName: str
    propertyType: str
    ownerName: str
    contactPhone: str
    contactEmail: str
    address: Dict[str, Any]
    details: Dict[str, Any]
    verification: Dict[str, Any]
    approvalStatus: str
    rating: float
    totalBookings: int
    createdAt: datetime

class RoomTypeCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    bedConfig: str = "King Bed"
    roomSizeSqft: int = 320
    inventoryCount: int = 1
    maxOccupancy: int = 3
    adultCapacity: int = 2
    childCapacity: int = 1
    basePrice: float
    extraAdultPrice: float = 500.0
    extraChildPrice: float = 250.0
    amenities: Optional[List[str]] = None
    status: str = "ACTIVE"

class RoomTypeUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    bedConfig: Optional[str] = None
    roomSizeSqft: Optional[int] = None
    inventoryCount: Optional[int] = None
    maxOccupancy: Optional[int] = None
    adultCapacity: Optional[int] = None
    childCapacity: Optional[int] = None
    basePrice: Optional[float] = None
    extraAdultPrice: Optional[float] = None
    extraChildPrice: Optional[float] = None
    amenities: Optional[List[str]] = None
    status: Optional[str] = None

class RoomTypeResponse(BaseModel):
    id: str
    hotelId: str
    name: str
    description: Optional[str] = None
    bedConfig: str
    roomSizeSqft: int
    inventoryCount: int
    maxOccupancy: int
    adultCapacity: int
    childCapacity: int
    basePrice: float
    extraAdultPrice: float
    extraChildPrice: float
    amenities: List[str]
    status: str
    createdAt: datetime

class RoomInventoryBlockCreateRequest(BaseModel):
    quantity: int = 1
    startDate: str # YYYY-MM-DD or DD/MM/YYYY
    endDate: str   # YYYY-MM-DD or DD/MM/YYYY
    reason: str = "MAINTENANCE" # MAINTENANCE, RENOVATION, PRIVATE_HOLD, SEASONAL_CLOSURE
    note: Optional[str] = None

class RoomInventoryBlockResponse(BaseModel):
    id: str
    hotelId: str
    roomTypeId: str
    quantity: int
    startDate: str
    endDate: str
    reason: str
    note: Optional[str] = None
    status: str
    createdAt: datetime

class RoomTypeAvailabilityResponse(BaseModel):
    hotelId: str
    roomTypeId: str
    roomTypeName: str
    basePrice: float
    totalInventory: int
    bookedRooms: int
    blockedRooms: int
    availableRooms: int
    status: str # AVAILABLE, LIMITED, SOLD_OUT
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None

class HotelAvailabilityResponse(BaseModel):
    hotelId: str
    propertyName: str
    city: str
    approvalStatus: str
    inventoryConfirmed: bool
    totalRooms: int
    totalBooked: int
    totalBlocked: int
    totalAvailable: int
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    roomTypes: List[RoomTypeAvailabilityResponse]

class HotelDashboardSummaryResponse(BaseModel):
    hotelId: str
    propertyName: str
    totalRooms: int
    activeBookings: int
    blockedRooms: int
    availableRooms: int
    occupancyRate: float
    inventoryConfirmed: bool
    approvalStatus: str
    monthlyRevenueINR: float

class InventoryConfirmRequest(BaseModel):
    confirmed: bool = True

# Vehicle & Rental Schemas
class VehicleAvailabilityCheckRequest(BaseModel):
    vehicleId: str
    startDate: str
    endDate: str

class VehicleImageVerificationRequest(BaseModel):
    vehicleId: str
    verified: bool
    match: bool

class RentalVehicleResponse(BaseModel):
    id: str
    destinationKey: str
    manufacturer: str
    model: str
    variant: str
    modelYear: int
    name: str
    category: str
    seatingCapacity: int
    transmission: str
    fuelType: str
    acAvailable: bool
    dailyRate: float
    hourlyRate: Optional[float] = None
    driverChargePerDay: float
    securityDeposit: float
    registrationState: str
    rentalLocation: str
    vendorName: str
    vendorPhone: str
    vendorRating: float
    supportsSelfDrive: bool
    supportsWithDriver: bool
    features: List[str]
    termsAndConditions: List[str]
    zeroCommissionVerified: bool
    image_url: str
    image_source: str
    image_verified: bool
    image_vehicle_match: bool

# Cart Schemas
class AddToCartRequest(BaseModel):
    service_type: str # HOTEL_ROOM, RENT_VEHICLE, TRANSPORT, DRIVER
    item_data: Dict[str, Any]
    price_snapshot: float
    quantity: int = 1
    start_date: Optional[str] = None
    end_date: Optional[str] = None

# Trip Schemas
class CreateTripRequest(BaseModel):
    id: Optional[str] = None
    destinationKey: str
    destinationName: str
    origin: Optional[str] = "Hyderabad"
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    dates: Optional[str] = None
    calculatedNights: Optional[int] = 4
    nights: Optional[int] = None
    travelersCount: Optional[int] = 2
    durationDays: Optional[int] = 5
    persona: Optional[str] = "couple"
    totalCost: Optional[float] = 0.0
    transportId: Optional[str] = None
    stayId: Optional[str] = None
    driverId: Optional[str] = None
    updatedAt: Optional[str] = None

# Booking Schemas
class CreateBookingRequest(BaseModel):
    id: Optional[str] = None
    pnr: Optional[str] = None
    destinationKey: str
    destinationName: str
    origin: Optional[str] = "Hyderabad"
    dates: str
    nights: Optional[int] = 4
    guests: Optional[int] = 2
    transport: Optional[str] = None
    transportTitle: Optional[str] = None
    stay: Optional[str] = None
    stayName: Optional[str] = None
    driver: Optional[str] = None
    driverName: Optional[str] = None
    rentalVehicle: Optional[Dict[str, Any]] = None
    totalCost: str
    numericTotal: float
    paymentMethod: Optional[str] = "UPI"
    travelerName: Optional[str] = "Traveler"
    travelerPhone: Optional[str] = ""

# Audit & Matching Schemas
class AssignPartnerRequest(BaseModel):
    assignmentId: str
    partnerId: str
    reason: Optional[str] = None

class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    action: str
    performedBy: str
    role: str

# ==============================================================================
# TOUR OPERATOR SCHEMAS
# ==============================================================================

class TourActivityCreate(BaseModel):
    activity_name: str
    activity_type: Optional[str] = "HERITAGE_WALK"
    start_time: Optional[str] = "09:00 AM"
    duration_hours: Optional[float] = 2.0
    location_name: str
    is_optional: Optional[bool] = False
    extra_cost_inr: Optional[float] = 0.0

class TourItineraryDayCreate(BaseModel):
    day_number: int
    title: str
    description: Optional[str] = None
    meals_included: Optional[List[str]] = []
    overnight_stay: Optional[str] = None
    activities: Optional[List[TourActivityCreate]] = []

class TourPackageCreate(BaseModel):
    title: str
    destination_key: str
    destination_name: str
    category: Optional[str] = "heritage"
    duration_days: int = 5
    duration_nights: int = 4
    base_price_inr: float
    discounted_price_inr: Optional[float] = None
    max_capacity_per_batch: int = 15
    min_capacity_per_batch: int = 2
    difficulty_level: Optional[str] = "MODERATE"
    guide_requirement: Optional[str] = "LICENSED_STORYTELLER"
    inclusions_json: Optional[List[str]] = []
    exclusions_json: Optional[List[str]] = []
    cancellation_policy: Optional[str] = None
    destinations_json: Optional[List[str]] = [] # Multi-destinations e.g. ["delhi", "agra", "jaipur"]
    cover_image_url: Optional[str] = None
    gallery_json: Optional[List[str]] = []
    itinerary_days: Optional[List[TourItineraryDayCreate]] = []

class TourPackageUpdate(BaseModel):
    title: Optional[str] = None
    destination_key: Optional[str] = None
    destination_name: Optional[str] = None
    category: Optional[str] = None
    duration_days: Optional[int] = None
    duration_nights: Optional[int] = None
    base_price_inr: Optional[float] = None
    discounted_price_inr: Optional[float] = None
    max_capacity_per_batch: Optional[int] = None
    min_capacity_per_batch: Optional[int] = None
    difficulty_level: Optional[str] = None
    guide_requirement: Optional[str] = None
    inclusions_json: Optional[List[str]] = None
    exclusions_json: Optional[List[str]] = None
    cancellation_policy: Optional[str] = None
    destinations_json: Optional[List[str]] = None
    status: Optional[str] = None
    cover_image_url: Optional[str] = None
    gallery_json: Optional[List[str]] = None

class TourGuideCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    languages_json: Optional[List[str]] = []
    specialty: Optional[str] = "Storyteller & Cultural Historian"
    badge_number: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class TourScheduleCreate(BaseModel):
    package_id: str
    guide_id: Optional[str] = None
    start_date: str
    end_date: str
    batch_capacity: Optional[int] = 15

# ==============================================================================
# TRANSPORT ADMIN SCHEMAS
# ==============================================================================

class VehicleCreateRequest(BaseModel):
    destination_key: str
    manufacturer: str
    model: str
    variant: str
    model_year: Optional[int] = 2024
    name: str
    category: str # hatchback, sedan, suv, muv, luxury, tempo_traveller, scooter_ev
    seating_capacity: int
    transmission: Optional[str] = "Manual"
    fuel_type: Optional[str] = "Diesel"
    ac_available: Optional[bool] = True
    daily_rate: float
    hourly_rate: Optional[float] = None
    driver_charge_per_day: Optional[float] = 500.0
    security_deposit: Optional[float] = 3000.0
    registration_state: str
    registration_number: Optional[str] = None
    rental_location: str
    vendor_name: str
    vendor_phone: str
    supports_self_drive: Optional[bool] = True
    supports_with_driver: Optional[bool] = True
    fitness_certificate_expiry: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    insurance_expiry: Optional[str] = None
    puc_expiry: Optional[str] = None
    next_maintenance_km: Optional[int] = 5000

class VehicleUpdateRequest(BaseModel):
    daily_rate: Optional[float] = None
    operational_status: Optional[str] = None # AVAILABLE, ON_TRIP, MAINTENANCE, DECOMMISSIONED
    assigned_driver_id: Optional[str] = None
    fitness_certificate_expiry: Optional[str] = None
    insurance_expiry: Optional[str] = None
    puc_expiry: Optional[str] = None
    next_maintenance_km: Optional[int] = None
    last_maintenance_date: Optional[str] = None

class VehicleMaintenanceRequest(BaseModel):
    last_maintenance_date: str
    next_maintenance_km: int
    notes: Optional[str] = None

class DriverCreateRequest(BaseModel):
    full_name: str
    phone: str
    driving_license: Optional[str] = None
    license_expiry: Optional[str] = None
    vehicle_model: Optional[str] = None
    registration_number: Optional[str] = None
    languages_json: Optional[List[str]] = []
    specialties_json: Optional[List[str]] = []
    bio: Optional[str] = None

class DriverDocumentVerifyRequest(BaseModel):
    aadhaar_verified: bool = True
    police_verification_status: str = "VERIFIED" # VERIFIED, PENDING, EXPIRED

class TransportAssignmentRequest(BaseModel):
    tour_schedule_id: Optional[str] = None
    booking_id: Optional[str] = None
    vehicle_id: str
    driver_id: str
    pickup_location: str
    drop_location: str
    start_time: Optional[datetime] = None
    details: Optional[str] = None

# ==============================================================================
# CUSTOM JOURNEY BUILDER SCHEMAS
# ==============================================================================

class RecommendationRequest(BaseModel):
    selected_destinations: List[str] = []
    starting_location: Optional[str] = "Hyderabad"
    user_preferences: Optional[List[str]] = []
    budget_inr: Optional[float] = None
    total_duration_days: Optional[int] = 5
    travel_dates: Optional[str] = None

class CustomJourneyDestinationInput(BaseModel):
    destination_key: str
    destination_name: str
    sequence_order: int
    stay_nights: Optional[int] = 1
    selected_hotel_id: Optional[str] = None
    selected_hotel_name: Optional[str] = None
    selected_room_type_id: Optional[str] = None
    selected_activities: Optional[List[Dict[str, Any]]] = None
    transport_mode: Optional[str] = "Car / Tourist Vehicle"
    distance_km: Optional[float] = None
    travel_time_hours: Optional[float] = None
    notes: Optional[str] = None

class CustomJourneyCreateRequest(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = "My Custom Journey"
    start_location: str = "Hyderabad"
    start_date: str
    end_date: str
    duration_days: Optional[int] = 5
    total_nights: Optional[int] = 4
    adults_count: Optional[int] = 2
    children_count: Optional[int] = 0
    budget_inr: Optional[float] = None
    preferences: Optional[List[str]] = []
    status: Optional[str] = "DRAFT"
    destinations: List[CustomJourneyDestinationInput] = []
    itinerary: Optional[List[Dict[str, Any]]] = None
    cost_estimate: Optional[Dict[str, Any]] = None

class CustomJourneyUpdateRequest(BaseModel):
    title: Optional[str] = None
    start_location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration_days: Optional[int] = None
    total_nights: Optional[int] = None
    adults_count: Optional[int] = None
    children_count: Optional[int] = None
    budget_inr: Optional[float] = None
    preferences: Optional[List[str]] = None
    status: Optional[str] = None
    destinations: Optional[List[CustomJourneyDestinationInput]] = None
    itinerary: Optional[List[Dict[str, Any]]] = None
    cost_estimate: Optional[Dict[str, Any]] = None


# ==============================================================================
# TRANSPORT CREDENTIAL & CHANGE REQUEST SCHEMAS
# ==============================================================================

class TransportCredentialCreate(BaseModel):
    tour_operator_id: str
    credential_number: Optional[str] = None
    compliance_status: Optional[str] = "COMPLIANT"
    expires_at: Optional[datetime] = None
    notes: Optional[str] = None
    vehicle_ids: Optional[List[str]] = []
    driver_ids: Optional[List[str]] = []

class TransportCredentialStatusUpdate(BaseModel):
    status: str # ACTIVE, SUSPENDED, DEACTIVATED, PENDING
    compliance_status: Optional[str] = None
    notes: Optional[str] = None

class CredentialVehicleAssignRequest(BaseModel):
    vehicle_id: str

class CredentialDriverAssignRequest(BaseModel):
    driver_id: str

class TransportChangeRequestCreate(BaseModel):
    credential_id: Optional[str] = None
    request_type: str # VEHICLE_CHANGE, DRIVER_CHANGE, VEHICLE_ASSIGNMENT, DRIVER_ASSIGNMENT, TRANSPORT_INFO_CHANGE, OTHER
    title: str
    description: str
    requested_changes_json: Optional[Dict[str, Any]] = None

class TransportChangeRequestReview(BaseModel):
    status: str # APPROVED, REJECTED
    reviewer_notes: Optional[str] = None


