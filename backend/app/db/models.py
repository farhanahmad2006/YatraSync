# Changes made by @MdFarhanAhmad
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    mobile = Column(String(50), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(30), nullable=False, default="CUSTOMER") # SUPER_ADMIN, HOTEL_OWNER, HOTEL_ADMIN, TRANSPORT_ADMIN, CUSTOMER
    operator_sub_role = Column(String(30), nullable=True) # GUIDE, DRIVER, GUIDE_DRIVER
    status = Column(String(20), nullable=False, default="ACTIVE") # ACTIVE, SUSPENDED, PENDING
    is_verified = Column(Boolean, default=False)
    digilocker_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)

    hotel_owner_profile = relationship("HotelOwnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    hotels = relationship("Hotel", back_populates="owner")
    trips = relationship("Trip", back_populates="customer")
    carts = relationship("Cart", back_populates="customer")
    bookings = relationship("Booking", back_populates="customer")
    transactions = relationship("Transaction", back_populates="customer")
    user_roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")
    custom_journeys = relationship("CustomJourney", back_populates="customer", cascade="all, delete-orphan")

class HotelOwnerProfile(Base):
    __tablename__ = "hotel_owner_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    business_name = Column(String(150), nullable=True)
    pan_number = Column(String(20), nullable=True)
    gstin = Column(String(20), nullable=True)
    bank_account_number = Column(String(50), nullable=True)
    bank_ifsc = Column(String(20), nullable=True)
    bank_account_holder = Column(String(100), nullable=True)
    verification_status = Column(String(30), default="PENDING", index=True) # PENDING, VERIFIED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="hotel_owner_profile")

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    property_name = Column(String(150), nullable=False, index=True)
    property_type = Column(String(50), nullable=False) # hotel, resort, homestay, ecolodge, heritage
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    owner_name = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    contact_email = Column(String(100), nullable=False)
    address_line = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    pincode = Column(String(10), nullable=False)
    landmark = Column(String(150), nullable=True)
    room_count = Column(Integer, default=1)
    base_tariff_inr = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    amenities = Column(JSON, nullable=True)
    pan_number = Column(String(20), nullable=True)
    gstin = Column(String(20), nullable=True)
    digilocker_verified = Column(Boolean, default=False)
    approval_status = Column(String(30), nullable=False, default="DRAFT", index=True) # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, ACTIVE, SUSPENDED, REJECTED
    inventory_confirmed = Column(Boolean, default=False) # Owner's inventory confirmation status
    rating = Column(Float, default=4.8)
    total_bookings = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="hotels")
    images = relationship("HotelImage", back_populates="hotel", cascade="all, delete-orphan")
    room_types = relationship("RoomType", back_populates="hotel", cascade="all, delete-orphan")
    physical_rooms = relationship("Room", back_populates="hotel", cascade="all, delete-orphan")
    inventory_blocks = relationship("RoomInventoryBlock", back_populates="hotel", cascade="all, delete-orphan")

class HotelImage(Base):
    __tablename__ = "hotel_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hotel_id = Column(String(36), ForeignKey("hotels.id"), nullable=False)
    image_url = Column(Text, nullable=False)
    image_source = Column(String(100), default="partner_upload")
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    hotel = relationship("Hotel", back_populates="images")

class RoomType(Base):
    __tablename__ = "room_types"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hotel_id = Column(String(36), ForeignKey("hotels.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    bed_config = Column(String(100), default="King Bed")
    room_size_sqft = Column(Integer, default=320)
    inventory_count = Column(Integer, default=1)
    max_occupancy = Column(Integer, default=3)
    adult_capacity = Column(Integer, default=2)
    child_capacity = Column(Integer, default=1)
    base_price = Column(Float, nullable=False)
    extra_adult_price = Column(Float, default=500.0)
    extra_child_price = Column(Float, default=250.0)
    amenities = Column(JSON, nullable=True)
    currency = Column(String(10), default="INR")
    status = Column(String(30), default="ACTIVE", index=True) # ACTIVE, INACTIVE, ARCHIVED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hotel = relationship("Hotel", back_populates="room_types")
    images = relationship("RoomTypeImage", back_populates="room_type", cascade="all, delete-orphan")
    rooms = relationship("Room", back_populates="room_type", cascade="all, delete-orphan")
    booking_items = relationship("RoomBookingItem", back_populates="room_type")
    blocks = relationship("RoomInventoryBlock", back_populates="room_type", cascade="all, delete-orphan")

class RoomTypeImage(Base):
    __tablename__ = "room_type_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    room_type_id = Column(String(36), ForeignKey("room_types.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    room_type = relationship("RoomType", back_populates="images")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hotel_id = Column(String(36), ForeignKey("hotels.id"), nullable=False, index=True)
    room_type_id = Column(String(36), ForeignKey("room_types.id"), nullable=False, index=True)
    room_number = Column(String(50), nullable=False)
    floor = Column(String(20), nullable=True)
    operational_status = Column(String(30), default="AVAILABLE", index=True) # AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE, INACTIVE
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hotel = relationship("Hotel", back_populates="physical_rooms")
    room_type = relationship("RoomType", back_populates="rooms")

class RoomInventoryBlock(Base):
    __tablename__ = "room_inventory_blocks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hotel_id = Column(String(36), ForeignKey("hotels.id"), nullable=False, index=True)
    room_type_id = Column(String(36), ForeignKey("room_types.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    start_date = Column(String(50), nullable=False, index=True) # YYYY-MM-DD
    end_date = Column(String(50), nullable=False, index=True)   # YYYY-MM-DD
    reason = Column(String(100), nullable=False, default="MAINTENANCE") # MAINTENANCE, RENOVATION, PRIVATE_HOLD, SEASONAL_CLOSURE
    note = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default="ACTIVE", index=True) # ACTIVE, RELEASED
    created_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hotel = relationship("Hotel", back_populates="inventory_blocks")
    room_type = relationship("RoomType", back_populates="blocks")
    created_by = relationship("User")

class RoomBookingItem(Base):
    __tablename__ = "room_booking_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=False, index=True)
    room_type_id = Column(String(36), ForeignKey("room_types.id"), nullable=False, index=True)
    room_id = Column(String(36), ForeignKey("rooms.id"), nullable=True)
    check_in_date = Column(String(50), nullable=False)
    check_out_date = Column(String(50), nullable=False)
    rooms_count = Column(Integer, default=1)
    rate_per_night = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="room_items")
    room_type = relationship("RoomType", back_populates="booking_items")
    room = relationship("Room")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    provider_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    destination_key = Column(String(50), nullable=False, index=True)
    manufacturer = Column(String(100), nullable=False) # e.g. Toyota, Mahindra, Maruti Suzuki, Ather, Force
    model = Column(String(100), nullable=False, index=True) # e.g. Innova Crysta, Thar 4x4, Swift, 450X EV, Traveller 12
    variant = Column(String(100), nullable=False)
    model_year = Column(Integer, default=2024)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False, index=True) # hatchback, sedan, suv, muv, luxury, tempo_traveller, scooter_ev
    seating_capacity = Column(Integer, nullable=False)
    transmission = Column(String(20), nullable=False, default="Manual") # Automatic, Manual
    fuel_type = Column(String(20), nullable=False, default="Diesel") # Electric, Petrol, Diesel, CNG
    ac_available = Column(Boolean, default=True)
    daily_rate = Column(Float, nullable=False)
    hourly_rate = Column(Float, nullable=True)
    driver_charge_per_day = Column(Float, default=500.0)
    security_deposit = Column(Float, default=3000.0)
    registration_state = Column(String(10), nullable=False) # GA-03, KL-07, MH-02, DL-01, TS-09
    registration_number = Column(String(30), nullable=True)
    rental_location = Column(String(100), nullable=False)
    vendor_name = Column(String(100), nullable=False)
    vendor_phone = Column(String(20), nullable=False)
    vendor_rating = Column(Float, default=4.9)
    supports_self_drive = Column(Boolean, default=True)
    supports_with_driver = Column(Boolean, default=True)
    features_json = Column(JSON, nullable=True)
    terms_json = Column(JSON, nullable=True)
    zero_commission_verified = Column(Boolean, default=True)
    status = Column(String(30), default="AVAILABLE") # AVAILABLE, RENTED, MAINTENANCE, UNAVAILABLE
    assigned_driver_id = Column(String(36), ForeignKey("drivers.id"), nullable=True)
    fitness_certificate_expiry = Column(String(50), nullable=True)
    insurance_policy_number = Column(String(100), nullable=True)
    insurance_expiry = Column(String(50), nullable=True)
    puc_expiry = Column(String(50), nullable=True)
    last_maintenance_date = Column(String(50), nullable=True)
    next_maintenance_km = Column(Integer, default=5000)
    operational_status = Column(String(30), default="AVAILABLE") # AVAILABLE, ON_TRIP, MAINTENANCE, DECOMMISSIONED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("VehicleImage", back_populates="vehicle", cascade="all, delete-orphan")
    transport_assignments = relationship("TransportTripAssignment", back_populates="vehicle")

class VehicleImage(Base):
    __tablename__ = "vehicle_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    image_url = Column(Text, nullable=False)
    image_source = Column(String(100), default="vendor_upload")
    is_verified = Column(Boolean, default=False)
    vehicle_match_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String(100), nullable=True)

    vehicle = relationship("Vehicle", back_populates="images")

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    driving_license = Column(String(50), nullable=True)
    license_expiry = Column(String(50), nullable=True)
    aadhaar_verified = Column(Boolean, default=True)
    police_verification_status = Column(String(30), default="VERIFIED") # VERIFIED, PENDING, EXPIRED
    vehicle_model = Column(String(100), nullable=True)
    registration_number = Column(String(30), nullable=True)
    current_vehicle_id = Column(String(36), nullable=True)
    rating = Column(Float, default=4.95)
    total_trips = Column(Integer, default=50)
    languages_json = Column(JSON, nullable=True)
    specialties_json = Column(JSON, nullable=True)
    bio = Column(Text, nullable=True)
    availability_status = Column(String(30), default="AVAILABLE") # AVAILABLE, BUSY, OFF_DUTY
    duty_status = Column(String(30), default="AVAILABLE") # AVAILABLE, ON_DUTY, RESTING, SUSPENDED
    created_at = Column(DateTime, default=datetime.utcnow)

    transport_assignments = relationship("TransportTripAssignment", back_populates="driver")

# ==============================================================================
# TOUR OPERATOR DOMAIN MODELS
# ==============================================================================

class TourPackage(Base):
    __tablename__ = "tour_packages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    operator_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False, index=True)
    destination_key = Column(String(50), nullable=False, index=True)
    destination_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, default="heritage") # heritage, eco_adventure, romantic_getaway, wellness_ayurveda, wildlife_safari
    duration_days = Column(Integer, nullable=False, default=5)
    duration_nights = Column(Integer, nullable=False, default=4)
    base_price_inr = Column(Float, nullable=False)
    discounted_price_inr = Column(Float, nullable=True)
    max_capacity_per_batch = Column(Integer, nullable=False, default=15)
    min_capacity_per_batch = Column(Integer, nullable=False, default=2)
    difficulty_level = Column(String(30), default="MODERATE") # EASY, MODERATE, CHALLENGING
    guide_requirement = Column(String(50), default="LICENSED_STORYTELLER") # LICENSED_STORYTELLER, NATURALIST, HISTORIAN, NONE
    inclusions_json = Column(JSON, nullable=True)
    exclusions_json = Column(JSON, nullable=True)
    cancellation_policy = Column(Text, nullable=True)
    destinations_json = Column(JSON, nullable=True) # ["delhi", "agra", "jaipur"] or ["shimla"]
    status = Column(String(30), nullable=False, default="PUBLISHED", index=True) # DRAFT, PUBLISHED, PAUSED, ARCHIVED
    rating = Column(Float, default=4.9)
    total_bookings = Column(Integer, default=0)
    cover_image_url = Column(Text, nullable=True)
    gallery_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    operator = relationship("User", foreign_keys=[operator_id])
    itinerary_days = relationship("TourItineraryDay", back_populates="package", cascade="all, delete-orphan", order_by="TourItineraryDay.day_number")
    activities = relationship("TourActivity", back_populates="package", cascade="all, delete-orphan")
    schedules = relationship("TourSchedule", back_populates="package", cascade="all, delete-orphan")
    booking_items = relationship("TourBookingItem", back_populates="package", cascade="all, delete-orphan")

class TourItineraryDay(Base):
    __tablename__ = "tour_itinerary_days"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    package_id = Column(String(36), ForeignKey("tour_packages.id"), nullable=False, index=True)
    day_number = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    meals_included = Column(JSON, nullable=True) # ["Breakfast", "Traditional Kerala Sadhya Lunch"]
    overnight_stay = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    package = relationship("TourPackage", back_populates="itinerary_days")
    activities = relationship("TourActivity", back_populates="day", cascade="all, delete-orphan")

class TourActivity(Base):
    __tablename__ = "tour_activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    itinerary_day_id = Column(String(36), ForeignKey("tour_itinerary_days.id"), nullable=True, index=True)
    package_id = Column(String(36), ForeignKey("tour_packages.id"), nullable=False, index=True)
    activity_name = Column(String(150), nullable=False)
    activity_type = Column(String(50), default="HERITAGE_WALK") # TREK, HERITAGE_WALK, WORKSHOP, BOAT_CRUISE, WILDLIFE_SAFARI
    start_time = Column(String(20), default="09:00 AM")
    duration_hours = Column(Float, default=2.0)
    location_name = Column(String(150), nullable=False)
    is_optional = Column(Boolean, default=False)
    extra_cost_inr = Column(Float, default=0.0)

    day = relationship("TourItineraryDay", back_populates="activities")
    package = relationship("TourPackage", back_populates="activities")

class TourGuide(Base):
    __tablename__ = "tour_guides"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    operator_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    languages_json = Column(JSON, nullable=True)
    specialty = Column(String(100), default="Storyteller & Cultural Historian")
    badge_number = Column(String(50), nullable=True)
    rating = Column(Float, default=4.95)
    status = Column(String(30), default="ACTIVE") # ACTIVE, ON_TOUR, ON_LEAVE
    created_at = Column(DateTime, default=datetime.utcnow)

    operator = relationship("User", foreign_keys=[operator_id])
    schedules = relationship("TourSchedule", back_populates="guide")

class TourSchedule(Base):
    __tablename__ = "tour_schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    package_id = Column(String(36), ForeignKey("tour_packages.id"), nullable=False, index=True)
    guide_id = Column(String(36), ForeignKey("tour_guides.id"), nullable=True)
    start_date = Column(String(50), nullable=False, index=True) # YYYY-MM-DD
    end_date = Column(String(50), nullable=False, index=True)   # YYYY-MM-DD
    batch_capacity = Column(Integer, nullable=False, default=15)
    booked_seats = Column(Integer, default=0)
    status = Column(String(30), default="OPEN", index=True) # OPEN, SOLD_OUT, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    package = relationship("TourPackage", back_populates="schedules")
    guide = relationship("TourGuide", back_populates="schedules")
    booking_items = relationship("TourBookingItem", back_populates="schedule")
    transport_assignments = relationship("TransportTripAssignment", back_populates="schedule")

class TourBookingItem(Base):
    __tablename__ = "tour_booking_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=True, index=True)
    schedule_id = Column(String(36), ForeignKey("tour_schedules.id"), nullable=False, index=True)
    package_id = Column(String(36), ForeignKey("tour_packages.id"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(100), nullable=True)
    travelers_count = Column(Integer, default=2)
    total_price = Column(Float, nullable=False)
    special_requests = Column(Text, nullable=True)
    status = Column(String(30), default="CONFIRMED") # CONFIRMED, CANCELLED, COMPLETED
    created_at = Column(DateTime, default=datetime.utcnow)

    schedule = relationship("TourSchedule", back_populates="booking_items")
    package = relationship("TourPackage", back_populates="booking_items")

class TransportTripAssignment(Base):
    __tablename__ = "transport_trip_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=True, index=True)
    tour_schedule_id = Column(String(36), ForeignKey("tour_schedules.id"), nullable=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False, index=True)
    driver_id = Column(String(36), ForeignKey("drivers.id"), nullable=False, index=True)
    pickup_location = Column(String(255), nullable=False)
    drop_location = Column(String(255), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    trip_status = Column(String(30), default="SCHEDULED", index=True) # SCHEDULED, EN_ROUTE, ARRIVED, COMPLETED, CANCELLED
    telemetry_live_lat = Column(Float, nullable=True)
    telemetry_live_lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="transport_assignments")
    driver = relationship("Driver", back_populates="transport_assignments")
    schedule = relationship("TourSchedule", back_populates="transport_assignments")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    trip_id_code = Column(String(50), nullable=False, unique=True, index=True)
    pnr = Column(String(50), nullable=False, unique=True, index=True)
    destination_key = Column(String(50), nullable=False)
    destination_name = Column(String(100), nullable=False)
    origin = Column(String(100), nullable=False)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    calculated_nights = Column(Integer, default=4)
    travelers_count = Column(Integer, default=2)
    duration_days = Column(Integer, default=5)
    persona = Column(String(50), default="couple")
    total_cost = Column(Float, default=0.0)
    status = Column(String(30), default="PLANNED", index=True) # PLANNED, BOOKING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="trips")

class Cart(Base):
    __tablename__ = "carts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="carts")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cart_id = Column(String(36), ForeignKey("carts.id"), nullable=False)
    service_type = Column(String(50), nullable=False) # HOTEL_ROOM, RENT_VEHICLE, TRANSPORT, DRIVER
    item_data_json = Column(JSON, nullable=False)
    price_snapshot = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    cart = relationship("Cart", back_populates="items")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    pnr = Column(String(50), nullable=False, unique=True, index=True)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    trip_id = Column(String(36), nullable=True)
    destination_key = Column(String(50), nullable=False)
    destination_name = Column(String(100), nullable=False)
    origin = Column(String(100), nullable=False)
    dates_text = Column(String(100), nullable=False)
    nights = Column(Integer, default=4)
    guests_count = Column(Integer, default=2)
    transport_details_json = Column(JSON, nullable=True)
    stay_details_json = Column(JSON, nullable=True)
    driver_details_json = Column(JSON, nullable=True)
    rental_vehicle_details_json = Column(JSON, nullable=True)
    total_cost_text = Column(String(50), nullable=False)
    numeric_total = Column(Float, nullable=False)
    status = Column(String(30), default="Confirmed", index=True) # Pending, Confirmed, Active, Completed, Cancelled
    payment_status = Column(String(30), default="Paid") # Unpaid, Paid, Refunded
    payment_method = Column(String(50), default="UPI")
    traveler_name = Column(String(100), nullable=False)
    traveler_phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="bookings")
    transactions = relationship("Transaction", back_populates="booking")
    room_items = relationship("RoomBookingItem", back_populates="booking", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    transaction_reference = Column(String(100), nullable=False, unique=True, index=True)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=True)
    amount = Column(Float, nullable=False)
    tax = Column(Float, default=0.0) # 18% GST where applicable
    fee = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    payment_method = Column(String(50), default="UPI")
    payment_gateway = Column(String(50), default="Razorpay/BHIM UPI")
    gateway_transaction_id = Column(String(100), nullable=True)
    status = Column(String(30), default="SUCCESS", index=True) # PENDING, SUCCESS, FAILED, REFUNDED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="transactions")
    booking = relationship("Booking", back_populates="transactions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_user_id = Column(String(36), nullable=True)
    actor_role = Column(String(30), nullable=False, default="SYSTEM")
    action = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False, index=True)
    entity_id = Column(String(100), nullable=True)
    old_value_json = Column(JSON, nullable=True)
    new_value_json = Column(JSON, nullable=True)
    description = Column(Text, nullable=False)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OTPVerificationSession(Base):
    __tablename__ = "otp_verification_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    mobile_or_email = Column(String(150), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    purpose = Column(String(30), nullable=False, default="LOGIN")  # LOGIN, REGISTRATION
    role = Column(String(30), nullable=False, default="CUSTOMER")  # CUSTOMER, HOTEL_ADMIN, TRANSPORT_ADMIN, SUPER_ADMIN
    attempt_count = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    status = Column(String(30), default="PENDING", index=True)  # PENDING, VERIFIED, FAILED, EXPIRED, LOCKED
    expires_at = Column(DateTime, nullable=False)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", backref="otp_sessions")


class Role(Base):
    __tablename__ = "roles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), unique=True, nullable=False, index=True) # SUPER_ADMIN, HOTEL_OWNER, HOTEL_ADMIN, TRANSPORT_ADMIN, CUSTOMER
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    permissions = relationship("RolePermission", back_populates="role", cascade="all, delete-orphan")
    user_roles = relationship("UserRole", back_populates="role", cascade="all, delete-orphan")


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False, index=True) # HOTEL, ROOM, INVENTORY, TARIFF, BOOKING, OPERATIONS, ANALYTICS, TRANSPORT, TRAVELER, SYSTEM
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    role_permissions = relationship("RolePermission", back_populates="permission", cascade="all, delete-orphan")


class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    role_id = Column(String(36), ForeignKey("roles.id"), nullable=False, index=True)
    permission_id = Column(String(36), ForeignKey("permissions.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="role_permissions")


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    role_id = Column(String(36), ForeignKey("roles.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")


# ==============================================================================
# CUSTOM JOURNEY BUILDER DOMAIN MODELS
# ==============================================================================

class CustomJourney(Base):
    __tablename__ = "custom_journeys"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(200), nullable=False, default="My Custom Journey")
    start_location = Column(String(100), nullable=False, default="Hyderabad")
    start_date = Column(String(50), nullable=False) # YYYY-MM-DD
    end_date = Column(String(50), nullable=False)   # YYYY-MM-DD
    duration_days = Column(Integer, default=5)
    total_nights = Column(Integer, default=4)
    adults_count = Column(Integer, default=2)
    children_count = Column(Integer, default=0)
    budget_inr = Column(Float, nullable=True)
    preferences_json = Column(JSON, nullable=True) # ["Nature", "Wildlife", "Culture", "Relaxation"]
    status = Column(String(30), default="DRAFT", index=True) # DRAFT, PLANNING, READY, BOOKING_IN_PROGRESS, CONFIRMED, COMPLETED, CANCELLED
    itinerary_json = Column(JSON, nullable=True) # Day-by-day customized itinerary blocks
    cost_estimate_json = Column(JSON, nullable=True) # {hotels: 12000, transport: 6000, activities: 3000, total: 21000}
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="custom_journeys")
    destinations = relationship("CustomJourneyDestination", back_populates="journey", cascade="all, delete-orphan", order_by="CustomJourneyDestination.sequence_order")


class CustomJourneyDestination(Base):
    __tablename__ = "custom_journey_destinations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    journey_id = Column(String(36), ForeignKey("custom_journeys.id"), nullable=False, index=True)
    destination_key = Column(String(50), nullable=False, index=True) # e.g. 'munnar', 'kochi', 'thekkady', 'alleppey'
    destination_name = Column(String(100), nullable=False)
    sequence_order = Column(Integer, nullable=False, default=1)
    arrival_date = Column(String(50), nullable=True)
    departure_date = Column(String(50), nullable=True)
    stay_nights = Column(Integer, default=1)
    selected_hotel_id = Column(String(36), ForeignKey("hotels.id"), nullable=True)
    selected_hotel_name = Column(String(150), nullable=True)
    selected_room_type_id = Column(String(36), nullable=True)
    selected_activities_json = Column(JSON, nullable=True) # [{name, cost, time}]
    transport_mode = Column(String(50), default="Car / Tourist Vehicle") # e.g. Car / Tourist Vehicle, Train, Flight
    distance_km = Column(Float, nullable=True)
    travel_time_hours = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    journey = relationship("CustomJourney", back_populates="destinations")
    hotel = relationship("Hotel")


class DestinationActivity(Base):
    __tablename__ = "destination_activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    destination_key = Column(String(50), nullable=False, index=True) # e.g. 'kochi', 'munnar', 'jaipur', 'delhi', 'goa', etc.
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(50), nullable=False, default="Culture", index=True) # Culture, Heritage, Nature, Adventure, Food, Relaxation, Wildlife, Spiritual, Shopping, Beach
    description = Column(Text, nullable=True)
    duration_hours = Column(Float, default=2.0)
    approx_cost_inr = Column(Float, default=0.0)
    location_name = Column(String(200), nullable=True)
    best_time_of_day = Column(String(50), default="Morning") # Morning, Afternoon, Evening, Sunset, Full Day
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==============================================================================
# TRANSPORT CREDENTIAL & OPERATOR ALLOCATION MODELS
# ==============================================================================

class TransportCredential(Base):
    __tablename__ = "transport_credentials"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    credential_number = Column(String(50), unique=True, nullable=False, index=True) # e.g. TC-2026-KL-0918
    tour_operator_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(30), nullable=False, default="ACTIVE", index=True) # ACTIVE, PENDING, SUSPENDED, DEACTIVATED, EXPIRED
    compliance_status = Column(String(30), default="COMPLIANT") # COMPLIANT, UNDER_REVIEW, NON_COMPLIANT
    issued_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tour_operator = relationship("User", foreign_keys=[tour_operator_id])
    issued_by = relationship("User", foreign_keys=[issued_by_id])
    assigned_vehicles = relationship("TransportCredentialVehicle", back_populates="credential", cascade="all, delete-orphan")
    assigned_drivers = relationship("TransportCredentialDriver", back_populates="credential", cascade="all, delete-orphan")
    change_requests = relationship("TransportChangeRequest", back_populates="credential", cascade="all, delete-orphan")


class TransportCredentialVehicle(Base):
    __tablename__ = "transport_credential_vehicles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    credential_id = Column(String(36), ForeignKey("transport_credentials.id"), nullable=False, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False, index=True)
    status = Column(String(30), nullable=False, default="ACTIVE") # ACTIVE, UNASSIGNED, SUSPENDED
    assigned_at = Column(DateTime, default=datetime.utcnow)
    unassigned_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    credential = relationship("TransportCredential", back_populates="assigned_vehicles")
    vehicle = relationship("Vehicle")


class TransportCredentialDriver(Base):
    __tablename__ = "transport_credential_drivers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    credential_id = Column(String(36), ForeignKey("transport_credentials.id"), nullable=False, index=True)
    driver_id = Column(String(36), ForeignKey("drivers.id"), nullable=False, index=True)
    status = Column(String(30), nullable=False, default="ACTIVE") # ACTIVE, UNASSIGNED, SUSPENDED
    assigned_at = Column(DateTime, default=datetime.utcnow)
    unassigned_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    credential = relationship("TransportCredential", back_populates="assigned_drivers")
    driver = relationship("Driver")


class TransportChangeRequest(Base):
    __tablename__ = "transport_change_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    credential_id = Column(String(36), ForeignKey("transport_credentials.id"), nullable=True, index=True)
    tour_operator_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    request_type = Column(String(50), nullable=False, index=True) # VEHICLE_CHANGE, DRIVER_CHANGE, VEHICLE_ASSIGNMENT, DRIVER_ASSIGNMENT, TRANSPORT_INFO_CHANGE, OTHER
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    requested_changes_json = Column(JSON, nullable=True)
    status = Column(String(30), nullable=False, default="PENDING", index=True) # PENDING, APPROVED, REJECTED, CANCELLED
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    credential = relationship("TransportCredential", back_populates="change_requests")
    tour_operator = relationship("User", foreign_keys=[tour_operator_id])
    reviewer = relationship("User", foreign_keys=[reviewer_id])




