# SafarSetu — Serena Project Memory & Architectural Record

## 1. Executive Summary & Overview
SafarSetu is a smart multimodal Indian travel platform with verified destination dossiers across all 28 states and 8 union territories, 5 & 7-day itinerary engines, 0%-commission homestays, storyteller drivers, and government DigiLocker integration.

---

## 2. Recent Implementation Record

### 2.1 Extended Authentication & Partner Onboarding System
- **Authentication UX (`AuthModal.tsx`)**:
  - MakeMyTrip-inspired low-friction login modal.
  - Top-level switcher: **Traveler | Partner**.
  - Traveler authentication: Name, Mobile Number (`+91` flag badge), 4-Digit OTP verification boxes, DigiLocker verification badge, and Google Sign-In.
  - Partner Type Selection:
    - **Tour Operator**: Guide, Driver, or combined Guide + Driver.
    - **Hotel Partner**: Hotel, Resort, Homestay, Eco-Lodge, or Heritage property owner.
- **Tour Operator Onboarding (`TourOperatorOnboarding.tsx`)**:
  - 3-step progressive onboarding workspace.
  - Collects guide credentials (languages, years of experience, regional routes), driver credentials (driving license, vehicle model, registration, seating capacity), and DigiLocker/payout bank info.
- **Hotel Partner Onboarding (`HotelPartnerOnboarding.tsx`)**:
  - 4-step progressive property registration.
  - Collects property identity, address/city/pincode, room count, base tariff (₹/night - 0% fee), amenities checklist, photos, owner PAN, and GSTIN.
  - On submission, sets status to `UNDER_REVIEW`.
- **Hotel Partner Dashboard (`HotelPartnerDashboard.tsx`)**:
  - Displays property approval status banner (`UNDER_REVIEW` in amber vs `APPROVED` in emerald).
  - Property metrics: Total Rooms, Base Tariff, Received Bookings, DigiLocker status.
  - Tabs for Property Profile, Room Inventory & Tariff Control, Guest Bookings & PNR Requests, and Business Verification.

### 2.2 Navigation Bar Refactor (`Header.tsx`)
- Refactored for standard 100% viewport scale (1280px–1440px).
- Primary links container with micro-badges (`text-[9px] px-1.5 py-0.2 rounded-full`).
- Consolidated **Portals** dropdown menu (`LayoutGrid` 9-dots icon) holding Tour Operator Portal, Hotel Partner Dashboard, Ops Control Desk, and Offline Mode.

### 2.3 Visual Landmark & Image Fixes (`destinations.ts`)
- Replaced non-matching and fallback Unsplash image URLs across all 28 states and 8 union territories with verified, authentic landmark photography (e.g. Charminar for Telangana, Somnath for Gujarat, Hampi for Karnataka, Tawang for Arunachal Pradesh, etc.).

### 2.4 Travel by Interest Theme Explorer (`ThemeDestinationsModal.tsx`)
- Clicking any card in "Travel India your way" now opens a modal suggesting multiple curated places (6–7 states/UTs per theme) with direct "View Dossier" and "Plan Circuit" action buttons.

### 2.5 Dynamic Partner User Identity & Session Synchronization (`PartnerPortal.tsx`, `App.tsx`)
- **User Identity Mismatch Resolution**:
  - Previously, logging in with custom partner credentials (e.g. Name: `"Ram Dayal Singh"`, Phone: `"9343423344"`, Role: `Guide + Driver`) loaded static mock seed partner data (`"Suresh Kurup"`) in the Partner Portal header.
  - Updated `App.tsx` to pass `user={user}` prop down to `<PartnerPortal>` and `<HostPortal>`.
  - Updated `PartnerPortal.tsx` to dynamically sync `user.name`, `user.phone`, `user.operatorSubRole` (mapped to `PartnerRole`), and initials (`"RD"`) into the local `partner` profile state.
  - Displayed authentic logged-in user identity across the Top Status Bar, Partner Reputation & Profile Card, and Partner Chat headers without disrupting underlying assignment dispatch logic.

### 2.6 IndiaPass Hero Window Redesign & Animated Indian Tourist Places (`HeroSection.tsx`)
- **IndiaPass Layout Alignment**:
  - Transformed top hero layout into an elevated hero background frame with an overlapping centered white window card (`Sightsee the smart way with SafarSetu®`).
  - Integrated interactive search widget (Origin, Destination, Dates, Persona, "Find My Pass" CTA) directly inside the floating white card window alongside trust badges (`Instant Mobile Delivery`, `ASI Monument Certified`, `Zero Surcharge Guarantee`).
  - Added horizontal row of 5 feature value cards (`Free cancellation`, `Guaranteed savings`, `Contactless entry`, `Skip-the-line queue`, `1-Year validity`) matching the reference UI.
- **Animated Tourist Places Slideshow**:
  - Added auto-sliding background slideshow rotating through iconic Indian destinations (Taj Mahal Agra, Kerala Backwaters, Varanasi Ghats, Hampi Ruins, Pangong Tso Ladakh, Hawa Mahal Jaipur, Golden Temple Amritsar).
  - Features smooth 4-second cross-fade animations, destination location badges (`📍 Taj Mahal, Agra — Uttar Pradesh`), and interactive slide controls.

### 2.7 Interactive Traveler Feedback & Review Posts Engine (`ReviewsSection.tsx`)
- **Expanded Feedback Collection**:
  - Expanded traveler feedback feed with authentic posts across diverse circuits (Kerala Backwaters, Golden Triangle, Kakatiya Heritage, Meghalaya Root Bridges, Ladakh Pass, Goa Portuguese Heritage).
- **Interactive Post Submission Modal**:
  - Added **"Post Your Experience"** modal allowing travelers to submit new feedback posts with Author Name, Home City, Trip Circuit, Category (`Heritage & Culture`, `Homestays & Hosts`, `Storyteller Drivers`, `Solo & Women Safety`), 5-Star Rating, and Review Narrative.
- **Category Filter & Helpful Like Counter**:
  - Added pill category filter tabs and interactive `👍 Helpful` upvote counter for every feedback post.

### 2.8 Indian Market Rental Vehicles System (`RentalVehicleStep.tsx`, `RentalVehicleModal.tsx`, `VehicleImage.tsx`, `VehicleDetailsModal.tsx`)
- **Optional Booking Section ("🚗 Rent a Vehicle")**:
  - Displays `"🚗 Rent a Vehicle"` banner during initial trip builder with `[Skip for now]` and `[Browse Vehicles]` actions.
  - When browsing, travelers can filter by Indian categories (Hatchback, Sedan, SUV, MUV, Luxury, Tempo Traveller, Scooter EV) and rental mode (`Self-Drive` vs `With Driver`).
- **India-Only Verified Fleet Metadata**:
  - Fleet contains verified Indian market models (e.g. Toyota Innova Crysta, Mahindra Thar 4x4, Maruti Suzuki Swift, Ather 450X EV, Force Traveller 12-Seater, Hyundai Creta).
  - Stores `manufacturer`, `model`, `variant`, `modelYear`, `registrationState`, `supportsSelfDrive`, `supportsWithDriver`, `dailyRate`, `securityDeposit`, `image_url`, `image_source`, `image_verified`, `image_vehicle_match`.
- **CRITICAL IMAGE MATCHING RULE (`VehicleImage.tsx`)**:
  - Images are displayed **ONLY IF** `image_verified === true && image_vehicle_match === true`.
  - Unverified or mismatched images display an elegant `"Vehicle image unavailable"` neutral fallback card. **NO mismatched photos will ever be shown.**
- **Itemized Pricing & Details Modal (`VehicleDetailsModal.tsx`)**:
  - Shows full specs, AC availability, vendor details, Terms & Conditions, and itemized fare breakdown (Vehicle Rental + Driver Charges + 18% GST + Refundable Deposit = Grand Total).
- **Active Trip On-Demand Rentals (`RentalVehicleModal.tsx`)**:
  - Accessible via Traveler Dashboard -> My Trips -> Active Trip -> `+ Rent Vehicle`.
  - Enforces date boundaries: Rental start and end dates must stay within active trip dates.
- **Backend Availability & Partner System (`partnerOperations.ts`, `PartnerPortal.tsx`)**:
  - `/api/rental/check-availability`: Prevents overlapping double-bookings.
  - `/api/rental/image-verification`: Admin & partner verification API.
  - `VEHICLE_RENTAL_PARTNER` role extension in Partner Portal.

---

## 3. Architecture Decisions & Data Models

### 3.1 Role & Session Architecture
```ts
export type UserRoleCategory = 'traveler' | 'tour_operator' | 'hotel_partner' | 'vehicle_rental_partner' | 'admin' | 'host' | 'partner';
export type TourOperatorSubRole = 'GUIDE' | 'DRIVER' | 'GUIDE_DRIVER';
export type PropertyApprovalStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface UserSession {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRoleCategory;
  operatorSubRole?: TourOperatorSubRole;
  partnerId?: string;
  hotelPropertyId?: string;
  onboardingStatus?: 'PENDING' | 'COMPLETED';
  verificationStatus?: PropertyApprovalStatus | 'VERIFIED';
}
```

### 3.2 Hotel Property Model
```ts
export interface HotelPropertyData {
  id: string;
  propertyName: string;
  propertyType: 'hotel' | 'resort' | 'homestay' | 'ecolodge' | 'heritage';
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  address: { line: string; city: string; state: string; pincode: string; landmark?: string; };
  details: { roomCount: number; baseTariffINR: number; description: string; amenities: string[]; photos: string[]; };
  verification: { panNumber: string; gstin?: string; digiLockerVerified: boolean; documentUrls: string[]; };
  approvalStatus: PropertyApprovalStatus;
  rating?: number;
  totalBookings?: number;
  createdAt: string;
}
```

### 3.3 Property Approval Status Lifecycle
- `DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `APPROVED` ➔ `REJECTED`.
- **Crucial Rule**: Only `APPROVED` properties become publicly listed in search & booking engines.

### 3.4 Rental Vehicle Data Model & Image Rules
```ts
export interface RentalVehicleOption {
  id: string;
  destinationKey: string;
  manufacturer: string;
  model: string;
  variant: string;
  modelYear: number;
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
  registrationState: string;
  rentalLocation: string;
  vendorName: string;
  vendorPhone: string;
  vendorRating: number;
  supportsSelfDrive: boolean;
  supportsWithDriver: boolean;
  features: string[];
  termsAndConditions: string[];
  zeroCommissionVerified: boolean;
  image_url: string;
  image_source: string;
  image_verified: boolean;
  image_vehicle_match: boolean;
}
```

---

## 4. REST API Endpoint Registry

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/partner/tour-operator/onboard` | Register/update Tour Operator profile (guide & driver credentials) |
| `POST` | `/api/partner/hotel/onboard` | Submit new hotel property listing for review |
| `GET` | `/api/partner/hotel/:id` | Retrieve hotel property details & approval status |
| `PUT` | `/api/partner/hotel/:id/status` | Admin route to update property status (`UNDER_REVIEW` ➔ `APPROVED`) |
| `POST` | `/api/rental/check-availability` | Check vehicle availability for date range to prevent overlaps |
| `POST` | `/api/rental/image-verification` | Admin/partner route to set image verification status |

---

## 5. Primary Application Views (`App.tsx`)

| View Identifier | Purpose |
| :--- | :--- |
| `'landing'` | Public landing page with multimodal calculator & destination dossiers |
| `'planner'` | 7-step sequential trip planner & pass builder (Includes 3. Rentals) |
| `'partner'` | Tour Operator & Vehicle Rental Partner portal |
| `'tour_operator_onboarding'` | 3-step progressive onboarding for Guides/Drivers |
| `'hotel_onboarding'` | 4-step progressive property onboarding for Hotels/Homestays |
| `'hotel_partner_dashboard'` | Hotel Partner property management & booking dashboard |
| `'admin_ops'` | Centralized fleet control & operations dispatch desk |
| `'operator'` | Homestay host portal |

---

## 6. Critical Rules for Future Development
1. **Preserve Zero-Surcharge Guarantee**: SafarSetu never adds hidden host platform fees.
2. **Preserve Progressive Onboarding**: Never merge Traveler, Tour Operator, and Hotel fields into one giant form.
3. **Preserve Landmark Image Accuracy**: Every state/UT image URL in `destinations.ts` must depict iconic real-world landmarks.
4. **Role Route Protection**: Ensure unauthorized roles cannot access dashboards without valid `UserSession`.
5. **STRICT VEHICLE IMAGE MATCHING RULE**: Never display an image that does not strictly match the verified vehicle manufacturer and model (`image_verified && image_vehicle_match`). Use neutral `"Vehicle image unavailable"` fallback if unverified.
6. **ACTIVE TRIP DATE BOUNDARIES**: Rental duration during active trips must never exceed active trip start and end dates.

---

## 7. Validated MySQL Database Architecture (XAMPP Port 3307)

### 7.1 Database Connection Specification
- **Engine**: MySQL 8.0+ / MariaDB via XAMPP Control Panel
- **Host**: `localhost` | **Port**: `3307` | **User**: `root` | **Password**: `""` | **Database**: `safarsetu_db`

### 7.2 Core Table Groups (30 Normalized Tables)
1. **Identity & RBAC**: `users`, `roles`, `permissions`, `role_permissions`, `user_sessions`
2. **Hotels & Lodging**: `hotels`, `hotel_admins`, `hotel_images`, `room_types`, `rooms`, `room_inventory`, `hotel_bookings`
3. **Transport & Fleet**: `transport_providers`, `vehicle_catalog`, `vehicles`, `vehicle_images`, `drivers`, `vehicle_availability`, `transport_bookings`, `vehicle_rentals`
4. **Travel Circuits**: `trips`, `trip_travelers`, `trip_services`
5. **Cart System**: `carts`, `cart_items`
6. **Unified Bookings & Financials**: `bookings`, `hotel_bookings`, `vehicle_rentals`, `transactions`, `refunds`
7. **Audit & History**: `status_history`, `audit_logs`, `notifications`, `system_settings`

### 7.3 Core Architectural Enforcements
- **Vehicle Catalog vs Inventory**: `vehicle_catalog` master specs (Toyota Innova Crysta, Thar 4x4, Swift, Ather EV, Force Traveller) separated from physical `vehicles` (registration `KL-07-CS-9912`, location, availability).
- **Strict Image Match Rule**: `vehicle_images` returns `image_url` ONLY IF `is_verified == True AND vehicle_match_verified == True`. Otherwise fallback to `"Vehicle image unavailable"`.
- **Hotel Approval Lifecycle**: `DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `APPROVED` ➔ `ACTIVE` ➔ `SUSPENDED`.
- **Dual-Tier History**: `status_history` tracks state machine transitions (`old_status` ➔ `new_status`), while `audit_logs` records compliance and admin security logs (`old_value_json` ➔ `new_value_json`).

---

### 2.9 Complete OTP Verification Flow Fix & Security Implementation
- **Root Causes of Stuck Loading State**:
  1. `executeUserLogin` in `AuthModal.tsx` lacked a `finally` block for `setIsLoading(false)`, causing any network exception or unhandled condition to leave the submit button permanently stuck on `"VERIFYING CODE..."`.
  2. Role determination mapped frontend-selected category instead of backend-authenticated `data.user.role`. For `SUPER_ADMIN`, `session.role` fell through to `'traveler'`, causing `App.tsx` navigation fallback to `'landing'` without opening the admin portal.
  3. No local storage persistence for session token or user profile; refreshing the page lost authentication state.
- **Frontend Changes (`AuthModal.tsx`, `App.tsx`)**:
  - `executeUserLogin` refactored with strict `try...catch...finally` ensuring `setIsLoading(false)` is always executed.
  - Added `localStorage.setItem('safarsetu_token', data.access_token)` and `localStorage.setItem('safarsetu_user', JSON.stringify(session))` upon successful verification.
  - Implemented automatic session restoration in `App.tsx` via `useEffect` on startup, and `localStorage` cleanup on `onLogout`.
  - Configured role-based destination views in `App.tsx`:
    - `CUSTOMER` / traveler ➔ `'landing'`
    - `HOTEL_ADMIN` / hotel_partner ➔ `'hotel_partner_dashboard'`
    - `TRANSPORT_ADMIN` / tour_operator ➔ `'partner'`
    - `SUPER_ADMIN` / admin ➔ `'admin_ops'`
- **Backend Architecture (`backend/app/api/v1/auth.py`, `models.py`, `config.py`)**:
  - Configured environment variables `NON_SUPERADMIN_MASTER_OTP=9568`, `SUPERADMIN_MASTER_OTP=8659`, and `APP_ENV=development`.
  - Added `OTPVerificationSession` model in database to record OTP purpose, status (`PENDING`, `VERIFIED`, `LOCKED`, `EXPIRED`), attempt counts (max 3), and expiration timestamps.
  - Implemented 3-attempt limit tracking server-side; 3rd wrong attempt updates session status to `LOCKED` and returns `OTP_ATTEMPTS_EXCEEDED`.
  - Strictly disabled master OTP in production (`APP_ENV=production`).
- **Validation**:
  - 100% passing automated test suite (`pytest backend/tests/test_otp_security.py` — 13 passed in 5.35s).
  - Production build (`npm run build`) succeeded without TypeScript errors (1717 modules transformed).

---

### 2.10 Database-Backed My Trips & Strict User Data Isolation Fix
- **Problem Statement**:
  - Unauthenticated visitors saw "My Trips 1" in the header and a hardcoded Kerala travel pass ("4582-KER-9012", ₹16,700, SS-CONFIRM-94812) upon clicking "My Trips".
  - `server.ts` intercepted `GET /api/bookings` with a static in-memory `bookingsStore` containing preloaded mock data.
  - `App.tsx` fetched bookings indiscriminately on mount and fell back to demo mock bookings on error.
  - On logout, React state was not purged.
- **Architectural Solution**:
  - **Authoritative Database Source**: All personalized bookings and saved drafts are stored and queried strictly from MySQL / SQLite (`safarsetu.db`).
  - **Server-Side Authorization & Ownership (`backend/app/api/v1/bookings.py`, `trips.py`)**:
    - `GET /api/v1/bookings` & `GET /api/v1/trips` verify `current_user` from JWT bearer token.
    - When unauthenticated, returns empty list `[]` (0 records).
    - When authenticated, filters strictly by `customer_id == current_user.id`.
    - Cancellation (`POST /bookings/{id}/cancel`) validates ownership before status modification.
    - Added `POST /api/v1/trips/save` for saving drafts linked directly to `customer_id`.
  - **Server Proxy Cleanup (`server.ts`)**:
    - Removed mock `bookingsStore` and `tripsStore` routes from Express.
    - Express proxy forwards all `/api/bookings` and `/api/trips` requests directly to FastAPI backend with `Authorization` headers.
  - **Frontend State & UI Isolation (`App.tsx`, `Header.tsx`, `MyTripsModal.tsx`)**:
    - `App.tsx` only triggers bookings/trips queries when `user` is authenticated with a valid JWT token.
    - Removed all fallback demo bookings.
    - On logout (`onLogout`), all in-memory arrays (`bookings`, `savedDrafts`, `activeBookingForPass`) are immediately reset to empty.
    - `savedTripsCount` is calculated dynamically as `user ? (bookings.length + savedDrafts.length) : 0`. For logged-out users, badge displays `0`.
    - Unauthenticated "My Trips" modal displays a dedicated "Please log in to view your trips" screen with a 1-click "Log In / Register" action, exposing zero private travel data.
- **Validation**:
  - Anonymous visitors receive empty lists `[]` on both port 8000 and 3000.
  - User A sees only User A database records. User B sees only User B database records (0 cross-user leakage).
  - TypeScript check (`npm run lint`) passed with 0 errors.




