# Changes made by @MdFarhanAhmad
from typing import List, Dict, Set
from sqlalchemy.orm import Session
from app.db.models import Role, Permission, RolePermission, UserRole, User

CANONICAL_ROLES = [
    ("SUPER_ADMIN", "Full platform access across all operational, financial, and user domains"),
    ("HOTEL_ADMIN", "Platform-level hotel administration: reviews, approvals, suspensions, and platform hotel monitoring"),
    ("HOTEL_OWNER", "Property-scoped hotel management: owns and manages their specific property, room types, inventory, and bookings"),
    ("TOUR_OPERATOR", "Travel product management: tour packages, day-wise itineraries, guide assignments, and package bookings"),
    ("TRANSPORT_ADMIN", "Transport infrastructure and operations: vehicle fleet, maintenance, driver verification, and trip dispatches"),
    ("CUSTOMER", "Traveler account for browsing, booking, and trip itinerary management")
]

PERMISSION_CATALOG = [
    # HOTEL OWNER (PROPERTY-SCOPED)
    ("HOTEL_CREATE_OWN", "Register Property", "HOTEL_OWNER", "Submit new hotel property for platform onboarding"),
    ("HOTEL_VIEW_OWN", "View Owned Hotel", "HOTEL_OWNER", "Access profile and dashboard of owned hotel property"),
    ("HOTEL_UPDATE_OWN", "Update Owned Hotel", "HOTEL_OWNER", "Modify property description, amenities, and details of owned hotel"),
    ("HOTEL_SUBMIT_FOR_REVIEW", "Submit For Review", "HOTEL_OWNER", "Submit draft/updated property to platform admins for review"),
    ("HOTEL_VIEW_STATUS_OWN", "View Status Own", "HOTEL_OWNER", "View approval and verification status of own property"),
    ("HOTEL_PROFILE_UPDATE_OWN", "Update Profile Own", "HOTEL_OWNER", "Update property address and owner profile"),
    ("HOTEL_VERIFICATION_STATUS_VIEW_OWN", "View Verification Status", "HOTEL_OWNER", "View DigiLocker/GSTIN verification status"),
    ("HOTEL_MANAGE_IMAGES_OWN", "Manage Own Images", "HOTEL_OWNER", "Upload and organize owned hotel gallery"),
    ("HOTEL_MANAGE_AMENITIES_OWN", "Manage Own Amenities", "HOTEL_OWNER", "Configure amenities for owned hotel"),

    # ROOM & INVENTORY (PROPERTY-SCOPED)
    ("HOTEL_ROOM_TYPE_CREATE_OWN", "Create Room Type", "HOTEL_OWNER", "Create room categories for owned property"),
    ("HOTEL_ROOM_TYPE_UPDATE_OWN", "Update Room Type", "HOTEL_OWNER", "Modify room specifications and pricing for owned property"),
    ("HOTEL_ROOM_TYPE_DELETE_OWN", "Delete Room Type", "HOTEL_OWNER", "Deactivate/archive room types for owned property"),
    ("HOTEL_INVENTORY_VIEW_OWN", "View Inventory Own", "HOTEL_OWNER", "View inventory counts and availability for owned property"),
    ("HOTEL_INVENTORY_ADD_OWN", "Add Inventory Own", "HOTEL_OWNER", "Increase active room inventory for owned property"),
    ("HOTEL_INVENTORY_UPDATE_OWN", "Update Inventory Own", "HOTEL_OWNER", "Modify inventory numbers for owned property"),
    ("HOTEL_INVENTORY_REMOVE_OWN", "Remove Inventory Own", "HOTEL_OWNER", "Safely reduce room inventory for owned property"),
    ("HOTEL_AVAILABILITY_VIEW_OWN", "View Availability Own", "HOTEL_OWNER", "Check live room availability for owned property"),
    ("HOTEL_AVAILABILITY_UPDATE_OWN", "Manage Holds Own", "HOTEL_OWNER", "Create maintenance blocks/holds for owned property"),
    ("HOTEL_TARIFF_VIEW_OWN", "View Tariff Own", "HOTEL_OWNER", "View tariffs for owned property"),
    ("HOTEL_TARIFF_UPDATE_OWN", "Update Tariff Own", "HOTEL_OWNER", "Update base and seasonal tariffs for owned property"),
    ("HOTEL_BOOKINGS_VIEW_OWN", "View Bookings Own", "HOTEL_OWNER", "View guest bookings for owned property"),
    ("HOTEL_ANALYTICS_VIEW_OWN", "View Analytics Own", "HOTEL_OWNER", "Access occupancy and revenue metrics for owned property"),
    ("HOTEL_HISTORY_VIEW_OWN", "View History Own", "HOTEL_OWNER", "Review audit logs and history for owned property"),

    # HOTEL ADMIN (PLATFORM-HOTEL-SCOPED)
    ("HOTEL_VIEW_ALL", "View All Hotels", "HOTEL_ADMIN", "Browse all registered hotels across the platform"),
    ("HOTEL_REGISTRATION_REVIEW", "Review Hotel Registrations", "HOTEL_ADMIN", "Review newly submitted hotel registrations"),
    ("HOTEL_APPROVE", "Approve Hotel", "HOTEL_ADMIN", "Approve hotel registration and verify property"),
    ("HOTEL_REJECT", "Reject Hotel", "HOTEL_ADMIN", "Reject hotel registration with reasons"),
    ("HOTEL_REQUEST_CHANGES", "Request Changes", "HOTEL_ADMIN", "Request corrections from hotel owners"),
    ("HOTEL_ACTIVATE", "Activate Hotel", "HOTEL_ADMIN", "Activate approved hotel for public discovery"),
    ("HOTEL_SUSPEND", "Suspend Hotel", "HOTEL_ADMIN", "Temporarily suspend a hotel listing"),
    ("HOTEL_DEACTIVATE", "Deactivate Hotel", "HOTEL_ADMIN", "Deactivate a hotel listing"),
    ("HOTEL_REMOVE", "Remove Hotel", "HOTEL_ADMIN", "Administrative removal of a property"),
    ("HOTEL_VIEW_OWNER", "View Hotel Owners", "HOTEL_ADMIN", "View directory and details of all hotel owners"),
    ("HOTEL_VIEW_INVENTORY", "Monitor All Inventory", "HOTEL_ADMIN", "Monitor room inventory across all connected hotels"),
    ("HOTEL_VIEW_BOOKINGS", "Monitor All Bookings", "HOTEL_ADMIN", "Monitor platform-wide hotel reservations"),
    ("HOTEL_VIEW_ANALYTICS", "Platform Hotel Analytics", "HOTEL_ADMIN", "Access platform-wide hotel occupancy and performance metrics"),
    ("HOTEL_VIEW_HISTORY", "Platform Hotel History", "HOTEL_ADMIN", "Access administrative audit logs across all hotels"),
    ("HOTEL_MANAGE_VERIFICATION", "Manage Hotel Verification", "HOTEL_ADMIN", "Review DigiLocker, PAN, and GSTIN documents"),
    ("HOTEL_ADMINISTRATION", "Hotel Administration Desk", "HOTEL_ADMIN", "Full platform hotel management desk access"),

    # TOUR OPERATOR (TRAVEL PRODUCT & PACKAGES)
    ("TOUR_PACKAGE_CREATE", "Create Tour Package", "TOUR_OPERATOR", "Create new tour packages and experiential products"),
    ("TOUR_PACKAGE_UPDATE_OWN", "Update Tour Package", "TOUR_OPERATOR", "Update package details, photos, and descriptions"),
    ("TOUR_PACKAGE_DELETE_OWN", "Delete/Archive Package", "TOUR_OPERATOR", "Archive or remove own tour packages"),
    ("TOUR_PACKAGE_VIEW_OWN", "View Own Packages", "TOUR_OPERATOR", "Access own package catalog and configurations"),
    ("TOUR_DESTINATION_MANAGE_OWN", "Manage Destinations", "TOUR_OPERATOR", "Configure covered destinations and key sights"),
    ("TOUR_ITINERARY_MANAGE_OWN", "Build Itineraries", "TOUR_OPERATOR", "Build and edit day-wise tour itineraries"),
    ("TOUR_ACTIVITY_MANAGE_OWN", "Manage Activities", "TOUR_OPERATOR", "Add and schedule activities, workshops, and treks"),
    ("TOUR_PRICING_MANAGE_OWN", "Set Package Pricing", "TOUR_OPERATOR", "Set base, seasonal, and discounted package pricing"),
    ("TOUR_CAPACITY_MANAGE_OWN", "Set Package Capacity", "TOUR_OPERATOR", "Configure batch passenger capacities and minimums"),
    ("TOUR_INCLUSIONS_MANAGE_OWN", "Manage Inclusions/Exclusions", "TOUR_OPERATOR", "Define package inclusions, meals, and policies"),
    ("TOUR_GUIDE_ASSIGN_OWN", "Assign Tour Guides", "TOUR_OPERATOR", "Assign storyteller guides to tour schedules"),
    ("TOUR_GUIDE_MANAGE_OWN", "Manage Tour Guides", "TOUR_OPERATOR", "Manage directory and status of tour guides"),
    ("TOUR_AVAILABILITY_MANAGE_OWN", "Manage Tour Availability", "TOUR_OPERATOR", "Open or close departure dates and batches"),
    ("TOUR_SCHEDULE_MANAGE_OWN", "Manage Tour Schedules", "TOUR_OPERATOR", "Configure calendar schedules and departure dates"),
    ("TOUR_BOOKINGS_VIEW_OWN", "View Tour Bookings", "TOUR_OPERATOR", "View customers booked on own tours"),
    ("TOUR_BOOKINGS_MANAGE_OWN", "Manage Tour Bookings", "TOUR_OPERATOR", "Confirm, check-in, or manage passenger rosters"),
    ("TOUR_CANCEL_OWN", "Cancel Tour Departures", "TOUR_OPERATOR", "Cancel or reschedule specific tour batches"),
    ("TOUR_ANALYTICS_VIEW_OWN", "View Tour Analytics", "TOUR_OPERATOR", "Inspect revenue, booking rates, and popularity metrics"),
    ("TOUR_HISTORY_VIEW_OWN", "View Tour History", "TOUR_OPERATOR", "Access historical audit trail of tour operations"),
    ("TRANSPORT_CREDENTIAL_VIEW_OWN", "View Transport Credential", "TOUR_OPERATOR", "View assigned transport credential, vehicles, and drivers"),
    ("TRANSPORT_CHANGE_REQUEST_CREATE", "Request Transport Change", "TOUR_OPERATOR", "Submit vehicle/driver change request to Transport Admin"),
    ("TRANSPORT_CHANGE_REQUEST_VIEW_OWN", "View Change Requests", "TOUR_OPERATOR", "View history and status of submitted change requests"),

    # TRANSPORT ADMIN (TRANSPORT INFRASTRUCTURE & FLEET OPERATIONS)
    ("TRANSPORT_CREDENTIAL_MANAGE", "Manage Transport Credentials", "TRANSPORT_ADMIN", "Issue, update, activate, suspend, and manage credentials for tour operators"),
    ("TRANSPORT_CREDENTIAL_VEHICLE_ASSIGN", "Assign Credential Vehicles", "TRANSPORT_ADMIN", "Assign or unassign fleet vehicles to operator credentials"),
    ("TRANSPORT_CREDENTIAL_DRIVER_ASSIGN", "Assign Credential Drivers", "TRANSPORT_ADMIN", "Assign or unassign drivers to operator credentials"),
    ("TRANSPORT_CHANGE_REQUEST_REVIEW", "Review Change Requests", "TRANSPORT_ADMIN", "Approve or reject tour operator transport change requests"),
    ("VEHICLE_ADD", "Add Vehicles", "TRANSPORT_ADMIN", "Register new vehicles into the multimodal fleet"),
    ("VEHICLE_DEACTIVATE", "Deactivate Vehicles", "TRANSPORT_ADMIN", "Decommission or pause vehicles from active fleet"),
    ("VEHICLE_AVAILABILITY_MANAGE", "Manage Vehicle Availability", "TRANSPORT_ADMIN", "Manage vehicle operational status and holds"),
    ("VEHICLE_TYPE_MANAGE", "Manage Vehicle Types", "TRANSPORT_ADMIN", "Configure categories, seating, and transmission classes"),
    ("VEHICLE_CAPACITY_MANAGE", "Manage Vehicle Capacity", "TRANSPORT_ADMIN", "Set passenger luggage and seat limits"),
    ("VEHICLE_DOCS_MANAGE", "Manage Vehicle Documents", "TRANSPORT_ADMIN", "Maintain fitness, insurance, and PUC documents"),
    ("VEHICLE_MAINTENANCE_MANAGE", "Manage Vehicle Maintenance", "TRANSPORT_ADMIN", "Schedule and log vehicle service and maintenance"),
    ("DRIVER_REGISTER", "Register Drivers", "TRANSPORT_ADMIN", "Onboard new storyteller chauffeurs and drivers"),
    ("DRIVER_PROFILE_MANAGE", "Manage Driver Profiles", "TRANSPORT_ADMIN", "Update driver details, languages, and specialties"),
    ("DRIVER_DOCS_VERIFY", "Verify Driver Documents", "TRANSPORT_ADMIN", "Verify DigiLocker Aadhaar and commercial licenses"),
    ("DRIVER_VEHICLE_ASSIGN", "Assign Driver to Vehicle", "TRANSPORT_ADMIN", "Assign primary drivers to fleet vehicles"),
    ("DRIVER_AVAILABILITY_MANAGE", "Manage Driver Availability", "TRANSPORT_ADMIN", "Update driver duty schedules and off-duty states"),
    ("TRANSPORT_REQUEST_MANAGE", "Manage Transport Requests", "TRANSPORT_ADMIN", "Process rental and tour transfer requests"),
    ("TOUR_VEHICLE_ASSIGN", "Assign Vehicle to Tour", "TRANSPORT_ADMIN", "Dispatch specific vehicles to tour batches"),
    ("TOUR_DRIVER_ASSIGN", "Assign Driver to Tour", "TRANSPORT_ADMIN", "Dispatch specific drivers to tour batches"),
    ("PICKUP_DROP_MANAGE", "Manage Pickup/Drop Locations", "TRANSPORT_ADMIN", "Configure transport hubs and transfer points"),
    ("TRANSPORT_SCHEDULE_MANAGE", "Manage Transport Schedules", "TRANSPORT_ADMIN", "Configure fleet operational rosters"),
    ("TRIP_MONITOR_ACTIVE", "Monitor Active Trips", "TRANSPORT_ADMIN", "Live telemetry, route progress, and driver status"),
    ("TRANSPORT_CANCEL_MANAGE", "Manage Transport Cancellations", "TRANSPORT_ADMIN", "Handle vehicle breakdowns and dispatch replacements"),
    ("TRANSPORT_HISTORY_VIEW", "View Transport History", "TRANSPORT_ADMIN", "Access historical trip and maintenance records"),
    ("TRANSPORT_ANALYTICS_VIEW", "View Transport Analytics", "TRANSPORT_ADMIN", "Access fleet utilization, fuel, and trip metrics"),

    # LEGACY / ALIAS COMPATIBILITY PERMISSIONS
    ("HOTEL_CREATE", "Create Hotel Property", "HOTEL", "Submit new hotel properties for platform onboarding"),
    ("ROOM_TYPE_CREATE_OWN", "Create Room Type Legacy", "ROOM", "Alias for HOTEL_ROOM_TYPE_CREATE_OWN"),
    ("ROOM_TYPE_VIEW_OWN", "View Room Type Legacy", "ROOM", "Alias for HOTEL_INVENTORY_VIEW_OWN"),
    ("ROOM_TYPE_UPDATE_OWN", "Update Room Type Legacy", "ROOM", "Alias for HOTEL_ROOM_TYPE_UPDATE_OWN"),
    ("ROOM_TYPE_ARCHIVE_OWN", "Archive Room Type Legacy", "ROOM", "Alias for HOTEL_ROOM_TYPE_DELETE_OWN"),
    ("ROOM_INVENTORY_VIEW_OWN", "View Room Inventory Legacy", "INVENTORY", "Alias for HOTEL_INVENTORY_VIEW_OWN"),
    ("ROOM_INVENTORY_UPDATE_OWN", "Update Room Inventory Legacy", "INVENTORY", "Alias for HOTEL_INVENTORY_UPDATE_OWN"),
    ("ROOM_AVAILABILITY_VIEW_OWN", "View Availability Legacy", "INVENTORY", "Alias for HOTEL_AVAILABILITY_VIEW_OWN"),
    ("ROOM_AVAILABILITY_UPDATE_OWN", "Manage Holds Legacy", "INVENTORY", "Alias for HOTEL_AVAILABILITY_UPDATE_OWN"),
    ("ROOM_AVAILABILITY_OPERATIONAL_UPDATE", "Operational Availability Update", "INVENTORY", "Operational room status updates"),
    ("ROOM_TARIFF_VIEW_OWN", "View Room Tariffs Legacy", "TARIFF", "Alias for HOTEL_TARIFF_VIEW_OWN"),
    ("ROOM_TARIFF_UPDATE_OWN", "Update Room Tariffs Legacy", "TARIFF", "Alias for HOTEL_TARIFF_UPDATE_OWN"),
    ("HOTEL_BOOKING_VIEW_OWN", "View Hotel Bookings Legacy", "BOOKING", "Alias for HOTEL_BOOKINGS_VIEW_OWN"),
    ("HOTEL_BOOKING_MANAGE_OWN", "Manage Hotel Bookings Legacy", "BOOKING", "Check-in guests for owned property"),
    ("HOTEL_ANALYTICS_VIEW_OWN", "View Hotel Analytics Legacy", "ANALYTICS", "Alias for HOTEL_ANALYTICS_VIEW_OWN"),
    ("HOTEL_HISTORY_VIEW_OWN", "View Hotel Audit History Legacy", "HISTORY", "Alias for HOTEL_HISTORY_VIEW_OWN"),

    # PUBLIC / CUSTOMER
    ("HOTEL_VIEW_PUBLIC", "View Public Hotel Info", "HOTEL", "Browse verified public hotel listings"),
    ("TOUR_PACKAGE_VIEW_PUBLIC", "View Public Tours", "TOUR_OPERATOR", "Browse public experiential tour packages"),
    ("CUSTOMER_BOOKING_CREATE", "Create Customer Booking", "BOOKING", "Book stays, transport, and experiences"),
    ("CUSTOMER_BOOKING_VIEW_OWN", "View Own Customer Bookings", "BOOKING", "View personal booked trips and passes"),
    ("TRIP_MANAGE_OWN", "Manage Own Trips", "TRAVELER", "Create, edit, and plan multimodal itineraries"),

    # SYSTEM
    ("PLATFORM_ADMIN_OPS", "Platform Admin Operations", "SYSTEM", "Full platform governance, approval, and audit access")
]

ROLE_PERMISSIONS_MAPPING: Dict[str, List[str]] = {
    "SUPER_ADMIN": [p[0] for p in PERMISSION_CATALOG],
    "HOTEL_ADMIN": [
        "HOTEL_VIEW_ALL",
        "HOTEL_REGISTRATION_REVIEW",
        "HOTEL_APPROVE",
        "HOTEL_REJECT",
        "HOTEL_REQUEST_CHANGES",
        "HOTEL_ACTIVATE",
        "HOTEL_SUSPEND",
        "HOTEL_DEACTIVATE",
        "HOTEL_REMOVE",
        "HOTEL_VIEW_OWNER",
        "HOTEL_VIEW_INVENTORY",
        "HOTEL_VIEW_BOOKINGS",
        "HOTEL_VIEW_ANALYTICS",
        "HOTEL_VIEW_HISTORY",
        "HOTEL_MANAGE_VERIFICATION",
        "HOTEL_ADMINISTRATION",
        "HOTEL_VIEW_PUBLIC",
        "ROOM_AVAILABILITY_OPERATIONAL_UPDATE"
    ],
    "HOTEL_OWNER": [
        "HOTEL_CREATE_OWN",
        "HOTEL_VIEW_OWN",
        "HOTEL_UPDATE_OWN",
        "HOTEL_SUBMIT_FOR_REVIEW",
        "HOTEL_VIEW_STATUS_OWN",
        "HOTEL_PROFILE_UPDATE_OWN",
        "HOTEL_VERIFICATION_STATUS_VIEW_OWN",
        "HOTEL_MANAGE_IMAGES_OWN",
        "HOTEL_MANAGE_AMENITIES_OWN",
        "HOTEL_ROOM_TYPE_CREATE_OWN",
        "HOTEL_ROOM_TYPE_UPDATE_OWN",
        "HOTEL_ROOM_TYPE_DELETE_OWN",
        "HOTEL_INVENTORY_VIEW_OWN",
        "HOTEL_INVENTORY_ADD_OWN",
        "HOTEL_INVENTORY_UPDATE_OWN",
        "HOTEL_INVENTORY_REMOVE_OWN",
        "HOTEL_AVAILABILITY_VIEW_OWN",
        "HOTEL_AVAILABILITY_UPDATE_OWN",
        "HOTEL_TARIFF_VIEW_OWN",
        "HOTEL_TARIFF_UPDATE_OWN",
        "HOTEL_BOOKINGS_VIEW_OWN",
        "HOTEL_ANALYTICS_VIEW_OWN",
        "HOTEL_HISTORY_VIEW_OWN",
        # Legacy aliases for backward compatibility
        "HOTEL_CREATE",
        "ROOM_TYPE_CREATE_OWN",
        "ROOM_TYPE_VIEW_OWN",
        "ROOM_TYPE_UPDATE_OWN",
        "ROOM_TYPE_ARCHIVE_OWN",
        "ROOM_INVENTORY_VIEW_OWN",
        "ROOM_INVENTORY_UPDATE_OWN",
        "ROOM_AVAILABILITY_VIEW_OWN",
        "ROOM_AVAILABILITY_UPDATE_OWN",
        "ROOM_TARIFF_VIEW_OWN",
        "ROOM_TARIFF_UPDATE_OWN",
        "HOTEL_BOOKING_VIEW_OWN",
        "HOTEL_BOOKING_MANAGE_OWN",
        "HOTEL_VIEW_PUBLIC"
    ],
    "TOUR_OPERATOR": [
        "TOUR_PACKAGE_CREATE",
        "TOUR_PACKAGE_UPDATE_OWN",
        "TOUR_PACKAGE_DELETE_OWN",
        "TOUR_PACKAGE_VIEW_OWN",
        "TOUR_DESTINATION_MANAGE_OWN",
        "TOUR_ITINERARY_MANAGE_OWN",
        "TOUR_ACTIVITY_MANAGE_OWN",
        "TOUR_PRICING_MANAGE_OWN",
        "TOUR_CAPACITY_MANAGE_OWN",
        "TOUR_INCLUSIONS_MANAGE_OWN",
        "TOUR_GUIDE_ASSIGN_OWN",
        "TOUR_GUIDE_MANAGE_OWN",
        "TOUR_AVAILABILITY_MANAGE_OWN",
        "TOUR_SCHEDULE_MANAGE_OWN",
        "TOUR_BOOKINGS_VIEW_OWN",
        "TOUR_BOOKINGS_MANAGE_OWN",
        "TOUR_CANCEL_OWN",
        "TOUR_ANALYTICS_VIEW_OWN",
        "TOUR_HISTORY_VIEW_OWN",
        "TRANSPORT_CREDENTIAL_VIEW_OWN",
        "TRANSPORT_CHANGE_REQUEST_CREATE",
        "TRANSPORT_CHANGE_REQUEST_VIEW_OWN",
        "TOUR_PACKAGE_VIEW_PUBLIC"
    ],
    "TRANSPORT_ADMIN": [
        "TRANSPORT_CREDENTIAL_MANAGE",
        "TRANSPORT_CREDENTIAL_VEHICLE_ASSIGN",
        "TRANSPORT_CREDENTIAL_DRIVER_ASSIGN",
        "TRANSPORT_CHANGE_REQUEST_REVIEW",
        "VEHICLE_ADD",
        "VEHICLE_DEACTIVATE",
        "VEHICLE_AVAILABILITY_MANAGE",
        "VEHICLE_TYPE_MANAGE",
        "VEHICLE_CAPACITY_MANAGE",
        "VEHICLE_DOCS_MANAGE",
        "VEHICLE_MAINTENANCE_MANAGE",
        "DRIVER_REGISTER",
        "DRIVER_PROFILE_MANAGE",
        "DRIVER_DOCS_VERIFY",
        "DRIVER_VEHICLE_ASSIGN",
        "DRIVER_AVAILABILITY_MANAGE",
        "TRANSPORT_REQUEST_MANAGE",
        "TOUR_VEHICLE_ASSIGN",
        "TOUR_DRIVER_ASSIGN",
        "PICKUP_DROP_MANAGE",
        "TRANSPORT_SCHEDULE_MANAGE",
        "TRIP_MONITOR_ACTIVE",
        "TRANSPORT_CANCEL_MANAGE",
        "TRANSPORT_HISTORY_VIEW",
        "TRANSPORT_ANALYTICS_VIEW"
    ],
    "CUSTOMER": [
        "HOTEL_VIEW_PUBLIC",
        "TOUR_PACKAGE_VIEW_PUBLIC",
        "TRIP_MANAGE_OWN",
        "CUSTOMER_BOOKING_CREATE",
        "CUSTOMER_BOOKING_VIEW_OWN"
    ]
}


def seed_rbac_data(db: Session) -> None:
    """Idempotently seed roles, permissions, and role_permissions in the database."""
    # 1. Seed Roles
    role_map: Dict[str, Role] = {}
    for r_name, r_desc in CANONICAL_ROLES:
        role = db.query(Role).filter(Role.name == r_name).first()
        if not role:
            role = Role(name=r_name, description=r_desc)
            db.add(role)
            db.commit()
            db.refresh(role)
        role_map[r_name] = role

    # 2. Seed Permissions
    perm_map: Dict[str, Permission] = {}
    for p_code, p_name, p_cat, p_desc in PERMISSION_CATALOG:
        perm = db.query(Permission).filter(Permission.code == p_code).first()
        if not perm:
            perm = Permission(code=p_code, name=p_name, category=p_cat, description=p_desc)
            db.add(perm)
            db.commit()
            db.refresh(perm)
        perm_map[p_code] = perm

    # 3. Seed Role-Permissions
    for r_name, p_codes in ROLE_PERMISSIONS_MAPPING.items():
        role = role_map.get(r_name)
        if not role:
            continue
        for p_code in p_codes:
            perm = perm_map.get(p_code)
            if not perm:
                continue
            existing = db.query(RolePermission).filter(
                RolePermission.role_id == role.id,
                RolePermission.permission_id == perm.id
            ).first()
            if not existing:
                rp = RolePermission(role_id=role.id, permission_id=perm.id)
                db.add(rp)
    db.commit()

    # 4. Sync User Roles for all existing users based on user.role
    users = db.query(User).all()
    for u in users:
        canonical = u.role.upper() if u.role else "CUSTOMER"
        target_role = role_map.get(canonical)
        if target_role:
            ur = db.query(UserRole).filter(UserRole.user_id == u.id, UserRole.role_id == target_role.id).first()
            if not ur:
                db.add(UserRole(user_id=u.id, role_id=target_role.id))
    db.commit()


def get_user_permissions(db: Session, user: User) -> List[str]:
    """Return the set of permission codes granted to the user."""
    canonical = user.role.upper() if user.role else "CUSTOMER"
    if canonical == "SUPER_ADMIN":
        return [p[0] for p in PERMISSION_CATALOG]

    # Query DB role permissions
    db_perms = (
        db.query(Permission.code)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .join(Role, Role.id == RolePermission.role_id)
        .filter(Role.name == canonical)
        .all()
    )
    if db_perms:
        return [p[0] for p in db_perms]

    # Fallback to static catalog mapping if DB hasn't completed seeding
    return ROLE_PERMISSIONS_MAPPING.get(canonical, ROLE_PERMISSIONS_MAPPING["CUSTOMER"])


def user_has_permission(db: Session, user: User, permission_code: str) -> bool:
    """Check if the user has a specific permission code."""
    perms = get_user_permissions(db, user)
    return permission_code in perms
