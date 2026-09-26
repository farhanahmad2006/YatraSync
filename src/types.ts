// Changes made by @MdFarhanAhmad
/**
 * YatraSync Core Types & Interfaces
 */

export type RegionKey = 'all' | 'south' | 'north' | 'west' | 'east' | 'northeast' | 'central' | 'ut';

export interface WhenToVisitInfo {
  bestSeason: string;
  budgetAnalysis: {
    lowestPriceWindow: string;
    averageSavings: string;
    budgetTip: string;
  };
}

export interface DayItineraryItem {
  day: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface WhereToVisitItem {
  name: string;
  type: string;
  desc: string;
}

export interface CuisineAndCrafts {
  food: string[];
  crafts: string[];
}

export interface StateSafetyInfo {
  touristPoliceHelpline?: string;
  ambulance?: string;
  womanTravelerRating?: string;
  corridors?: string[];
}

export interface StateTourism {
  id: string;
  name: string;
  tagline: string;
  capital: string;
  region: RegionKey;
  image: string;
  badge: string;
  duration: string;
  description: string;
  isUT?: boolean;
  whenToVisit: WhenToVisitInfo & {
    shoulderSeason?: string;
    climateNote?: string;
    budgetAnalysis?: {
      lowestPriceWindow?: string;
      averageSavings?: string;
      budgetTip?: string;
      typicalCost?: string;
      safarSetuCost?: string;
      tip?: string;
    };
  };
  itinerary5Day: DayItineraryItem[];
  itinerary7Day: DayItineraryItem[];
  itinerary5Days?: DayItineraryItem[];
  itinerary7Days?: DayItineraryItem[];
  whereToVisit: WhereToVisitItem[];
  placesToVisit?: { name: string; tag?: string; desc: string; bestTime?: string }[];
  cuisineAndCrafts: CuisineAndCrafts;
  foodAndCrafts?: {
    food: { dish: string; desc: string }[];
    crafts: { item: string; origin: string }[];
  };
  safetyAndFeatures: string[];
  safety?: StateSafetyInfo;
}

export interface TransportOption {
  id: string;
  destinationKey: string;
  mode: 'Flight' | 'Train' | 'Bus' | 'Cab';
  title: string;
  operator: string;
  duration: string;
  departure: string;
  arrival: string;
  price: number;
  reliabilityScore: number;
  reliabilityBadge: string;
  carbon: string;
  recommended: boolean;
}

export interface StayOption {
  id: string;
  destinationKey: string;
  name: string;
  tier: 'homestay' | 'budget' | 'heritage';
  category: string;
  hostName: string;
  location: string;
  rating: string;
  reviews: number;
  price: number;
  image: string;
  photos?: string[];
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  addressLine?: string;
  amenities?: string[];
  roomCount?: number;
  features: string[];
  isAvailable?: boolean;
}

export interface DriverOption {
  id: string;
  destinationKey: string;
  name: string;
  role: string;
  vehicle: string;
  vehicleType: string;
  rating: string;
  reviews: number;
  fixedFullTripPrice: number;
  languages: string[];
  specialties: string;
  storytellerBio: string;
  stories: string[];
  safetyFeatures: string[];
}

export interface LocalTransitOption {
  mode: string;
  fare: string;
  time: string;
  route: string;
  safetyBadge: string;
  tip: string;
}

export interface CuratedSpot {
  title: string;
  tag: string;
  desc: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  desc: string;
  status: string;
  cost?: number;
}

export interface TimelineDayGroup {
  day: string;
  date: string;
  events: TimelineEvent[];
}

export interface DestinationPlannerPackage {
  destinationKey: string;
  name: string;
  tripId: string;
  pnr: string;
  transports: TransportOption[];
  stays: StayOption[];
  drivers: DriverOption[];
  rentalVehicles?: RentalVehicleOption[];
  localTransit: LocalTransitOption[];
  gems: CuratedSpot[];
  eats: CuratedSpot[];
  timeline5Day: TimelineDayGroup[];
  timeline7Day: TimelineDayGroup[];
}

export type RentalVehicleCategory = 
  | 'hatchback' 
  | 'sedan' 
  | 'suv' 
  | 'muv' 
  | 'luxury' 
  | 'tempo_traveller' 
  | 'van' 
  | 'bus' 
  | 'scooter_ev';

export interface RentalVehicleOption {
  id: string;
  destinationKey: string;
  manufacturer: string; // e.g., Toyota, Mahindra, Maruti Suzuki, Ather, Force Motors, Hyundai
  model: string;        // e.g., Innova Crysta, Thar 4x4, Swift, 450X EV, Traveller 12
  variant: string;      // e.g., 2.4 VX 7 STR, LX Hard Top Diesel, VXi, FastCharge Gen3
  modelYear: number;    // e.g., 2024
  name: string;
  category: RentalVehicleCategory;
  categoryLabel: string;
  seatingCapacity: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Electric' | 'Petrol' | 'Diesel' | 'CNG';
  acAvailable: boolean;
  dailyRate: number;
  hourlyRate?: number;
  driverChargePerDay?: number;
  securityDeposit: number;
  registrationState: string; // e.g., GA-03, KL-07, MH-02, DL-01
  rentalLocation: string;
  vendorName: string;
  vendorPhone: string;
  vendorRating: number;
  supportsSelfDrive: boolean;
  supportsWithDriver: boolean;
  features: string[];
  termsAndConditions: string[];
  zeroCommissionVerified: boolean;

  // Strict Image Matching Rule Metadata
  image_url: string;
  image_source: string;
  image_verified: boolean;
  image_vehicle_match: boolean;
}

export interface RentalVehicleBooking {
  vehicle: RentalVehicleOption;
  rentalType: 'self_drive' | 'with_driver';
  rentalDays: number;
  rentalHours?: number;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  dropLocation?: string;
  dailyRate: number;
  totalCost: number;
  securityDeposit: number;
  priceBreakdown: {
    vehicleRental: number;
    driverCharges: number;
    taxesAndGst: number; // 18% GST
    securityDeposit: number;
    grandTotal: number;
  };
  bookingRef: string;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface TripBookingState {
  tripId: string;
  pnr: string;
  origin: string;
  destination: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  calculatedNights: number;
  travelersCount: number;
  durationDays: 5 | 7;
  persona: string;
  transport: TransportOption | null;
  stay: StayOption | null;
  driver: DriverOption | null;
  rentalVehicle?: RentalVehicleBooking | null;
  totalCost: number;
  bookingStatus: 'draft' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod: string;
  createdAt: string;
}

export type CanonicalRole = 'SUPER_ADMIN' | 'HOTEL_OWNER' | 'HOTEL_ADMIN' | 'TOUR_OPERATOR' | 'TRANSPORT_ADMIN' | 'CUSTOMER';

export type UserRoleCategory = 
  | CanonicalRole
  | 'traveler' 
  | 'tour_operator' 
  | 'hotel_partner' 
  | 'hotel_owner' 
  | 'vehicle_rental_partner' 
  | 'admin' 
  | 'host' 
  | 'partner';

export function normalizeUserRole(rawRole?: string | null): CanonicalRole {
  if (!rawRole) return 'CUSTOMER';
  const r = String(rawRole).trim().toUpperCase();
  if (r === 'SUPER_ADMIN' || r === 'ADMIN') return 'SUPER_ADMIN';
  if (r === 'HOTEL_OWNER' || r === 'HOTEL_PARTNER' || r === 'HOST') return 'HOTEL_OWNER';
  if (r === 'HOTEL_ADMIN') return 'HOTEL_ADMIN';
  if (r === 'TOUR_OPERATOR') return 'TOUR_OPERATOR';
  if (r === 'TRANSPORT_ADMIN' || r === 'PARTNER' || r === 'VEHICLE_RENTAL_PARTNER' || r === 'DRIVER') return 'TRANSPORT_ADMIN';
  return 'CUSTOMER';
}

export type TourOperatorSubRole = 'GUIDE' | 'DRIVER' | 'GUIDE_DRIVER';
export type PropertyApprovalStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'REJECTED';

export type PartnerRole = 'DRIVER' | 'LOCAL_STORYTELLER' | 'DRIVER_STORYTELLER' | 'PARTNER_ADMIN' | 'FLEET_MANAGER' | 'VEHICLE_RENTAL_PARTNER';
export type PartnerCapability = 'DRIVER_ONLY' | 'STORYTELLER_ONLY' | 'DRIVER_AND_STORYTELLER';
export type PartnerVerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | 'EXPIRED';
export type PartnerAvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'ON_TRIP' | 'OFF_DUTY';

export interface UserSession {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRoleCategory;
  operatorSubRole?: TourOperatorSubRole;
  partnerId?: string;
  hotelPropertyId?: string;
  partnerRole?: PartnerRole;
  onboardingStatus?: 'PENDING' | 'COMPLETED';
  verificationStatus?: PropertyApprovalStatus | 'VERIFIED';
  permissions?: string[];
}

export const DEFAULT_ROLE_PERMISSIONS: Record<CanonicalRole, string[]> = {
  SUPER_ADMIN: [
    "HOTEL_CREATE_OWN", "HOTEL_VIEW_OWN", "HOTEL_UPDATE_OWN", "HOTEL_SUBMIT_FOR_REVIEW",
    "HOTEL_VIEW_STATUS_OWN", "HOTEL_PROFILE_UPDATE_OWN", "HOTEL_VERIFICATION_STATUS_VIEW_OWN",
    "HOTEL_MANAGE_IMAGES_OWN", "HOTEL_MANAGE_AMENITIES_OWN", "HOTEL_ROOM_TYPE_CREATE_OWN",
    "HOTEL_ROOM_TYPE_UPDATE_OWN", "HOTEL_ROOM_TYPE_DELETE_OWN", "HOTEL_INVENTORY_VIEW_OWN",
    "HOTEL_INVENTORY_ADD_OWN", "HOTEL_INVENTORY_UPDATE_OWN", "HOTEL_INVENTORY_REMOVE_OWN",
    "HOTEL_AVAILABILITY_VIEW_OWN", "HOTEL_AVAILABILITY_UPDATE_OWN", "HOTEL_TARIFF_VIEW_OWN",
    "HOTEL_TARIFF_UPDATE_OWN", "HOTEL_BOOKINGS_VIEW_OWN", "HOTEL_ANALYTICS_VIEW_OWN",
    "HOTEL_HISTORY_VIEW_OWN", "HOTEL_VIEW_ALL", "HOTEL_REGISTRATION_REVIEW", "HOTEL_APPROVE",
    "HOTEL_REJECT", "HOTEL_REQUEST_CHANGES", "HOTEL_ACTIVATE", "HOTEL_SUSPEND", "HOTEL_BLOCK", "HOTEL_ASSIGN_OWNER", "HOTEL_DEACTIVATE",
    "HOTEL_REMOVE", "HOTEL_VIEW_OWNER", "HOTEL_VIEW_INVENTORY", "HOTEL_VIEW_BOOKINGS",
    "HOTEL_VIEW_ANALYTICS", "HOTEL_VIEW_HISTORY", "HOTEL_MANAGE_VERIFICATION", "HOTEL_ADMINISTRATION",
    "HOTEL_VIEW_PUBLIC", "ROOM_AVAILABILITY_OPERATIONAL_UPDATE", "CUSTOMER_BOOKING_CREATE",
    "CUSTOMER_BOOKING_VIEW_OWN", "TRIP_MANAGE_OWN",
    "TOUR_PACKAGE_CREATE", "TOUR_PACKAGE_UPDATE_OWN", "TOUR_PACKAGE_DELETE_OWN", "TOUR_PACKAGE_VIEW_OWN",
    "TOUR_DESTINATION_MANAGE_OWN", "TOUR_ITINERARY_MANAGE_OWN", "TOUR_ACTIVITY_MANAGE_OWN", "TOUR_PRICING_MANAGE_OWN",
    "TOUR_CAPACITY_MANAGE_OWN", "TOUR_INCLUSIONS_MANAGE_OWN", "TOUR_GUIDE_ASSIGN_OWN", "TOUR_GUIDE_MANAGE_OWN",
    "TOUR_AVAILABILITY_MANAGE_OWN", "TOUR_SCHEDULE_MANAGE_OWN", "TOUR_BOOKINGS_VIEW_OWN", "TOUR_BOOKINGS_MANAGE_OWN",
    "TOUR_CANCEL_OWN", "TOUR_ANALYTICS_VIEW_OWN", "TOUR_HISTORY_VIEW_OWN", "TOUR_PACKAGE_VIEW_PUBLIC",
    "VEHICLE_ADD", "VEHICLE_DEACTIVATE", "VEHICLE_AVAILABILITY_MANAGE", "VEHICLE_TYPE_MANAGE", "VEHICLE_CAPACITY_MANAGE",
    "VEHICLE_DOCS_MANAGE", "VEHICLE_MAINTENANCE_MANAGE", "DRIVER_REGISTER", "DRIVER_PROFILE_MANAGE", "DRIVER_DOCS_VERIFY",
    "DRIVER_VEHICLE_ASSIGN", "DRIVER_AVAILABILITY_MANAGE", "TRANSPORT_REQUEST_MANAGE", "TOUR_VEHICLE_ASSIGN", "TOUR_DRIVER_ASSIGN",
    "PICKUP_DROP_MANAGE", "TRANSPORT_SCHEDULE_MANAGE", "TRIP_MONITOR_ACTIVE", "TRANSPORT_CANCEL_MANAGE", "TRANSPORT_HISTORY_VIEW",
    "TRANSPORT_ANALYTICS_VIEW", "TRANSPORT_MANAGE_OWN", "TRANSPORT_BOOKING_VIEW_OWN", "PLATFORM_ADMIN_OPS"
  ],
  HOTEL_OWNER: [
    "HOTEL_CREATE_OWN", "HOTEL_VIEW_OWN", "HOTEL_UPDATE_OWN", "HOTEL_SUBMIT_FOR_REVIEW",
    "HOTEL_VIEW_STATUS_OWN", "HOTEL_PROFILE_UPDATE_OWN", "HOTEL_VERIFICATION_STATUS_VIEW_OWN",
    "HOTEL_MANAGE_IMAGES_OWN", "HOTEL_MANAGE_AMENITIES_OWN", "HOTEL_ROOM_TYPE_CREATE_OWN",
    "HOTEL_ROOM_TYPE_UPDATE_OWN", "HOTEL_ROOM_TYPE_DELETE_OWN", "HOTEL_INVENTORY_VIEW_OWN",
    "HOTEL_INVENTORY_ADD_OWN", "HOTEL_INVENTORY_UPDATE_OWN", "HOTEL_INVENTORY_REMOVE_OWN",
    "HOTEL_AVAILABILITY_VIEW_OWN", "HOTEL_AVAILABILITY_UPDATE_OWN", "HOTEL_TARIFF_VIEW_OWN",
    "HOTEL_TARIFF_UPDATE_OWN", "HOTEL_BOOKINGS_VIEW_OWN", "HOTEL_ANALYTICS_VIEW_OWN",
    "HOTEL_HISTORY_VIEW_OWN", "HOTEL_VIEW_PUBLIC",
    "HOTEL_CREATE", "ROOM_TYPE_CREATE_OWN", "ROOM_TYPE_VIEW_OWN", "ROOM_TYPE_UPDATE_OWN",
    "ROOM_TYPE_ARCHIVE_OWN", "ROOM_INVENTORY_VIEW_OWN", "ROOM_INVENTORY_UPDATE_OWN",
    "ROOM_AVAILABILITY_VIEW_OWN", "ROOM_AVAILABILITY_UPDATE_OWN", "ROOM_TARIFF_VIEW_OWN",
    "ROOM_TARIFF_UPDATE_OWN", "HOTEL_BOOKING_VIEW_OWN"
  ],
  HOTEL_ADMIN: [
    "HOTEL_VIEW_ALL", "HOTEL_REGISTRATION_REVIEW", "HOTEL_APPROVE", "HOTEL_REJECT",
    "HOTEL_REQUEST_CHANGES", "HOTEL_ACTIVATE", "HOTEL_SUSPEND", "HOTEL_BLOCK", "HOTEL_ASSIGN_OWNER", "HOTEL_DEACTIVATE",
    "HOTEL_REMOVE", "HOTEL_VIEW_OWNER", "HOTEL_VIEW_INVENTORY", "HOTEL_VIEW_BOOKINGS",
    "HOTEL_VIEW_ANALYTICS", "HOTEL_VIEW_HISTORY", "HOTEL_MANAGE_VERIFICATION",
    "HOTEL_ADMINISTRATION", "HOTEL_VIEW_PUBLIC", "ROOM_AVAILABILITY_OPERATIONAL_UPDATE"
  ],
  TOUR_OPERATOR: [
    "TOUR_PACKAGE_CREATE", "TOUR_PACKAGE_UPDATE_OWN", "TOUR_PACKAGE_DELETE_OWN", "TOUR_PACKAGE_VIEW_OWN",
    "TOUR_DESTINATION_MANAGE_OWN", "TOUR_ITINERARY_MANAGE_OWN", "TOUR_ACTIVITY_MANAGE_OWN", "TOUR_PRICING_MANAGE_OWN",
    "TOUR_CAPACITY_MANAGE_OWN", "TOUR_INCLUSIONS_MANAGE_OWN", "TOUR_GUIDE_ASSIGN_OWN", "TOUR_GUIDE_MANAGE_OWN",
    "TOUR_AVAILABILITY_MANAGE_OWN", "TOUR_SCHEDULE_MANAGE_OWN", "TOUR_BOOKINGS_VIEW_OWN", "TOUR_BOOKINGS_MANAGE_OWN",
    "TOUR_CANCEL_OWN", "TOUR_ANALYTICS_VIEW_OWN", "TOUR_HISTORY_VIEW_OWN", "TOUR_PACKAGE_VIEW_PUBLIC"
  ],
  TRANSPORT_ADMIN: [
    "VEHICLE_ADD", "VEHICLE_DEACTIVATE", "VEHICLE_AVAILABILITY_MANAGE", "VEHICLE_TYPE_MANAGE", "VEHICLE_CAPACITY_MANAGE",
    "VEHICLE_DOCS_MANAGE", "VEHICLE_MAINTENANCE_MANAGE", "DRIVER_REGISTER", "DRIVER_PROFILE_MANAGE", "DRIVER_DOCS_VERIFY",
    "DRIVER_VEHICLE_ASSIGN", "DRIVER_AVAILABILITY_MANAGE", "TRANSPORT_REQUEST_MANAGE", "TOUR_VEHICLE_ASSIGN", "TOUR_DRIVER_ASSIGN",
    "PICKUP_DROP_MANAGE", "TRANSPORT_SCHEDULE_MANAGE", "TRIP_MONITOR_ACTIVE", "TRANSPORT_CANCEL_MANAGE", "TRANSPORT_HISTORY_VIEW",
    "TRANSPORT_ANALYTICS_VIEW", "TRANSPORT_MANAGE_OWN", "TRANSPORT_BOOKING_VIEW_OWN"
  ],
  CUSTOMER: [
    "HOTEL_VIEW_PUBLIC", "TOUR_PACKAGE_VIEW_PUBLIC", "TRIP_MANAGE_OWN", "CUSTOMER_BOOKING_CREATE", "CUSTOMER_BOOKING_VIEW_OWN"
  ]
};

export function canPermission(user: UserSession | null, permissionCode: string): boolean {
  if (!user) {
    return permissionCode === "HOTEL_VIEW_PUBLIC";
  }
  const role = normalizeUserRole(user.role);
  if (role === "SUPER_ADMIN") return true;

  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions.includes(permissionCode);
  }

  const rolePerms = DEFAULT_ROLE_PERMISSIONS[role];
  return rolePerms ? rolePerms.includes(permissionCode) : false;
}

export interface HotelPropertyData {
  id: string;
  propertyName: string;
  propertyType: 'hotel' | 'resort' | 'homestay' | 'ecolodge' | 'heritage';
  ownerId?: string;
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  address: {
    line: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  details: {
    roomCount: number;
    baseTariffINR: number;
    description: string;
    amenities: string[];
    photos: string[];
  };
  verification: {
    panNumber: string;
    gstin?: string;
    digiLockerVerified: boolean;
    documentUrls: string[];
  };
  approvalStatus: PropertyApprovalStatus;
  rating?: number;
  totalBookings?: number;
  createdAt: string;
}

export interface RoomTypeData {
  id: string;
  hotelId: string;
  name: string;
  description?: string;
  bedConfig: string;
  roomSizeSqft: number;
  inventoryCount: number;
  maxOccupancy: number;
  adultCapacity: number;
  childCapacity: number;
  basePrice: number;
  extraAdultPrice?: number;
  extraChildPrice?: number;
  amenities: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT';
  photos?: string[];
  createdAt?: string;
}

export type AssignmentStatus =
  | 'OFFERED'
  | 'ACCEPTED'
  | 'READY'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'PICKED_UP'
  | 'IN_PROGRESS'
  | 'DROPPED_OFF'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'INCIDENT';

export interface OperationalStop {
  id: string;
  stopNumber: number;
  time: string;
  location: string;
  coordinates: { lat: number; lng: number };
  expectedDeparture: string;
  driverAction: string;
  storytellerAction: string;
  travelerAction: string;
  specialInstruction?: string;
  completed: boolean;
  completedAt?: string;
  storyNotes?: {
    narrative: string;
    culturalHighlights: string[];
    localEatsTip: string;
    etiquette: string;
  };
}

export interface PartnerAssignment {
  id: string;
  tripId: string;
  bookingId: string;
  pnr: string;
  partnerId: string;
  partnerName: string;
  assignedRole: PartnerRole;
  travelerName: string;
  travelerPhone: string; // masked in UI
  guestsCount: number;
  luggageCount: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  pickupGate: string;
  pickupCoordinates: { lat: number; lng: number };
  dropDate: string;
  dropTime: string;
  dropLocation: string;
  dropCoordinates: { lat: number; lng: number };
  destinationName: string;
  destinationKey: string;
  serviceType: 'Airport Pickup & Chauffeur' | 'Storyteller Escort' | 'Full Day Chauffeur & Storyteller';
  status: AssignmentStatus;
  statusTimeline: { status: AssignmentStatus; timestamp: string; note?: string }[];
  estimatedDistanceKm: number;
  estimatedDurationHours: number;
  etaMinutes?: number;
  currentStopIndex: number;
  stops: OperationalStop[];
  travelerPreferences: {
    travelStyle: string;
    interests: string[];
    languagePreference: string;
    specialRequirements: string[];
    dietary: string;
  };
  safarSetuInstructions: {
    version: string;
    updatedAt: string;
    items: string[];
    acknowledgedByPartner: boolean;
  };
  earnings: {
    baseFare: number;
    distanceComponent: number;
    waitingAllowance: number;
    storytellerFee: number;
    bonus: number;
    totalPayable: number;
    payoutStatus: 'PENDING' | 'PROCESSING' | 'PAID';
  };
  delayReport?: {
    reportedAt: string;
    reason: string;
    delayMinutes: number;
    message: string;
    acknowledgedByOps: boolean;
  };
  emergencyReport?: {
    reportedAt: string;
    type: string;
    description: string;
    status: 'ACTIVE' | 'RESOLVED';
  };
  activeDisruptionAlert?: {
    title: string;
    originalStop: string;
    replannedStop: string;
    reason: string;
    acknowledged: boolean;
  };
  preTripChecklistCompleted: boolean;
  postTripChecklistCompleted: boolean;
  chatMessages: PartnerChatMessage[];
}

export interface PartnerChatMessage {
  id: string;
  senderRole: 'traveler' | 'driver' | 'storyteller' | 'support' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  delivered: boolean;
  read: boolean;
}

export interface PartnerDocument {
  id: string;
  type: 'DRIVING_LICENSE' | 'VEHICLE_RC' | 'COMMERCIAL_INSURANCE' | 'AADHAAR_DIGILOCKER' | 'POLICE_VERIFICATION' | 'TOURISM_PERMIT';
  title: string;
  documentNumber: string;
  validUntil: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRING_SOON' | 'EXPIRED' | 'REJECTED';
  issuer: string;
  uploadedAt: string;
}

export interface PartnerProfileData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: PartnerRole;
  capability: PartnerCapability;
  avatarUrl: string;
  rating: number;
  ratingsBreakdown: {
    professionalism: number;
    punctuality: number;
    cleanliness: number;
    localKnowledge: number;
    communication: number;
  };
  totalTrips: number;
  completedTrips: number;
  cancellationRate: string;
  onTimeRate: string;
  verificationStatus: PartnerVerificationStatus;
  languages: string[];
  yearsExperience: number;
  serviceAreas: string[];
  specialties: string[];
  bio: string;
  vehicle?: {
    type: string;
    model: string;
    registrationNumber: string;
    capacity: number;
    isAC: boolean;
    luggageBagsCapacity: number;
    permitType: string;
    insuranceValid: boolean;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankAccount: {
    bankName: string;
    maskedAccountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  availabilityStatus: PartnerAvailabilityStatus;
}

export interface PartnerPayoutRecord {
  id: string;
  payoutDate: string;
  amount: number;
  referenceNumber: string;
  status: 'PAID' | 'PROCESSING' | 'PENDING';
  period: string;
  tripIds: string[];
}

export interface PartnerSupportTicket {
  id: string;
  partnerId: string;
  category: 'Trip Problem' | 'Traveler Problem' | 'Vehicle Problem' | 'Payment Problem' | 'Safety Problem' | 'Technical';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  messages: { sender: string; text: string; time: string }[];
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  assignmentId?: string;
  details: string;
}

export interface BookingRecord {
  id: string;
  destinationKey: string;
  destinationName: string;
  origin: string;
  dates: string;
  nights: number;
  guests: number;
  transport: string;
  stay: string;
  driver: string;
  rentalVehicle?: RentalVehicleBooking | null;
  totalCost: string;
  numericTotal?: number;
  status: 'Confirmed' | 'Cancelled';
  paymentMethod: string;
  pnr: string;
  timestamp: string;
}

export interface SavedDraft {
  id: string;
  origin: string;
  destinationKey: string;
  destinationName: string;
  dates: string;
  nights: number;
  persona: string;
  durationDays: 5 | 7;
  transportId?: string;
  stayId?: string;
  driverId?: string;
  updatedAt: string;
}

export interface SavedTripDraft {
  id: string;
  name: string;
  dates: string;
  destination: string;
  duration: string;
  estimatedCost: string;
  status: 'Draft';
  stay: string;
}

// ==============================================================================
// TOUR OPERATOR DOMAIN DATA INTERFACES
// ==============================================================================

export interface TourActivityData {
  id?: string;
  activityName: string;
  activityType: 'TREK' | 'HERITAGE_WALK' | 'WORKSHOP' | 'BOAT_CRUISE' | 'WILDLIFE_SAFARI' | string;
  startTime: string;
  durationHours: number;
  locationName: string;
  isOptional?: boolean;
  extraCostInr?: number;
}

export interface TourItineraryDayData {
  id?: string;
  dayNumber: number;
  title: string;
  description?: string;
  mealsIncluded: string[];
  overnightStay?: string;
  activities: TourActivityData[];
}

export interface TourGuideData {
  id: string;
  operatorId?: string;
  fullName: string;
  phone: string;
  email?: string;
  languages: string[];
  specialty: string;
  badgeNumber?: string;
  rating: number;
  status: 'ACTIVE' | 'ON_TOUR' | 'ON_LEAVE';
}

export interface TourScheduleData {
  id: string;
  packageId?: string;
  startDate: string;
  endDate: string;
  batchCapacity: number;
  bookedSeats: number;
  status: 'OPEN' | 'SOLD_OUT' | 'COMPLETED' | 'CANCELLED';
  guideId?: string;
  guideName?: string;
}

export interface TourPackageData {
  id: string;
  operatorId?: string;
  title: string;
  destinationKey: string;
  destinationName: string;
  category: 'heritage' | 'eco_adventure' | 'romantic_getaway' | 'wellness_ayurveda' | 'wildlife_safari' | string;
  durationDays: number;
  durationNights: number;
  basePriceINR: number;
  discountedPriceINR?: number;
  maxCapacityPerBatch: number;
  minCapacityPerBatch: number;
  difficultyLevel: 'EASY' | 'MODERATE' | 'CHALLENGING';
  guideRequirement: 'LICENSED_STORYTELLER' | 'NATURALIST' | 'HISTORIAN' | 'NONE';
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy?: string;
  destinations?: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
  rating: number;
  totalBookings: number;
  coverImageUrl?: string;
  gallery: string[];
  itineraryDays: TourItineraryDayData[];
  schedules: TourScheduleData[];
  createdAt?: string;
}

export interface TourBookingItemData {
  id: string;
  bookingId?: string;
  packageId: string;
  packageTitle?: string;
  scheduleId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  travelersCount: number;
  totalPrice: number;
  specialRequests?: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt?: string;
}

export interface TourAnalyticsData {
  activePackages: number;
  totalPackages: number;
  totalGuides: number;
  totalBookings: number;
  totalPassengers: number;
  grossRevenueINR: number;
  avgTourRating: number;
  topPerformingPackage?: string;
}

// ==============================================================================
// TRANSPORT CREDENTIAL & CHANGE REQUEST DATA INTERFACES
// ==============================================================================

export interface CredentialVehicleData {
  id: string;
  credentialId: string;
  vehicleId: string;
  status: 'ACTIVE' | 'REPLACED' | 'REVOKED';
  assignedAt: string;
  unassignedAt?: string | null;
  vehicle?: FleetVehicleData;
}

export interface CredentialDriverData {
  id: string;
  credentialId: string;
  driverId: string;
  status: 'ACTIVE' | 'REPLACED' | 'REVOKED';
  assignedAt: string;
  unassignedAt?: string | null;
  driver?: FleetDriverData;
}

export interface TransportCredentialData {
  id: string;
  credentialNumber: string;
  tourOperatorId: string;
  tourOperatorName?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DEACTIVATED';
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  issuedById?: string;
  issuedByName?: string;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
  assignedVehicles: CredentialVehicleData[];
  assignedDrivers: CredentialDriverData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TransportChangeRequestData {
  id: string;
  credentialId: string;
  tourOperatorId: string;
  tourOperatorName?: string;
  requestType: 'VEHICLE_ADDITION' | 'VEHICLE_REPLACEMENT' | 'DRIVER_ADDITION' | 'DRIVER_REPLACEMENT' | 'CAPACITY_UPGRADE' | 'OTHER';
  requestedChangesJson: Record<string, any>;
  justification: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerId?: string;
  reviewerName?: string;
  reviewerNotes?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==============================================================================
// TRANSPORT ADMIN DOMAIN DATA INTERFACES
// ==============================================================================

export interface FleetVehicleData {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  variant: string;
  modelYear: number;
  category: string;
  seatingCapacity: number;
  transmission: string;
  fuelType: string;
  acAvailable: boolean;
  dailyRate: number;
  hourlyRate?: number;
  registrationState: string;
  registrationNumber?: string;
  rentalLocation: string;
  vendorName: string;
  vendorPhone: string;
  vendorRating: number;
  operationalStatus: 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'DECOMMISSIONED';
  assignedDriverId?: string;
  assignedDriverName?: string;
  fitnessCertificateExpiry?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  pucExpiry?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceKm?: number;
  photos?: string[];
}

export interface FleetDriverData {
  id: string;
  fullName: string;
  phone: string;
  drivingLicense?: string;
  licenseExpiry?: string;
  aadhaarVerified: boolean;
  policeVerificationStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED';
  vehicleModel?: string;
  registrationNumber?: string;
  currentVehicleId?: string;
  rating: number;
  totalTrips: number;
  languages: string[];
  specialties: string[];
  dutyStatus: 'AVAILABLE' | 'ON_DUTY' | 'RESTING' | 'SUSPENDED';
}

export interface TransportTripAssignmentData {
  id: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber?: string;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  pickupLocation: string;
  dropLocation: string;
  startTime?: string;
  tripStatus: 'SCHEDULED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
  liveLat: number;
  liveLng: number;
  tourScheduleId?: string;
}

export interface FleetAnalyticsData {
  totalVehicles: number;
  activeVehicles: number;
  onTripVehicles: number;
  inMaintenanceVehicles: number;
  totalDrivers: number;
  verifiedDrivers: number;
  activeTrips: number;
  fleetHealthScore: number;
  fleetSafetyScore: number;
}

// ==============================================================================
// CUSTOM JOURNEY BUILDER & SUGGESTIONS DOMAIN TYPES
// ==============================================================================

export interface DestinationActivityItem {
  id: string;
  destinationKey?: string;
  destination_key?: string;
  name: string;
  category: string;
  cost: number;
  approxCostInr?: number;
  duration: string;
  durationHours?: number;
  timeOfDay?: string;
  locationName?: string;
  description?: string;
  isOptional?: boolean;
  isVerified?: boolean;
}

export interface DestinationCatalogItem {
  key: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lng: number;
  categories: string[];
  recommended_stay_nights: number;
  description: string;
  image: string;
  popular_activities?: DestinationActivityItem[];
}

export interface DestinationSuggestion {
  key: string;
  name: string;
  state: string;
  region: string;
  categories: string[];
  recommendedStayNights: number;
  description: string;
  image: string;
  score: number;
  distanceKm: number;
  estimatedTravelHours: number;
  recommendedTransportMode: string;
  explanation: string;
  popularActivities: DestinationActivityItem[];
}

export interface CustomJourneyDestination {
  id?: string;
  destination_key: string;
  destination_name: string;
  sequence_order: number;
  arrival_date?: string;
  departure_date?: string;
  stay_nights: number;
  selected_hotel_id?: string;
  selected_hotel_name?: string;
  selected_room_type_id?: string;
  selected_activities?: DestinationActivityItem[];
  transport_mode?: string;
  distance_km?: number;
  travel_time_hours?: number;
  notes?: string;
}

export interface CustomItineraryDay {
  dayNumber: number;
  title: string;
  destinationKey?: string;
  destinationName: string;
  date: string;
  activities: {
    id?: string;
    time: string;
    timeOfDay?: string;
    name: string;
    type?: string;
    category?: string;
    cost: number;
    approxCostInr?: number;
    duration?: string;
    durationHours?: number;
    locationName?: string;
    description?: string;
  }[];
  totalActivityHours?: number;
  overnightStay?: string;
  hotelCost?: number;
}

export interface JourneyCostEstimate {
  hotels: number;
  transport: number;
  activities: number;
  total: number;
}

export interface CustomJourneyRecord {
  id: string;
  customerId?: string | null;
  title: string;
  startLocation: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalNights: number;
  adultsCount: number;
  childrenCount: number;
  budgetINR?: number | null;
  preferences: string[];
  status: 'DRAFT' | 'PLANNING' | 'READY' | 'BOOKING_IN_PROGRESS' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  destinations: {
    id?: string;
    destinationKey: string;
    destinationName: string;
    sequenceOrder: number;
    stayNights: number;
    selectedHotelId?: string | null;
    selectedHotelName?: string | null;
    selectedRoomTypeId?: string | null;
    selectedActivities?: DestinationActivityItem[];
    transportMode?: string;
    distanceKm?: number;
    travelTimeHours?: number;
    notes?: string;
  }[];
  itinerary: CustomItineraryDay[];
  costEstimate: JourneyCostEstimate;
  createdAt?: string;
  updatedAt?: string;
}


