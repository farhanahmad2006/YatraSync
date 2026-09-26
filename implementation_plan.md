# Implementation Plan: Universal Day-Wise Custom Journey & Activity Itinerary Builder

Extend the existing SafarSetu Custom Journey Builder with a **Universal Day-Wise Itinerary Builder** that enables customers to customize places, attractions, activities, and experiences for every day and destination in their custom journey. The system is completely destination-agnostic, backed by PostgreSQL and FastAPI, and preserves all existing platform features.

---

## User Review Required

> [!IMPORTANT]
> - **Zero Disruption Guarantee**: All existing authentication, RBAC, hotel partner portals, tour operator desks, transport desks, predefined packages, and booking flows will remain intact and functional.
> - **PostgreSQL Single Source of Truth**: All destination activities, customized journeys, destination sequences, and day-wise activity assignments are persisted directly in PostgreSQL (`safarsetu_db` on port 5432).
> - **Universal & Dynamic**: Works for any route across India (e.g. Delhi → Agra → Jaipur, Mumbai → Goa → Gokarna, Bengaluru → Mysore → Coorg, Kolkata → Darjeeling → Gangtok, Kochi → Munnar → Thekkady, etc.) with zero hardcoded route logic.

---

## Proposed Changes

### 1. Database & ORM Layer (PostgreSQL)

#### [MODIFY] [models.py](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/backend/app/db/models.py)
- Introduce the `DestinationActivity` PostgreSQL ORM model:
  - `id` (String PK, UUID)
  - `destination_key` (Indexed String, e.g. `'kochi'`, `'munnar'`, `'jaipur'`, `'delhi'`, `'goa'`, `'varanasi'`, etc.)
  - `name` (String, activity/attraction name)
  - `category` (String, e.g. `'Culture'`, `'Nature'`, `'Adventure'`, `'Heritage'`, `'Food'`, `'Relaxation'`, `'Spiritual'`, `'Wildlife'`, `'Shopping'`)
  - `description` (Text, rich attraction overview)
  - `duration_hours` (Float, e.g. 2.0)
  - `approx_cost_inr` (Float, e.g. 450.0)
  - `location_name` (String)
  - `best_time_of_day` (String, e.g. `'Morning'`, `'Afternoon'`, `'Evening'`, `'Sunset'`, `'Full Day'`)
  - `is_verified` (Boolean, default True)
  - `created_at`, `updated_at`
- Ensure `CustomJourney` and `CustomJourneyDestination` models support structured day-by-day activity allocations in `itinerary_json` and `selected_activities_json`.

#### [MODIFY] [init_db.py](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/backend/init_db.py)
- Seed comprehensive destination activities across Indian destinations (Kerala, Telangana, Rajasthan, Himachal Pradesh, Goa, Karnataka, Tamil Nadu, Delhi NCR, Maharashtra, West Bengal, Uttarakhand, Kashmir, etc.) into PostgreSQL `destination_activities` table so every destination in the application has verified database-driven activities.

---

### 2. FastAPI Backend & Recommendation Engine

#### [MODIFY] [custom_journeys.py](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/backend/app/api/v1/custom_journeys.py)
- Add `/api/v1/custom-journeys/activities` endpoint:
  - Supports query parameters: `destination_key`, `category`, `search`, `limit`.
  - Queries real records from `destination_activities` table in PostgreSQL.
- Enhance `/api/v1/custom-journeys/recommendations`:
  - Fetch verified activities from PostgreSQL per selected destination.
  - Compute category matches based on customer preferences (Nature, Adventure, Culture, etc.).
- Enhance `POST /api/v1/custom-journeys` & `PUT /api/v1/custom-journeys/{journey_id}`:
  - Validate and persist day-wise itinerary structure, activity sequences, timings, and cost snapshots.
  - Enforce server-side customer ownership checks (`customer_id` from authenticated session/JWT).

#### [MODIFY] [recommendation_service.py](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/backend/app/services/recommendation_service.py)
- Integrate dynamic PostgreSQL querying for destination activities with fallback to catalog registry.
- Ensure all 36 Indian states & union territories in SafarSetu have seamless activity lookup.

---

### 3. Frontend React Architecture & UI Components

#### [MODIFY] [types.ts](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/src/types.ts)
- Extend `DestinationActivityItem`, `CustomItineraryDay`, and `CustomJourneyDestination` types to include:
  - `durationHours?: number`
  - `timeOfDay?: string`
  - `locationName?: string`
  - `description?: string`
  - `approxCostInr?: number`

#### [NEW] [DayWiseItineraryBuilder.tsx](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/src/components/planner/DayWiseItineraryBuilder.tsx)
- Reusable, universal day-wise itinerary workspace component:
  - **Dynamic Day Calculation**: Automatically partitions days across destinations according to stay nights (e.g. 1 night in Stop 1 → Day 1; 2 nights in Stop 2 → Days 2 & 3).
  - **Day Card View**:
    - Day indicator (`Day 1 — Kochi (Cochin)`), date, and destination header.
    - List of selected activities for that day with Category badge, duration, approximate cost, and sequence badge.
    - Reorder controls: `Move Up`, `Move Down`.
    - Move between valid days dropdown / action (`Move to Day X`).
    - Remove button with safety check.
  - **Day Schedule Validation**:
    - Calculates total planned activity hours.
    - Highlights realistic daytime budget (e.g., warns if planned activities exceed 8 hours for that day).
  - **"+ Add Place / Activity" Trigger**:
    - Opens the database-driven Activity Selection Modal for that specific day and destination.

#### [NEW] [ActivitySelectionModal.tsx](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/src/components/planner/ActivitySelectionModal.tsx)
- Universal modal for searching, filtering, and adding activities from PostgreSQL:
  - Keyword search bar (real-time filtering).
  - Category pill filters (All, Culture, Heritage, Nature, Adventure, Food, Relaxation, Wildlife, Spiritual, Shopping).
  - "Recommended for You" highlight based on customer's selected trip preferences.
  - Activity details: Name, Duration, Approximate Cost in INR (or Free), Description, Location, Best Time.
  - One-click "+ Add to Day X" button with instant visual feedback.

#### [MODIFY] [CustomizeJourneyPage.tsx](file:///c:/Users/farha/OneDrive/Desktop/gm/safarsetu%204/src/components/planner/CustomizeJourneyPage.tsx)
- Integrate `DayWiseItineraryBuilder` into Step 2 / Journey Route section and the Day-by-Day Itinerary tab.
- Keep destination ordering (`Move Up` / `Move Down`), Add Destination, and Remove Destination in perfect sync with the day-wise itinerary structure:
  - Moving a destination re-sequences the days while keeping each destination's assigned activities intact.
  - Changing nights dynamically adds/removes days without silently losing user-selected activities.
  - Removing a destination cleans up its associated days and warns the user if activities are assigned.
- Update real-time Journey Summary & Cost Estimate (Curated Activities count & total cost).
- Ensure "Save Journey" writes the complete day-by-day itinerary to PostgreSQL.
- Ensure "Review & Book" passes the full day-by-day customized itinerary.

---

## Verification Plan

### Automated & Backend Tests
- Run Python test script against FastAPI endpoints:
  - Verify `GET /api/v1/custom-journeys/activities?destination_key=...` returns PostgreSQL activities.
  - Verify `POST /api/v1/custom-journeys` creates a journey with day-wise itinerary in PostgreSQL.
  - Verify `GET /api/v1/custom-journeys/{id}` retrieves the journey and enforces customer authorization.
  - Verify `PUT /api/v1/custom-journeys/{id}` updates day-wise activities and persists properly.
  - Verify customer isolation (Customer A cannot access Customer B's journey).

### Manual & Interactive Verification
1. **Dynamic Day Generation**:
   - Create route: Starting hub (Hyderabad) → Kochi (1 Night) → Munnar (2 Nights).
   - Confirm Day 1 is assigned to Kochi, Days 2 & 3 to Munnar.
2. **Activity Customization**:
   - Open "+ Add Place / Activity" on Day 1.
   - Search and filter by category (Culture, Nature, Food, etc.).
   - Add activities to Day 1.
   - Reorder activities (Move Up / Move Down).
   - Move an activity from Day 2 to Day 3.
3. **Schedule Validation**:
   - Add activities totalling > 8 hours to a single day and verify clear warning banner is displayed without removing activities.
4. **Destination Reordering & Nights**:
   - Change Munnar nights from 2 to 3; verify Day 4 is added dynamically.
   - Reorder Kochi and Munnar; verify itinerary days re-sequence cleanly with their respective activities.
5. **Universal Destination Test**:
   - Test a completely different Indian route (e.g. Delhi → Agra → Jaipur or Mumbai → Goa).
   - Verify activities are loaded dynamically from PostgreSQL for those destinations.
6. **Persistence & Refresh**:
   - Click "Save Journey".
   - Reload page and verify the custom itinerary is restored from PostgreSQL.
7. **Review & Book Flow**:
   - Click "Review & Book" and confirm the complete day-wise itinerary is displayed in the booking review.
8. **Responsive Layout Check**:
   - Test on Desktop (1440px, 1280px) and Mobile (390px, 430px) to ensure no horizontal scroll or UI clipping.
