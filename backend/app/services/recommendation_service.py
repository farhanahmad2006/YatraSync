# Changes made by @MdFarhanAhmad
import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.models import Hotel, RoomType, Vehicle, Driver, TourActivity, TourPackage
from app.services.availability_service import calculate_room_type_availability, parse_date_flexible

# ==============================================================================
# CANONICAL DESTINATION CATALOG WITH GEO COORDINATES & TAGS
# ==============================================================================

DESTINATION_CATALOG: Dict[str, Dict[str, Any]] = {
    # Kerala Circuit
    "kochi": {
        "key": "kochi",
        "name": "Kochi (Cochin)",
        "state": "Kerala",
        "region": "South",
        "lat": 9.9312,
        "lng": 76.2673,
        "categories": ["Culture", "Heritage", "Food", "Relaxation", "Beach"],
        "recommended_stay_nights": 2,
        "description": "Historic spice port with colonial Fort Kochi, Chinese fishing nets, and Kathakali cultural centers.",
        "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-koc-1", "name": "Fort Kochi Heritage & Colonial Spice Walk", "category": "Culture", "cost": 450, "duration": "2.5 hrs"},
            {"id": "act-koc-2", "name": "Traditional Kathakali & Kalaripayattu Live Performance", "category": "Culture", "cost": 600, "duration": "2.0 hrs"},
            {"id": "act-koc-3", "name": "Sunset Harbor Cruise & Chinese Fishing Nets", "category": "Relaxation", "cost": 500, "duration": "1.5 hrs"}
        ]
    },
    "munnar": {
        "key": "munnar",
        "name": "Munnar",
        "state": "Kerala",
        "region": "South",
        "lat": 10.0889,
        "lng": 77.0595,
        "categories": ["Nature", "Adventure", "Relaxation", "Wildlife"],
        "recommended_stay_nights": 2,
        "description": "Misty mountain hill station with sprawling organic tea estates, Anamudi peak, and waterfalls.",
        "image": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-mun-1", "name": "Kolukkumalai 4x4 Sunrise Jeep Safari (7,900 ft)", "category": "Adventure", "cost": 1200, "duration": "3.5 hrs"},
            {"id": "act-mun-2", "name": "Lockhart Tea Factory Tour & Sensory Tasting", "category": "Nature", "cost": 350, "duration": "1.5 hrs"},
            {"id": "act-mun-3", "name": "Eravikulam National Park Nilgiri Tahr Walk", "category": "Wildlife", "cost": 400, "duration": "2.5 hrs"}
        ]
    },
    "thekkady": {
        "key": "thekkady",
        "name": "Thekkady (Periyar)",
        "state": "Kerala",
        "region": "South",
        "lat": 9.6031,
        "lng": 77.1615,
        "categories": ["Wildlife", "Nature", "Adventure", "Spiritual"],
        "recommended_stay_nights": 2,
        "description": "Periyar Tiger Reserve sanctuary with bamboo rafting, spice gardens, and wild elephant spotting.",
        "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-thek-1", "name": "Periyar Lake Boat Safari & Wildlife Spotting", "category": "Wildlife", "cost": 650, "duration": "2.0 hrs"},
            {"id": "act-thek-2", "name": "Guided Organic Cardamom & Pepper Plantation Trail", "category": "Nature", "cost": 300, "duration": "1.5 hrs"},
            {"id": "act-thek-3", "name": "Periyar Forest Bamboo Rafting & Trek", "category": "Adventure", "cost": 1800, "duration": "4.0 hrs"}
        ]
    },
    "alleppey": {
        "key": "alleppey",
        "name": "Alleppey (Alappuzha)",
        "state": "Kerala",
        "region": "South",
        "lat": 9.4981,
        "lng": 76.3388,
        "categories": ["Relaxation", "Nature", "Food", "Culture"],
        "recommended_stay_nights": 2,
        "description": "Venice of the East with interconnected serene backwater canals, houseboats, and coir villages.",
        "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-all-1", "name": "Solar-Assisted Houseboat Day Cruise on Vembanad Lake", "category": "Relaxation", "cost": 2500, "duration": "4.0 hrs"},
            {"id": "act-all-2", "name": "Narrow Backwater Village Canoe Paddle & Toddy Trail", "category": "Culture", "cost": 750, "duration": "2.5 hrs"},
            {"id": "act-all-3", "name": "Traditional Kerala Sadhya Lunch & Coir Weaving Demo", "category": "Food", "cost": 500, "duration": "1.5 hrs"}
        ]
    },
    "wayanad": {
        "key": "wayanad",
        "name": "Wayanad",
        "state": "Kerala",
        "region": "South",
        "lat": 11.6854,
        "lng": 76.1320,
        "categories": ["Nature", "Wildlife", "Adventure", "Heritage"],
        "recommended_stay_nights": 2,
        "description": "Forested plateau of waterfalls, prehistoric Edakkal caves, and rainforest eco-resorts.",
        "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-way-1", "name": "Edakkal Prehistoric Rock Engravings Cave Hike", "category": "Heritage", "cost": 350, "duration": "2.5 hrs"},
            {"id": "act-way-2", "name": "Chembra Peak Heart-Shaped Lake Trek", "category": "Adventure", "cost": 850, "duration": "4.0 hrs"},
            {"id": "act-way-3", "name": "Banasura Sagar Earth Dam Speedboat Safari", "category": "Adventure", "cost": 600, "duration": "1.5 hrs"}
        ]
    },
    "varkala": {
        "key": "varkala",
        "name": "Varkala",
        "state": "Kerala",
        "region": "South",
        "lat": 8.7379,
        "lng": 76.7163,
        "categories": ["Beach", "Relaxation", "Spiritual", "Food"],
        "recommended_stay_nights": 2,
        "description": "Dramatic red laterite cliff overlooking the Arabian Sea with natural mineral springs and beach shacks.",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-var-1", "name": "North Cliff Sunset Yoga & Ayurvedic Therapy", "category": "Relaxation", "cost": 600, "duration": "1.5 hrs"},
            {"id": "act-var-2", "name": "Papanasam Natural Mineral Springs Beach Walk", "category": "Beach", "cost": 200, "duration": "1.0 hr"},
            {"id": "act-var-3", "name": "Janardanaswamy 2000-Year-Old Ancient Temple Visit", "category": "Spiritual", "cost": 150, "duration": "1.0 hr"}
        ]
    },

    # Telangana & Andhra Circuit
    "hyderabad": {
        "key": "hyderabad",
        "name": "Hyderabad",
        "state": "Telangana",
        "region": "South",
        "lat": 17.3850,
        "lng": 78.4867,
        "categories": ["Heritage", "Culture", "Food", "Shopping"],
        "recommended_stay_nights": 2,
        "description": "City of Pearls, Charminar citadel, Golconda acoustic forts, and legendary Hyderabadi Dum Biryani.",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-hyd-1", "name": "Golconda Fort Acoustic Whispering Dome Tour", "category": "Heritage", "cost": 400, "duration": "2.5 hrs"},
            {"id": "act-hyd-2", "name": "Old City Charminar, Laad Bazaar & Irani Chai Trail", "category": "Food", "cost": 350, "duration": "2.0 hrs"},
            {"id": "act-hyd-3", "name": "Chowmahalla Palace Royal Nizam Heritage Walk", "category": "Culture", "cost": 300, "duration": "2.0 hrs"}
        ]
    },
    "warangal": {
        "key": "warangal",
        "name": "Warangal & Palampet",
        "state": "Telangana",
        "region": "South",
        "lat": 17.9689,
        "lng": 79.5941,
        "categories": ["Heritage", "Culture", "Spiritual", "Nature"],
        "recommended_stay_nights": 2,
        "description": "UNESCO World Heritage Ramappa Temple of lightweight floating bricks and Kakatiya thousand-pillar temples.",
        "image": "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-war-1", "name": "UNESCO Ramappa 13th-Century Floating Bricks Tour", "category": "Heritage", "cost": 300, "duration": "2.0 hrs"},
            {"id": "act-war-2", "name": "Thousand Pillar Temple & Warangal Stone Gateway", "category": "Culture", "cost": 250, "duration": "1.5 hrs"},
            {"id": "act-war-3", "name": "Laknavaram Lake Suspension Bridge Island Trek", "category": "Nature", "cost": 400, "duration": "2.5 hrs"}
        ]
    },

    # Rajasthan Royal Circuit
    "jaipur": {
        "key": "jaipur",
        "name": "Jaipur (Pink City)",
        "state": "Rajasthan",
        "region": "North",
        "lat": 26.9124,
        "lng": 75.7873,
        "categories": ["Heritage", "Culture", "Shopping", "Food"],
        "recommended_stay_nights": 2,
        "description": "Amber Fort citadel, Hawa Mahal honeycombed facade, and vibrant Johari textile bazaars.",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-jai-1", "name": "Amber Fort Hilltop Palace & Sheesh Mahal Tour", "category": "Heritage", "cost": 550, "duration": "3.0 hrs"},
            {"id": "act-jai-2", "name": "Hawa Mahal & City Palace Royal Museum Tour", "category": "Culture", "cost": 450, "duration": "2.5 hrs"},
            {"id": "act-jai-3", "name": "Johari Bazaar Hand-Block Print Textile Workshop", "category": "Shopping", "cost": 600, "duration": "2.0 hrs"}
        ]
    },
    "udaipur": {
        "key": "udaipur",
        "name": "Udaipur (City of Lakes)",
        "state": "Rajasthan",
        "region": "North",
        "lat": 24.5854,
        "lng": 73.7125,
        "categories": ["Heritage", "Relaxation", "Culture", "Food"],
        "recommended_stay_nights": 2,
        "description": "Lake Pichola boat cruises, grand City Palace overlooking shimmering waters, and royal Mewar hospitality.",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-udr-1", "name": "Lake Pichola Sunset Boat Cruise & Jag Mandir", "category": "Relaxation", "cost": 750, "duration": "1.5 hrs"},
            {"id": "act-udr-2", "name": "Udaipur City Palace & Crystal Gallery Guided Trail", "category": "Heritage", "cost": 500, "duration": "2.5 hrs"},
            {"id": "act-udr-3", "name": "Bagore Ki Haveli Rajasthani Folk Dance Show", "category": "Culture", "cost": 300, "duration": "1.5 hrs"}
        ]
    },
    "jodhpur": {
        "key": "jodhpur",
        "name": "Jodhpur (Blue City)",
        "state": "Rajasthan",
        "region": "North",
        "lat": 26.2389,
        "lng": 73.0243,
        "categories": ["Heritage", "Adventure", "Culture", "Shopping"],
        "recommended_stay_nights": 2,
        "description": "Towering Mehrangarh fort, indigo-washed old town lanes, and Thar desert zip-lining.",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-jod-1", "name": "Mehrangarh Fort Flying Fox Aerial Zipline", "category": "Adventure", "cost": 1500, "duration": "2.0 hrs"},
            {"id": "act-jod-2", "name": "Blue City Old Quarter Heritage Photography Walk", "category": "Culture", "cost": 350, "duration": "2.0 hrs"},
            {"id": "act-jod-3", "name": "Clock Tower Spice & Handcrafted Leather Market", "category": "Shopping", "cost": 250, "duration": "1.5 hrs"}
        ]
    },

    # Himachal & Himalayan Circuit
    "shimla": {
        "key": "shimla",
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "region": "North",
        "lat": 31.1048,
        "lng": 77.1734,
        "categories": ["Nature", "Heritage", "Relaxation", "Adventure"],
        "recommended_stay_nights": 2,
        "description": "Colonial Mall Road, UNESCO toy train mountain railway, and pine forest viewpoints.",
        "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-shm-1", "name": "UNESCO Kalka-Shimla Toy Train Heritage Ride", "category": "Heritage", "cost": 500, "duration": "3.0 hrs"},
            {"id": "act-shm-2", "name": "Jakhoo Hill Ropeway & Sunset Mountain Panorama", "category": "Nature", "cost": 450, "duration": "1.5 hrs"},
            {"id": "act-shm-3", "name": "Kufri Himalayan Nature Park & Snow Valley Walk", "category": "Adventure", "cost": 650, "duration": "3.0 hrs"}
        ]
    },
    "manali": {
        "key": "manali",
        "name": "Manali & Solang",
        "state": "Himachal Pradesh",
        "region": "North",
        "lat": 32.2432,
        "lng": 77.1892,
        "categories": ["Adventure", "Nature", "Relaxation", "Culture"],
        "recommended_stay_nights": 3,
        "description": "Gateway to Atal Tunnel, Solang valley paragliding, and apple orchard chalets.",
        "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-mnl-1", "name": "Solang Valley Tandem Paragliding Flight", "category": "Adventure", "cost": 2200, "duration": "1.5 hrs"},
            {"id": "act-mnl-2", "name": "Atal Tunnel Scenic Drive & Sissu Waterfalls", "category": "Nature", "cost": 1200, "duration": "4.0 hrs"},
            {"id": "act-mnl-3", "name": "Old Manali Cafe Trail & Hadimba Cedar Temple", "category": "Culture", "cost": 300, "duration": "2.0 hrs"}
        ]
    },

    # Goa Beach Circuit
    "north_goa": {
        "key": "north_goa",
        "name": "North Goa (Calangute & Anjuna)",
        "state": "Goa",
        "region": "West",
        "lat": 15.5439,
        "lng": 73.7553,
        "categories": ["Beach", "Adventure", "Food", "Shopping"],
        "recommended_stay_nights": 2,
        "description": "Lively coastline with water sports, beach shacks, night flea markets, and Portuguese forts.",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-ngo-1", "name": "Calangute Jet Ski & Parasailing Water Sports", "category": "Adventure", "cost": 1400, "duration": "2.0 hrs"},
            {"id": "act-ngo-2", "name": "Fort Aguada Lighthouse & Arabian Sea Sunset", "category": "Heritage", "cost": 200, "duration": "1.5 hrs"},
            {"id": "act-ngo-3", "name": "Anjuna Flea Market & Live Acoustic Shack Evening", "category": "Shopping", "cost": 400, "duration": "2.5 hrs"}
        ]
    },
    "south_goa": {
        "key": "south_goa",
        "name": "South Goa (Palolem & Benaulim)",
        "state": "Goa",
        "region": "West",
        "lat": 15.0100,
        "lng": 74.0232,
        "categories": ["Beach", "Relaxation", "Nature", "Food"],
        "recommended_stay_nights": 2,
        "description": "Tranquil crescent beaches, dolphin boat trips, spice farms, and heritage Portuguese mansions.",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
        "popular_activities": [
            {"id": "act-sgo-1", "name": "Palolem Dolphin Spotting Boat Trip & Butterfly Beach", "category": "Nature", "cost": 800, "duration": "2.0 hrs"},
            {"id": "act-sgo-2", "name": "Sahakari Organic Spice Plantation Guided Feast", "category": "Food", "cost": 650, "duration": "2.5 hrs"},
            {"id": "act-sgo-3", "name": "Cabo de Rama Fort Panoramic Ocean Walk", "category": "Relaxation", "cost": 250, "duration": "1.5 hrs"}
        ]
    }
}

STARTING_LOCATIONS = [
    {"name": "Hyderabad", "state": "Telangana", "code": "HYD", "lat": 17.3850, "lng": 78.4867},
    {"name": "Kochi", "state": "Kerala", "code": "COK", "lat": 9.9312, "lng": 76.2673},
    {"name": "Bengaluru", "state": "Karnataka", "code": "BLR", "lat": 12.9716, "lng": 77.5946},
    {"name": "Delhi NCR", "state": "Delhi", "code": "DEL", "lat": 28.6139, "lng": 77.2090},
    {"name": "Mumbai", "state": "Maharashtra", "code": "BOM", "lat": 19.0760, "lng": 72.8777},
    {"name": "Chennai", "state": "Tamil Nadu", "code": "MAA", "lat": 13.0827, "lng": 80.2707},
    {"name": "Kolkata", "state": "West Bengal", "code": "CCU", "lat": 22.5726, "lng": 88.3639},
    {"name": "Jaipur", "state": "Rajasthan", "code": "JAI", "lat": 26.9124, "lng": 75.7873},
    {"name": "Goa (Dabolim / Mopa)", "state": "Goa", "code": "GOI", "lat": 15.3803, "lng": 73.8314}
]

# ==============================================================================
# GEOGRAPHIC DISTANCE & TRAVEL TIME CALCULATION
# ==============================================================================

def calculate_distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Haversine formula calculating distance in kilometers."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    direct_km = R * c
    # Road winding factor: 1.35x for plains, 1.55x for hilly ghat terrain
    is_ghat = (lat1 > 9.0 and lat1 < 12.0 and lng1 > 76.0 and lng1 < 78.0) or (lat1 > 30.0)
    winding_factor = 1.5 if is_ghat else 1.3
    return round(direct_km * winding_factor, 1)

def calculate_travel_time_hours(distance_km: float, is_mountain: bool = False) -> float:
    """Estimates realistic Indian road transit travel time in hours."""
    avg_speed = 35.0 if is_mountain else 55.0
    return round(distance_km / avg_speed, 1)

def get_recommended_transport_mode(distance_km: float) -> str:
    if distance_km > 600:
        return "Flight / Express Train"
    elif distance_km > 250:
        return "Express Train / AC Tourist Coach"
    elif distance_km > 50:
        return "Car / Tourist Chauffeur"
    else:
        return "Local Cab / Auto"

# Pre-computed corridor overrides for ultra-precise regional accuracy
EXACT_CORRIDORS: Dict[str, Dict[str, Any]] = {
    "kochi_munnar": {"distance_km": 125, "travel_time_hours": 3.8, "mode": "Car / Tourist Vehicle"},
    "munnar_kochi": {"distance_km": 125, "travel_time_hours": 3.8, "mode": "Car / Tourist Vehicle"},
    "munnar_thekkady": {"distance_km": 92, "travel_time_hours": 3.0, "mode": "Car / Scenic Ghat Chauffeur"},
    "thekkady_munnar": {"distance_km": 92, "travel_time_hours": 3.0, "mode": "Car / Scenic Ghat Chauffeur"},
    "thekkady_alleppey": {"distance_km": 138, "travel_time_hours": 3.7, "mode": "Car / Tourist Vehicle"},
    "alleppey_thekkady": {"distance_km": 138, "travel_time_hours": 3.7, "mode": "Car / Tourist Vehicle"},
    "alleppey_kochi": {"distance_km": 53, "travel_time_hours": 1.5, "mode": "Car / AC Cab"},
    "kochi_alleppey": {"distance_km": 53, "travel_time_hours": 1.5, "mode": "Car / AC Cab"},
    "kochi_wayanad": {"distance_km": 260, "travel_time_hours": 6.5, "mode": "Train / Private Cab"},
    "alleppey_varkala": {"distance_km": 118, "travel_time_hours": 3.0, "mode": "Express Train / Cab"},
    "hyderabad_warangal": {"distance_km": 145, "travel_time_hours": 3.0, "mode": "Express Train / Highway Cab"},
    "jaipur_jodhpur": {"distance_km": 335, "travel_time_hours": 5.5, "mode": "Express Train / Highway Cab"},
    "jodhpur_udaipur": {"distance_km": 250, "travel_time_hours": 4.5, "mode": "Car / Tourist Chauffeur"},
    "jaipur_udaipur": {"distance_km": 395, "travel_time_hours": 6.5, "mode": "Vande Bharat Express / Flight"},
    "shimla_manali": {"distance_km": 240, "travel_time_hours": 7.0, "mode": "Mountain Chauffeur Cab"},
    "north_goa_south_goa": {"distance_km": 68, "travel_time_hours": 1.8, "mode": "Self-Drive Car / Scooter EV"}
}

def get_segment_transit_info(origin_key: str, dest_key: str) -> Dict[str, Any]:
    corridor_key = f"{origin_key}_{dest_key}"
    if corridor_key in EXACT_CORRIDORS:
        return EXACT_CORRIDORS[corridor_key]

    orig = DESTINATION_CATALOG.get(origin_key)
    dest = DESTINATION_CATALOG.get(dest_key)

    # If origin is a starting hub like Hyderabad
    if not orig:
        matching_start = next((s for s in STARTING_LOCATIONS if s["name"].lower() == origin_key.lower()), None)
        if matching_start and dest:
            dist = calculate_distance_km(matching_start["lat"], matching_start["lng"], dest["lat"], dest["lng"])
            time_h = calculate_travel_time_hours(dist)
            mode = get_recommended_transport_mode(dist)
            return {"distance_km": dist, "travel_time_hours": time_h, "mode": mode}

    if orig and dest:
        is_mtn = "Nature" in orig["categories"] or "Nature" in dest["categories"]
        dist = calculate_distance_km(orig["lat"], orig["lng"], dest["lat"], dest["lng"])
        time_h = calculate_travel_time_hours(dist, is_mountain=is_mtn)
        mode = get_recommended_transport_mode(dist)
        return {"distance_km": dist, "travel_time_hours": time_h, "mode": mode}

    return {"distance_km": 120, "travel_time_hours": 3.0, "mode": "Car / Tourist Vehicle"}


# ==============================================================================
# RULE-BASED RECOMMENDATION ENGINE
# ==============================================================================

def compute_destination_recommendations(
    selected_keys: List[str],
    user_preferences: Optional[List[str]] = None,
    starting_location: Optional[str] = "Hyderabad",
    budget_inr: Optional[float] = None,
    total_duration_days: int = 5,
    db: Optional[Session] = None
) -> List[Dict[str, Any]]:
    """
    Deterministic explainable recommendation scoring:
    recommendation_score = proximity_score + preference_score + activity_score + availability_score
    """
    user_prefs = [p.strip().title() for p in (user_preferences or []) if p.strip()]
    if not user_prefs:
        user_prefs = ["Nature", "Culture", "Relaxation"]

    # Target anchor destination (the last chosen destination or starting location)
    anchor_key = selected_keys[-1] if selected_keys else None
    anchor_data = DESTINATION_CATALOG.get(anchor_key) if anchor_key else None

    # Days already committed
    committed_nights = sum([DESTINATION_CATALOG.get(k, {}).get("recommended_stay_nights", 2) for k in selected_keys])
    remaining_nights = max(1, total_duration_days - 1 - committed_nights)

    scored_candidates = []

    for key, dest in DESTINATION_CATALOG.items():
        if key in selected_keys:
            continue # Already selected

        # 1. Proximity & Travel Time Score (Max 40 points)
        transit_info = {"distance_km": 200, "travel_time_hours": 4.5, "mode": "Tourist Vehicle"}
        proximity_score = 15.0
        reason_distance = ""

        if anchor_data:
            transit_info = get_segment_transit_info(anchor_key, key)
            dist = transit_info["distance_km"]
            time_h = transit_info["travel_time_hours"]

            # Same state / regional proximity bonus
            if dest["state"] == anchor_data["state"]:
                if dist <= 120:
                    proximity_score = 40.0
                    reason_distance = f"~{int(time_h)}h ({int(dist)} km) from {anchor_data['name']}"
                elif dist <= 200:
                    proximity_score = 32.0
                    reason_distance = f"~{int(time_h)}h ({int(dist)} km) from {anchor_data['name']}"
                elif dist <= 350:
                    proximity_score = 22.0
                    reason_distance = f"~{int(time_h)}h from {anchor_data['name']}"
                else:
                    proximity_score = 10.0
                    reason_distance = f"{dest['state']} regional circuit"
            else:
                # Inter-state
                if dist <= 300:
                    proximity_score = 18.0
                    reason_distance = f"~{int(time_h)}h travel from {anchor_data['name']}"
                else:
                    proximity_score = 5.0
                    reason_distance = f"Direct interstate connectivity"
        else:
            # Anchor is starting location
            proximity_score = 25.0
            reason_distance = f"Popular gateway from {starting_location}"

        # 2. User Preferences Alignment (Max 35 points)
        matching_categories = [cat for cat in dest["categories"] if cat in user_prefs]
        preference_score = (len(matching_categories) / max(1, len(user_prefs))) * 35.0
        
        # 3. Available Activities & Stays Bonus (Max 15 points)
        activity_count = len(dest.get("popular_activities", []))
        activity_score = min(15.0, activity_count * 5.0)

        # 4. Itinerary Fit & Remaining Days Compatibility (Max 10 points)
        rec_nights = dest.get("recommended_stay_nights", 2)
        fit_score = 10.0 if rec_nights <= remaining_nights + 1 else 4.0

        total_score = round(proximity_score + preference_score + activity_score + fit_score, 1)

        # Generate Explainable Recommendation Reason
        reasons = []
        if reason_distance:
            reasons.append(reason_distance)
        if matching_categories:
            reasons.append(f"matches your {' & '.join(matching_categories[:2])} preference")
        else:
            reasons.append(f"renowned for {', '.join(dest['categories'][:2])}")

        explanation = f"Recommended because it is {', and '.join(reasons)}."

        scored_candidates.append({
            "key": dest["key"],
            "name": dest["name"],
            "state": dest["state"],
            "region": dest["region"],
            "categories": dest["categories"],
            "recommendedStayNights": rec_nights,
            "description": dest["description"],
            "image": dest["image"],
            "score": total_score,
            "distanceKm": transit_info["distance_km"],
            "estimatedTravelHours": transit_info["travel_time_hours"],
            "recommendedTransportMode": transit_info["mode"],
            "explanation": explanation,
            "popularActivities": dest.get("popular_activities", [])
        })

    # Sort descending by score
    scored_candidates.sort(key=lambda x: x["score"], reverse=True)
    return scored_candidates


# ==============================================================================
# INTEGRATED HOTEL / STAY RECOMMENDATIONS FROM DATABASE
# ==============================================================================

def get_hotel_recommendations_for_destination(
    db: Session,
    destination_key: str,
    check_in_date: Optional[str] = None,
    check_out_date: Optional[str] = None,
    max_budget_per_night: Optional[float] = None
) -> List[Dict[str, Any]]:
    """
    Queries real verified hotels and room types from the database for the given destination.
    Uses availability service to ensure real inventory.
    """
    dest_meta = DESTINATION_CATALOG.get(destination_key.lower())
    dest_name = dest_meta["name"] if dest_meta else destination_key
    dest_state = dest_meta["state"] if dest_meta else ""

    clean_key = destination_key.lower().replace("-", "_")
    base_city = dest_name.split("(")[0].strip().lower()
    known_states = ["kerala", "himachal", "himachal_pradesh", "rajasthan", "telangana", "goa", "andhra_pradesh", "andhrapradesh", "karnataka", "tamil_nadu", "tamilnadu", "maharashtra", "delhi"]
    is_state_query = clean_key in known_states or (dest_state and clean_key == dest_state.lower().replace(" ", "_"))

    hotels_query = db.query(Hotel).filter(Hotel.approval_status.in_(["APPROVED", "ACTIVE"]))
    if max_budget_per_night:
        hotels_query = hotels_query.filter(Hotel.base_tariff_inr <= max_budget_per_night)

    city_hotels = []
    state_hotels = []
    for h in hotels_query.all():
        h_city = (h.city or "").lower()
        h_state = (h.state or "").lower()
        h_name = (h.property_name or "").lower()
        is_city_match = (
            clean_key in h_city or
            h_city in clean_key or
            clean_key in h_name or
            base_city in h_city or
            h_city in base_city or
            base_city in h_name or
            dest_name.lower() in h_city or
            h_city in dest_name.lower()
        )
        if is_city_match:
            city_hotels.append(h)
        elif dest_state and (h_state in dest_state.lower() or dest_state.lower() in h_state):
            state_hotels.append(h)

    if is_state_query:
        matching_hotels = state_hotels or city_hotels
    else:
        matching_hotels = city_hotels

    # Note: If no approved hotels exist for this specific destination, return empty list (no random cross-destination fallback)
    results = []
    for h in matching_hotels:
        # Check available room types
        available_rooms_summary = []
        min_room_price = h.base_tariff_inr

        for rt in h.room_types:
            if rt.status != "ACTIVE":
                continue
            
            avail_count = rt.inventory_count
            if check_in_date and check_out_date:
                c_in = parse_date_flexible(check_in_date)
                c_out = parse_date_flexible(check_out_date)
                avail_info = calculate_room_type_availability(db, rt, c_in, c_out)
                avail_count = avail_info.get("availableRooms", rt.inventory_count)

            if avail_count > 0:
                available_rooms_summary.append({
                    "roomTypeId": rt.id,
                    "name": rt.name,
                    "bedConfig": rt.bed_config,
                    "pricePerNight": rt.base_price,
                    "availableRooms": avail_count,
                    "maxOccupancy": rt.max_occupancy,
                    "amenities": rt.amenities or ["Wi-Fi", "Balcony"]
                })
                if rt.base_price < min_room_price:
                    min_room_price = rt.base_price

        photos = [img.image_url for img in h.images if img.image_url]
        primary_photo = photos[0] if photos else (dest_meta["image"] if dest_meta else "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80")

        results.append({
            "id": h.id,
            "propertyName": h.property_name,
            "propertyType": h.property_type,
            "ownerName": h.owner_name,
            "contactPhone": h.contact_phone,
            "city": h.city,
            "state": h.state,
            "rating": h.rating or 4.85,
            "basePriceINR": min_room_price,
            "roomCount": h.room_count,
            "availableRooms": sum([r["availableRooms"] for r in available_rooms_summary]) if available_rooms_summary else h.room_count,
            "amenities": h.amenities or ["Wi-Fi", "Free Breakfast", "Mountain View", "Parking"],
            "image": primary_photo,
            "photos": photos if photos else [primary_photo],
            "description": h.description or "Government verified regional stay with zero commission markup.",
            "roomTypes": available_rooms_summary
        })

    return results


# ==============================================================================
# INTEGRATED TRANSPORT / VEHICLE RECOMMENDATIONS
# ==============================================================================

def get_transport_recommendations(
    db: Session,
    origin_name: str,
    destination_key: str,
    traveller_count: int = 2
) -> Dict[str, Any]:
    """
    Queries fleet vehicles and drivers for the route.
    """
    dest_meta = DESTINATION_CATALOG.get(destination_key.lower())
    transit_info = get_segment_transit_info(origin_name.lower(), destination_key.lower())

    # Query active rental vehicles matching destination
    vehicles_query = db.query(Vehicle).filter(Vehicle.status == "AVAILABLE")
    dest_vehicles = vehicles_query.filter(Vehicle.destination_key == destination_key.lower()).all()
    if not dest_vehicles:
        dest_vehicles = vehicles_query.limit(4).all()

    vehicle_list = []
    for v in dest_vehicles:
        verified_img = next((img.image_url for img in v.images if img.is_verified), "")
        vehicle_list.append({
            "id": v.id,
            "name": v.name,
            "category": v.category,
            "seatingCapacity": v.seating_capacity,
            "dailyRate": v.daily_rate,
            "transmission": v.transmission,
            "fuelType": v.fuel_type,
            "imageUrl": verified_img or "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
            "supportsSelfDrive": v.supports_self_drive,
            "supportsWithDriver": v.supports_with_driver
        })

    # Query storyteller drivers
    drivers = db.query(Driver).filter(Driver.availability_status == "AVAILABLE").limit(2).all()
    driver_list = [{
        "id": d.id,
        "name": d.full_name,
        "phone": d.phone,
        "rating": d.rating,
        "specialties": d.specialties_json or ["Regional Folklore", "Safe Mountain Driving"],
        "languages": d.languages_json or ["English", "Hindi", "Regional"]
    } for d in drivers]

    return {
        "segment": {
            "origin": origin_name,
            "destination": dest_meta["name"] if dest_meta else destination_key,
            "distanceKm": transit_info["distance_km"],
            "estimatedTravelHours": transit_info["travel_time_hours"],
            "recommendedMode": transit_info["mode"]
        },
        "vehicles": vehicle_list,
        "drivers": driver_list
    }
