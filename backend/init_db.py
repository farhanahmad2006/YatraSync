# Changes made by @MdFarhanAhmad
import sys
import os

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine, Base, SessionLocal
from app.db.models import (
    User, Hotel, HotelImage, RoomType, Vehicle, VehicleImage, Driver,
    Trip, Cart, Booking, Transaction, AuditLog, Notification,
    DestinationActivity,
    TransportCredential, TransportCredentialVehicle, TransportCredentialDriver,
    TransportChangeRequest, TourPackage, TourItineraryDay, TourActivity,
    TourGuide, TourSchedule
)
from sqlalchemy import text
from app.core.security import get_password_hash
from app.services.rbac_service import seed_rbac_data

def init_db():
    print("Creating all tables in PostgreSQL safarsetu_db (port 5432)...")
    Base.metadata.create_all(bind=engine)
    
    # Safe migration for newly added columns on existing tables
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS destinations_json JSON;"))
            conn.commit()
        except Exception:
            try:
                # SQLite fallback
                conn.execute(text("ALTER TABLE tour_packages ADD COLUMN destinations_json TEXT;"))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()

    try:
        # 0. Seed RBAC roles and permissions catalog
        seed_rbac_data(db)
        # 1. Seed Core Users if empty or missing canonical roles
        admin_user = db.query(User).filter(User.email == "admin@safarsetu.in").first()
        if not admin_user:
            admin_user = User(
                id="usr-admin-1",
                name="SafarSetu Super Admin",
                email="admin@safarsetu.in",
                mobile="+91 99999 00000",
                password_hash=get_password_hash("Admin@123456"),
                role="SUPER_ADMIN",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(admin_user)

        hotel_admin_user = db.query(User).filter(User.email == "admin.hotel@safarsetu.in").first()
        if not hotel_admin_user:
            hotel_admin_user = User(
                id="usr-hoteladmin-1",
                name="SafarSetu Hotel Operations Desk",
                email="admin.hotel@safarsetu.in",
                mobile="+91 97777 00000",
                password_hash=get_password_hash("HotelAdmin@123456"),
                role="HOTEL_ADMIN",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(hotel_admin_user)

        hotel_owner_1 = db.query(User).filter(User.email == "mathew@munnarteahills.in").first()
        if not hotel_owner_1:
            hotel_owner_1 = User(
                id="usr-hotel-1",
                name="Mathew Joseph",
                email="mathew@munnarteahills.in",
                mobile="+91 94471 88990",
                password_hash=get_password_hash("Hotel@123456"),
                role="HOTEL_OWNER",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(hotel_owner_1)
        else:
            hotel_owner_1.role = "HOTEL_OWNER"

        hotel_owner_2 = db.query(User).filter(User.email == "george@wayanadwild.in").first()
        if not hotel_owner_2:
            hotel_owner_2 = User(
                id="usr-hotel-2",
                name="George Kurian",
                email="george@wayanadwild.in",
                mobile="+91 98460 11223",
                password_hash=get_password_hash("Wayanad@123456"),
                role="HOTEL_OWNER",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(hotel_owner_2)

        transport_admin = db.query(User).filter(User.email == "ramesh@safarsetu-fleet.in").first()
        if not transport_admin:
            transport_admin = User(
                id="usr-transport-1",
                name="Ramesh Sharma",
                email="ramesh@safarsetu-fleet.in",
                mobile="+91 98765 11111",
                password_hash=get_password_hash("Transport@123456"),
                role="TRANSPORT_ADMIN",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(transport_admin)

        tour_operator = db.query(User).filter(User.email == "anand@keraladiscovery.in").first()
        if not tour_operator:
            tour_operator = User(
                id="usr-touroperator-1",
                name="Anand Varma",
                email="anand@keraladiscovery.in",
                mobile="+91 98470 55555",
                password_hash=get_password_hash("Tour@123456"),
                role="TOUR_OPERATOR",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(tour_operator)
        else:
            tour_operator.role = "TOUR_OPERATOR"

        customer = db.query(User).filter(User.email == "priya@example.com").first()
        if not customer:
            customer = User(
                id="usr-1",
                name="Priya Sundaram",
                email="priya@example.com",
                mobile="+91 98401 23456",
                password_hash=get_password_hash("Customer@123456"),
                role="CUSTOMER",
                status="ACTIVE",
                is_verified=True,
                digilocker_verified=True
            )
            db.add(customer)
        db.commit()

        # 2. Seed Hotel Properties if empty or missing
        h1 = db.query(Hotel).filter(Hotel.id == "prop-101").first()
        if not h1:
            hotel1 = Hotel(
                id="prop-101",
                property_name="Munnar Tea Hills Heritage Resort",
                property_type="resort",
                owner_id="usr-hotel-1",
                owner_name="Mathew Joseph",
                contact_phone="+91 94471 88990",
                contact_email="mathew@munnarteahills.in",
                address_line="Pothamedu Viewpoint Road, Silent Valley",
                city="Munnar",
                state="Kerala",
                pincode="685612",
                landmark="Near Tata Tea Museum",
                room_count=12,
                base_tariff_inr=2800.0,
                description="Luxury organic tea mountain resort with 360-degree plantation views, Ayurvedic spa, and traditional Kerala cuisine.",
                amenities=["Wi-Fi", "Valley View Balcony", "Ayurvedic Spa", "Free Breakfast", "24x7 Power Backup", "Parking"],
                pan_number="ABCDE1234F",
                gstin="32ABCDE1234F1Z5",
                digilocker_verified=True,
                approval_status="APPROVED",
                inventory_confirmed=True,
                rating=4.85,
                total_bookings=42
            )
            db.add(hotel1)
            db.commit()

            img1 = HotelImage(
                hotel_id="prop-101",
                image_url="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
                is_verified=True
            )
            room1 = RoomType(
                id="rt-101-1",
                hotel_id="prop-101",
                name="Heritage Plantation Deluxe Room",
                bed_config="King Bed",
                base_price=2800.0,
                inventory_count=8,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=380,
                amenities=["Wi-Fi", "King Bed", "Private Balcony", "Mountain View"]
            )
            room2 = RoomType(
                id="rt-101-2",
                hotel_id="prop-101",
                name="Cloud Mist Presidential Cottage",
                bed_config="King Bed + Daybed",
                base_price=5400.0,
                inventory_count=4,
                max_occupancy=4,
                adult_capacity=3,
                child_capacity=1,
                room_size_sqft=560,
                amenities=["Wi-Fi", "Private Plunge Pool", "Fireplace", "Mountain View"]
            )
            db.add_all([img1, room1, room2])
            db.commit()

        # Seed Pending Approval Hotel (Owner 2 - George Kurian)
        h2 = db.query(Hotel).filter(Hotel.id == "prop-102").first()
        if not h2:
            hotel2 = Hotel(
                id="prop-102",
                property_name="Wayanad Wild Rainforest Heritage Lodge",
                property_type="ecolodge",
                owner_id="usr-hotel-2",
                owner_name="George Kurian",
                contact_phone="+91 98460 11223",
                contact_email="george@wayanadwild.in",
                address_line="Lakkidi Rainforest Reserve, Old Vythiri Road",
                city="Wayanad",
                state="Kerala",
                pincode="673576",
                landmark="Near Chain Tree Landmark",
                room_count=11,
                base_tariff_inr=3400.0,
                description="Sustainable eco-lodge immersed in tropical evergreen canopies, guided night treks, and certified organic cuisine.",
                amenities=["Wi-Fi", "Canopy View Balcony", "Trekking Trails", "Organic Buffet Breakfast", "Solar Powered"],
                pan_number="GHIJK5678L",
                gstin="32GHIJK5678L1Z9",
                digilocker_verified=True,
                approval_status="SUBMITTED",
                inventory_confirmed=False,
                rating=4.9,
                total_bookings=0
            )
            db.add(hotel2)
            db.commit()

            img2 = HotelImage(
                hotel_id="prop-102",
                image_url="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80",
                is_verified=True
            )
            room3 = RoomType(
                id="rt-102-1",
                hotel_id="prop-102",
                name="Canopy Treeview Eco Chalet",
                bed_config="King Bed",
                base_price=3400.0,
                inventory_count=8,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=420,
                amenities=["Wi-Fi", "Canopy View", "Solar Heated Rain Shower"]
            )
            room4 = RoomType(
                id="rt-102-2",
                hotel_id="prop-102",
                name="Western Ghats Plantation Suite",
                bed_config="King Bed + Twin",
                base_price=5200.0,
                inventory_count=3,
                max_occupancy=4,
                adult_capacity=3,
                child_capacity=1,
                room_size_sqft=580,
                amenities=["Wi-Fi", "Private Deck", "Fireplace", "Plantation View"]
            )
            db.add_all([img2, room3, room4])
            db.commit()

        # Seed Shimla Approved Properties (Himachal Pradesh)
        h_shm1 = db.query(Hotel).filter(Hotel.id == "prop-shm-1").first()
        if not h_shm1:
            hotel_shm1 = Hotel(
                id="prop-shm-1",
                property_name="Shimla Pine Valley Heritage Homestay",
                property_type="homestay",
                owner_id="usr-hotel-1",
                owner_name="Sunil Thakur",
                contact_phone="+91 98160 33445",
                contact_email="stay@shimlalodge.in",
                address_line="Near Mall Road Ridge, Circular Road",
                city="Shimla",
                state="Himachal Pradesh",
                pincode="171001",
                landmark="Near Christ Church & Gaiety Theatre",
                room_count=8,
                base_tariff_inr=2400.0,
                description="Authentic Kath-Kuni wooden chalet with cedarwood aroma, panoramic Himalayan valley vistas, and homecooked Himachali Dham.",
                amenities=["Wi-Fi", "Himalayan Valley View", "Wood Fireplace", "Himachali Breakfast", "24x7 Power Backup"],
                pan_number="HIMAC1234F",
                gstin="02HIMAC1234F1Z1",
                digilocker_verified=True,
                approval_status="APPROVED",
                inventory_confirmed=True,
                rating=4.92,
                total_bookings=58
            )
            db.add(hotel_shm1)
            db.commit()

            img_shm1 = HotelImage(
                hotel_id="prop-shm-1",
                image_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
                is_verified=True
            )
            rt_shm1 = RoomType(
                id="rt-shm-1-1",
                hotel_id="prop-shm-1",
                name="Cedar Wood Valley Suite",
                bed_config="King Bed",
                base_price=2400.0,
                inventory_count=6,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=350,
                amenities=["Wi-Fi", "Valley View", "Fireplace", "Breakfast"]
            )
            db.add_all([img_shm1, rt_shm1])
            db.commit()

        h_shm2 = db.query(Hotel).filter(Hotel.id == "prop-shm-2").first()
        if not h_shm2:
            hotel_shm2 = Hotel(
                id="prop-shm-2",
                property_name="The Himalayan Cedar Eco Chalet",
                property_type="resort",
                owner_id="usr-hotel-1",
                owner_name="Anand Verma",
                contact_phone="+91 98160 55667",
                contact_email="info@cedarchalet.in",
                address_line="Kufri-Chail Forest Road",
                city="Shimla",
                state="Himachal Pradesh",
                pincode="171012",
                landmark="Near Himalayan Nature Park",
                room_count=10,
                base_tariff_inr=3200.0,
                description="Boutique mountain eco-resort nestled amidst deodar pine forests with stargazing decks and organic apple orchard trails.",
                amenities=["Wi-Fi", "Snow Peak View", "Heated Rooms", "Nature Walks", "Organic Dining"],
                pan_number="HIMAC5678G",
                gstin="02HIMAC5678G1Z2",
                digilocker_verified=True,
                approval_status="APPROVED",
                inventory_confirmed=True,
                rating=4.88,
                total_bookings=34
            )
            db.add(hotel_shm2)
            db.commit()

            img_shm2 = HotelImage(
                hotel_id="prop-shm-2",
                image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
                is_verified=True
            )
            rt_shm2 = RoomType(
                id="rt-shm-2-1",
                hotel_id="prop-shm-2",
                name="Pine View Deluxe Chalet",
                bed_config="King Bed",
                base_price=3200.0,
                inventory_count=8,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=400,
                amenities=["Wi-Fi", "Pine Forest View", "Heating", "Balcony"]
            )
            db.add_all([img_shm2, rt_shm2])
            db.commit()

        # Seed Manali Approved Property
        h_mnl1 = db.query(Hotel).filter(Hotel.id == "prop-mnl-1").first()
        if not h_mnl1:
            hotel_mnl1 = Hotel(
                id="prop-mnl-1",
                property_name="Solang Valley Mountain Lodge",
                property_type="ecolodge",
                owner_id="usr-hotel-1",
                owner_name="Ravi Negi",
                contact_phone="+91 98160 88990",
                contact_email="stay@solanglodge.in",
                address_line="Old Manali River Road",
                city="Manali",
                state="Himachal Pradesh",
                pincode="175131",
                landmark="Near Hadimba Temple",
                room_count=12,
                base_tariff_inr=2600.0,
                description="Riverside alpine lodge surrounded by apple trees, woodfire bonfires, and adventure paragliding access.",
                amenities=["Wi-Fi", "River & Peak View", "Bonfire", "Mountain Trekking Guide", "Free Breakfast"],
                pan_number="HIMAC9012H",
                gstin="02HIMAC9012H1Z3",
                digilocker_verified=True,
                approval_status="APPROVED",
                inventory_confirmed=True,
                rating=4.90,
                total_bookings=48
            )
            db.add(hotel_mnl1)
            db.commit()

            img_mnl1 = HotelImage(
                hotel_id="prop-mnl-1",
                image_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
                is_verified=True
            )
            rt_mnl1 = RoomType(
                id="rt-mnl-1-1",
                hotel_id="prop-mnl-1",
                name="Alpine Snow Peak Cottage",
                bed_config="King Bed",
                base_price=2600.0,
                inventory_count=8,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=380,
                amenities=["Wi-Fi", "Balcony", "River View", "Fireplace"]
            )
            db.add_all([img_mnl1, rt_mnl1])
            db.commit()

        # Seed Jaipur Approved Property (Rajasthan)
        h_jai1 = db.query(Hotel).filter(Hotel.id == "prop-jai-1").first()
        if not h_jai1:
            hotel_jai1 = Hotel(
                id="prop-jai-1",
                property_name="Pink City Royal Heritage Haveli",
                property_type="heritage",
                owner_id="usr-hotel-1",
                owner_name="Mahipal Singh",
                contact_phone="+91 94140 11223",
                contact_email="stay@pinkcityhaveli.in",
                address_line="Johari Bazaar Heritage Corridor",
                city="Jaipur",
                state="Rajasthan",
                pincode="302003",
                landmark="Near Hawa Mahal & City Palace",
                room_count=14,
                base_tariff_inr=2900.0,
                description="Centuries-old restored Rajput haveli featuring intricate jharokhas, courtyards, traditional folk music, and Rajasthani Thali.",
                amenities=["Wi-Fi", "Heritage Courtyard", "Rooftop Restaurant", "Cultural Folk Music", "Free Breakfast"],
                pan_number="RAJAS1234J",
                gstin="08RAJAS1234J1Z4",
                digilocker_verified=True,
                approval_status="APPROVED",
                inventory_confirmed=True,
                rating=4.94,
                total_bookings=62
            )
            db.add(hotel_jai1)
            db.commit()

            img_jai1 = HotelImage(
                hotel_id="prop-jai-1",
                image_url="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
                is_verified=True
            )
            rt_jai1 = RoomType(
                id="rt-jai-1-1",
                hotel_id="prop-jai-1",
                name="Royal Jharokha Heritage Room",
                bed_config="King Bed",
                base_price=2900.0,
                inventory_count=10,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=420,
                amenities=["Wi-Fi", "Heritage Decor", "Jharokha Seating", "AC"]
            )
            db.add_all([img_jai1, rt_jai1])
            db.commit()

        # Seed Goa Approved Property
        h_goa1 = db.query(Hotel).filter(Hotel.id == "prop-goa-1").first()
        if not h_goa1:
            hotel_goa1 = Hotel(
                id="prop-goa-1",
                property_name="Anjuna Coastal Heritage Homestay",
                property_type="homestay",
                owner_id="usr-hotel-1",
                owner_name="Francis D'Souza",
                contact_phone="+91 98221 44556",
                contact_email="stay@anjunacoast.in",
                address_line="Fleamarket Road, Anjuna Beach",
                city="North Goa",
                state="Goa",
                pincode="403509",
                landmark="Near Anjuna Beach & Fort Aguada",
                room_count=9,
                base_tariff_inr=2200.0,
                description="Portuguese heritage beachside villa surrounded by coconut groves, walking distance to sunset beach shacks.",
                amenities=["Wi-Fi", "Beach Access", "Garden Courtyard", "Goan Breakfast", "Bicycle Rentals"],
                pan_number="GOAAA1234K",
                gstin="30GOAAA1234K1Z5",
                digilocker_verified=True,
                approval_status="APPROVED",
                inventory_confirmed=True,
                rating=4.89,
                total_bookings=74
            )
            db.add(hotel_goa1)
            db.commit()

            img_goa1 = HotelImage(
                hotel_id="prop-goa-1",
                image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
                is_verified=True
            )
            rt_goa1 = RoomType(
                id="rt-goa-1-1",
                hotel_id="prop-goa-1",
                name="Portuguese Heritage Deluxe Room",
                bed_config="King Bed",
                base_price=2200.0,
                inventory_count=7,
                max_occupancy=3,
                adult_capacity=2,
                child_capacity=1,
                room_size_sqft=360,
                amenities=["Wi-Fi", "Garden Balcony", "Air Conditioning", "Free Breakfast"]
            )
            db.add_all([img_goa1, rt_goa1])
            db.commit()

        # 3. Seed Verified Indian Market Vehicles if empty
        if db.query(Vehicle).count() == 0:
            print("Seeding verified Indian market rental vehicle fleet...")
            v1 = Vehicle(
                id="kerala-rv-innova",
                destination_key="kerala",
                manufacturer="Toyota",
                model="Innova Crysta",
                variant="2.4 VX 7 STR",
                model_year=2024,
                name="Toyota Innova Crysta (2.4 VX Diesel)",
                category="muv",
                seating_capacity=7,
                transmission="Manual",
                fuel_type="Diesel",
                ac_available=True,
                daily_rate=3200.0,
                hourly_rate=350.0,
                driver_charge_per_day=600.0,
                security_deposit=5000.0,
                registration_state="KL-07",
                registration_number="KL-07-CS-9912",
                rental_location="Cochin International Airport (COK) / Fort Kochi",
                vendor_name="Kerala Green Wheels Rentals",
                vendor_phone="+91 98470 11223",
                vendor_rating=4.95,
                supports_self_drive=True,
                supports_with_driver=True,
                features_json=["Dual AC", "Touchscreen Navigation", "Captain Seats", "All-India Tourist Permit", "Zero Hidden Charges"],
                terms_json=["Original Aadhaar & DL verification mandatory", "Speed limited to 80 km/h per Govt norms", "Zero security deduction guarantee"],
                zero_commission_verified=True,
                status="AVAILABLE"
            )

            v2 = Vehicle(
                id="kerala-rv-thar",
                destination_key="kerala",
                manufacturer="Mahindra",
                model="Thar 4x4",
                variant="LX Hard Top Diesel",
                model_year=2024,
                name="Mahindra Thar 4x4 Hardtop",
                category="suv",
                seating_capacity=4,
                transmission="Manual",
                fuel_type="Diesel",
                ac_available=True,
                daily_rate=3500.0,
                driver_charge_per_day=700.0,
                security_deposit=6000.0,
                registration_state="KL-07",
                rental_location="Munnar Town Hub",
                vendor_name="Highland 4x4 Adventures",
                vendor_phone="+91 94471 44556",
                vendor_rating=4.9,
                supports_self_drive=True,
                supports_with_driver=False,
                features_json=["4x4 Low-Range Transfer Case", "All-Terrain Tyres", "Touchscreen Infotainment", "Removable Roof Panel"],
                terms_json=["Off-road permits included", "Security deposit refundable within 24h"],
                zero_commission_verified=True,
                status="AVAILABLE"
            )

            v3 = Vehicle(
                id="kerala-rv-swift",
                destination_key="kerala",
                manufacturer="Maruti Suzuki",
                model="Swift",
                variant="VXi Opt",
                model_year=2024,
                name="Maruti Suzuki Swift VXi",
                category="hatchback",
                seating_capacity=5,
                transmission="Manual",
                fuel_type="Petrol",
                ac_available=True,
                daily_rate=1400.0,
                driver_charge_per_day=500.0,
                security_deposit=3000.0,
                registration_state="KL-07",
                rental_location="Ernakulam Junction (ERS)",
                vendor_name="Kochi City Mobility",
                vendor_phone="+91 98471 22334",
                vendor_rating=4.85,
                supports_self_drive=True,
                supports_with_driver=True,
                features_json=["Air Conditioning", "Bluetooth Audio", "High Fuel Economy (22 km/l)", "Compact Parking Ease"],
                terms_json=["Unlimited Kilometers option available"],
                zero_commission_verified=True,
                status="AVAILABLE"
            )

            v4 = Vehicle(
                id="kerala-rv-ather",
                destination_key="kerala",
                manufacturer="Ather Energy",
                model="450X EV",
                variant="Gen 3 Pro Pack",
                model_year=2024,
                name="Ather 450X EV Scooter",
                category="scooter_ev",
                seating_capacity=2,
                transmission="Automatic",
                fuel_type="Electric",
                ac_available=False,
                daily_rate=650.0,
                driver_charge_per_day=0.0,
                security_deposit=1500.0,
                registration_state="KL-07",
                rental_location="Fort Kochi Beach Road",
                vendor_name="Clean Mobility Kochi",
                vendor_phone="+91 94470 55667",
                vendor_rating=4.92,
                supports_self_drive=True,
                supports_with_driver=False,
                features_json=["TrueRange 105 km", "Fast Charger included", "Google Maps Dashboard", "Reverse Mode"],
                terms_json=["Helmets provided for rider & pillion"],
                zero_commission_verified=True,
                status="AVAILABLE"
            )

            db.add_all([v1, v2, v3, v4])
            db.commit()

            # Seed Vehicle Images enforcing Strict Image Rule
            v1_img = VehicleImage(
                vehicle_id="kerala-rv-innova",
                image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
                is_verified=True,
                vehicle_match_verified=True
            )
            v2_img = VehicleImage(
                vehicle_id="kerala-rv-thar",
                image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80",
                is_verified=True,
                vehicle_match_verified=True
            )
            v3_img = VehicleImage(
                vehicle_id="kerala-rv-swift",
                image_url="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80",
                is_verified=True,
                vehicle_match_verified=True
            )
            v4_img = VehicleImage(
                vehicle_id="kerala-rv-ather",
                image_url="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
                is_verified=True,
                vehicle_match_verified=True
            )
            db.add_all([v1_img, v2_img, v3_img, v4_img])
            db.commit()

        # 4. Seed Certified Storyteller Drivers if empty
        if db.query(Driver).count() == 0:
            print("Seeding storyteller drivers...")
            d1 = Driver(
                id="dr-101",
                full_name="Suresh Kurup",
                phone="+91 98470 11223",
                driving_license="KL-07-2010-009481",
                license_expiry="2032-12-31",
                aadhaar_verified=True,
                police_verification_status="VERIFIED",
                vehicle_model="Tata Nexon EV Max",
                registration_number="KL-07-CS-4412",
                rating=4.96,
                total_trips=218,
                languages_json=["Malayalam", "English", "Hindi", "Tamil"],
                specialties_json=["Western Ghats Biodiversity", "Spices & Plantations History", "Backwaters Folklore"],
                bio="Government-certified tourist chauffeur & Kerala folklore storyteller.",
                availability_status="AVAILABLE",
                duty_status="AVAILABLE"
            )
            db.add(d1)
            db.commit()

        # 5. Seed Tour Operator Domain Data (Packages, Guides, Schedules, Bookings)
        from app.db.models import TourPackage, TourItineraryDay, TourActivity, TourGuide, TourSchedule, TourBookingItem, TransportTripAssignment
        if db.query(TourPackage).count() == 0:
            print("Seeding Tour Packages and Itineraries...")
            pkg1 = TourPackage(
                id="pkg-munnar-5d",
                operator_id="usr-touroperator-1",
                title="5-Day Munnar Tea Trail & Mist Valley Odyssey",
                destination_key="kerala",
                destination_name="Kerala (Munnar & Anamudi)",
                category="eco_adventure",
                duration_days=5,
                duration_nights=4,
                base_price_inr=18500.0,
                discounted_price_inr=16999.0,
                max_capacity_per_batch=15,
                min_capacity_per_batch=2,
                difficulty_level="MODERATE",
                guide_requirement="LICENSED_STORYTELLER",
                inclusions_json=["Colonial Estate Stay", "All Vegetarian & Traditional Sadhya Meals", "Private 4x4 Jeep Safari", "Storyteller Naturalist Guide", "Tea Tasting Workshop"],
                exclusions_json=["Personal Laundry", "Extra Alcoholic Beverages", "Camera Charges at National Parks"],
                cancellation_policy="Full refund up to 7 days before departure. 50% refund between 3 to 7 days.",
                status="PUBLISHED",
                rating=4.94,
                total_bookings=28,
                cover_image_url="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80",
                gallery_json=[
                    "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80"
                ]
            )
            db.add(pkg1)
            db.flush()

            # Add Itinerary Days
            d1_it = TourItineraryDay(
                id="day-munnar-1",
                package_id=pkg1.id,
                day_number=1,
                title="Arrival in Kochi & High-Range Ascent to Munnar",
                description="Scenic drive through Cheeyappara & Valara Waterfalls with fresh coconut break and spice garden introductory walk.",
                meals_included=["Welcome Drink", "Traditional Kerala Dinner"],
                overnight_stay="Munnar Tea Hills Heritage Resort"
            )
            d2_it = TourItineraryDay(
                id="day-munnar-2",
                package_id=pkg1.id,
                day_number=2,
                title="Kolukkumalai Sunrise & High-Altitude Tea Plucking",
                description="4x4 expedition to the world's highest organic tea plantation (7,900 ft). Hands-on tea leaf harvesting with local master pickers.",
                meals_included=["Highland Breakfast", "Plantation Lunch", "Dinner"],
                overnight_stay="Munnar Tea Hills Heritage Resort"
            )
            db.add_all([d1_it, d2_it])
            db.flush()

            # Add activities
            act1 = TourActivity(
                itinerary_day_id=d2_it.id,
                package_id=pkg1.id,
                activity_name="Kolukkumalai 4x4 Sunrise Jeep Trek",
                activity_type="TREK",
                start_time="04:30 AM",
                duration_hours=3.5,
                location_name="Kolukkumalai Tea Estate",
                is_optional=False,
                extra_cost_inr=0.0
            )
            act2 = TourActivity(
                itinerary_day_id=d2_it.id,
                package_id=pkg1.id,
                activity_name="Artisanal Tea Tasting & Factory Masterclass",
                activity_type="WORKSHOP",
                start_time="10:30 AM",
                duration_hours=2.0,
                location_name="Lockhart Tea Factory (Est. 1879)",
                is_optional=False,
                extra_cost_inr=0.0
            )
            db.add_all([act1, act2])

            # Add Guide
            g1 = TourGuide(
                id="guide-101",
                operator_id="usr-touroperator-1",
                full_name="Harish Chandran",
                phone="+91 94470 98123",
                email="harish.guide@keraladiscovery.in",
                languages_json=["English", "Hindi", "Malayalam", "Tamil", "French"],
                specialty="Western Ghats Botanist & Storyteller",
                badge_number="KTDC-GD-2024-918",
                rating=4.98,
                status="ACTIVE"
            )
            db.add(g1)
            db.flush()

            # Add Schedule
            sch1 = TourSchedule(
                id="sch-munnar-101",
                package_id=pkg1.id,
                guide_id=g1.id,
                start_date="2026-10-15",
                end_date="2026-10-19",
                batch_capacity=15,
                booked_seats=4,
                status="OPEN"
            )
            db.add(sch1)
            db.flush()

        # 5. Seed Initial Booking if empty
        if db.query(Booking).count() == 0:
            print("Seeding initial booking & transaction records...")
            b1 = Booking(
                id="SS-CONFIRM-94812",
                pnr="4582-KER-9012",
                customer_id="usr-1",
                destination_key="kerala",
                destination_name="Kerala (Munnar & Alleppey)",
                origin="Hyderabad (HYD)",
                dates_text="Oct 14 - Oct 18, 2026",
                nights=4,
                guests_count=2,
                transport_details_json={"title": "IndiGo 6E-6518 (HYD ➔ COK)"},
                stay_details_json={"name": "Munnar Misty Tea Valley Homestay"},
                driver_details_json={"name": "Arjun Nair (Tata Nexon EV)"},
                total_cost_text="₹16,700",
                numeric_total=16700.0,
                status="Confirmed",
                payment_status="Paid",
                payment_method="UPI",
                traveler_name="Priya Sharma",
                traveler_phone="+91 98765 43210"
            )
            db.add(b1)
            db.commit()

            txn1 = Transaction(
                id="txn-94812",
                transaction_reference="TXN-SETU-984812",
                customer_id="usr-1",
                booking_id="SS-CONFIRM-94812",
                amount=14152.54,
                tax=2547.46,
                total_amount=16700.0,
                currency="INR",
                payment_method="BHIM UPI",
                payment_gateway="Razorpay",
                gateway_transaction_id="pay_Krl9012481",
                status="SUCCESS"
            )
            db.add(txn1)
            db.commit()

            # Add Tour Booking Item
            t_item = TourBookingItem(
                id="tbi-101",
                booking_id="SS-CONFIRM-94812",
                schedule_id=sch1.id,
                package_id=pkg1.id,
                customer_id="usr-1",
                customer_name="Priya Sundaram",
                customer_phone="+91 98401 23456",
                customer_email="priya@example.com",
                travelers_count=2,
                total_price=33998.0,
                special_requests="Vegetarian Jain meal preferences on Day 2.",
                status="CONFIRMED"
            )
            db.add(t_item)

            # Add Transport Assignment
            assign1 = TransportTripAssignment(
                id="tta-101",
                booking_id="SS-CONFIRM-94812",
                tour_schedule_id=sch1.id,
                vehicle_id="kerala-rv-innova",
                driver_id="dr-101",
                pickup_location="Cochin International Airport (COK)",
                drop_location="Munnar Tea Hills Heritage Resort",
                trip_status="SCHEDULED",
                telemetry_live_lat=10.0889,
                telemetry_live_lng=77.0595
            )
            db.add(assign1)
            db.commit()

        # 7. Seed Destination Activities Catalog (Universal Day-Wise Itinerary System)
        if db.query(DestinationActivity).count() == 0:
            print("Seeding verified Destination Activities into PostgreSQL...")
            activities_data = [
                # Kerala — Kochi
                {"id": "act-koc-1", "destination_key": "kochi", "name": "Fort Kochi Heritage & Colonial Spice Walk", "category": "Culture", "cost": 450.0, "duration": 2.5, "location": "Fort Kochi", "time": "Morning", "desc": "Historic walk covering Portuguese, Dutch, and British colonial lanes, spice godowns, and heritage landmarks."},
                {"id": "act-koc-2", "destination_key": "kochi", "name": "Traditional Kathakali & Kalaripayattu Performance", "category": "Culture", "cost": 600.0, "duration": 2.0, "location": "Kerala Kathakali Centre", "time": "Evening", "desc": "Authentic 17th-century classical dance drama with intricate facial makeup demonstration and ancient martial arts."},
                {"id": "act-koc-3", "destination_key": "kochi", "name": "Sunset Harbor Cruise & Chinese Fishing Nets", "category": "Relaxation", "cost": 500.0, "duration": 1.5, "location": "Marine Drive / Fort Kochi", "time": "Sunset", "desc": "Scenic boat cruise along the Arabian Sea port with cantilevered 14th-century Chinese fishing nets in action."},
                {"id": "act-koc-4", "destination_key": "kochi", "name": "Mattancherry Jew Town & Spice Market Tasting", "category": "Food", "cost": 350.0, "duration": 2.0, "location": "Jew Town, Mattancherry", "time": "Afternoon", "desc": "Explore ginger, pepper, and cardamom wholesale auctions, antique warehouses, and local Malabar street snacks."},

                # Kerala — Munnar
                {"id": "act-mun-1", "destination_key": "munnar", "name": "Kolukkumalai 4x4 Sunrise Jeep Safari (7,900 ft)", "category": "Adventure", "cost": 1200.0, "duration": 3.5, "location": "Kolukkumalai Peak", "time": "Morning", "desc": "Early morning off-road jeep ascent through rugged mountain tracks to watch the sunrise above the clouds over Tamil Nadu & Kerala."},
                {"id": "act-mun-2", "destination_key": "munnar", "name": "Lockhart Tea Factory Tour & Sensory Tasting", "category": "Nature", "cost": 350.0, "duration": 1.5, "location": "Lockhart Estate (Est. 1879)", "time": "Morning", "desc": "Step inside a 145-year-old orthodox tea processing factory and sample single-origin high-grown orthodox black and green teas."},
                {"id": "act-mun-3", "destination_key": "munnar", "name": "Eravikulam National Park Nilgiri Tahr Walk", "category": "Wildlife", "cost": 400.0, "duration": 2.5, "location": "Eravikulam / Rajamalai", "time": "Afternoon", "desc": "Guided eco-walk along the high-altitude shola grasslands to spot the endangered wild mountain goat and view Anamudi summit."},
                {"id": "act-mun-4", "destination_key": "munnar", "name": "Mattupetty Dam Speedboat & Echo Point Trail", "category": "Nature", "cost": 450.0, "duration": 2.0, "location": "Mattupetty Dam", "time": "Afternoon", "desc": "Water adventure on scenic reservoir surrounded by rolling tea gardens and natural acoustic echo valley."},

                # Kerala — Thekkady
                {"id": "act-thek-1", "destination_key": "thekkady", "name": "Periyar Lake Boat Safari & Wildlife Spotting", "category": "Wildlife", "cost": 650.0, "duration": 2.0, "location": "Periyar Tiger Reserve", "time": "Morning", "desc": "Cruising deep into the protected sanctuary lake to witness wild Asian elephants, gaur, sambar deer, and rare aquatic birds."},
                {"id": "act-thek-2", "destination_key": "thekkady", "name": "Guided Organic Cardamom & Pepper Plantation Trail", "category": "Nature", "cost": 300.0, "duration": 1.5, "location": "Kumily Spice Valley", "time": "Morning", "desc": "Sensory discovery of authentic spices including green cardamom, clove, cinnamon, nutmeg, allspice, and vanilla beans."},
                {"id": "act-thek-3", "destination_key": "thekkady", "name": "Periyar Forest Bamboo Rafting & Jungle Trek", "category": "Adventure", "cost": 1800.0, "duration": 4.0, "location": "Periyar Deep Reserve", "time": "Full Day", "desc": "Full immersion wilderness journey combining a 3-hour trek through dense evergreen canopy with bamboo raft navigation across pristine waters."},

                # Kerala — Alleppey
                {"id": "act-all-1", "destination_key": "alleppey", "name": "Solar-Assisted Houseboat Day Cruise on Vembanad Lake", "category": "Relaxation", "cost": 2500.0, "duration": 4.0, "location": "Punnamada Finishing Point", "time": "Morning", "desc": "Cruising through the palm-fringed backwaters aboard a handcrafted eco-kettuvallam with fresh tender coconut and traditional lunch."},
                {"id": "act-all-2", "destination_key": "alleppey", "name": "Narrow Backwater Village Canoe Paddle & Toddy Trail", "category": "Culture", "cost": 750.0, "duration": 2.5, "location": "Kuttanad Canals", "time": "Afternoon", "desc": "Gliding through narrow interior village canals inaccessible to large motorboats, observing coir spinning, duck farming, and paddy life."},
                {"id": "act-all-3", "destination_key": "alleppey", "name": "Traditional Kerala Sadhya Feast & Coir Weaving Demo", "category": "Food", "cost": 500.0, "duration": 1.5, "location": "Kainakary Village", "time": "Afternoon", "desc": "24-dish vegetarian feast served on a banana leaf followed by hands-on golden coconut fiber rope spinning with rural craftswomen."},

                # Kerala — Wayanad
                {"id": "act-way-1", "destination_key": "wayanad", "name": "Edakkal Prehistoric Rock Engravings Cave Hike", "category": "Heritage", "cost": 350.0, "duration": 2.5, "location": "Edakkal Caves, Ambukuthi Hills", "time": "Morning", "desc": "Climb through dense forests to Neolithic rock shelters containing mysterious 6000 BCE stone carvings and petroglyphs."},
                {"id": "act-way-2", "destination_key": "wayanad", "name": "Chembra Peak Heart-Shaped Lake Trek", "category": "Adventure", "cost": 850.0, "duration": 4.0, "location": "Chembra Peak Base", "time": "Morning", "desc": "Trekking through mist-covered tea slopes up to the natural perennial heart-shaped mountain lake at 2,100 meters altitude."},
                {"id": "act-way-3", "destination_key": "wayanad", "name": "Banasura Sagar Earth Dam Speedboat Safari", "category": "Adventure", "cost": 600.0, "duration": 1.5, "location": "Banasura Sagar Dam", "time": "Afternoon", "desc": "Exploring India's largest earth dam with speedboats weaving around a archipelago of picturesque forested islands."},

                # Kerala — Varkala
                {"id": "act-var-1", "destination_key": "varkala", "name": "North Cliff Sunset Yoga & Ayurvedic Therapy", "category": "Relaxation", "cost": 600.0, "duration": 1.5, "location": "Varkala North Cliff", "time": "Sunset", "desc": "Gentle oceanfront hatha yoga overlooking the Arabian Sea followed by authentic warm herbal oil head and shoulder therapy."},
                {"id": "act-var-2", "destination_key": "varkala", "name": "Papanasam Natural Mineral Springs Beach Walk", "category": "Beach", "cost": 200.0, "duration": 1.0, "location": "Papanasam Beach", "time": "Morning", "desc": "Strolling along holy red cliff coastline where natural freshwater cliff springs emerge directly onto golden sands."},
                {"id": "act-var-3", "destination_key": "varkala", "name": "Janardanaswamy 2000-Year-Old Ancient Temple Visit", "category": "Spiritual", "cost": 150.0, "duration": 1.0, "location": "Janardanaswamy Temple", "time": "Morning", "desc": "Venerable Vaishnavite temple featuring ancient Dravidian stone carving, copper bells, and sacred banyan trees."},

                # Telangana — Hyderabad
                {"id": "act-hyd-1", "destination_key": "hyderabad", "name": "Golconda Fort Acoustic Whispering Dome Tour", "category": "Heritage", "cost": 400.0, "duration": 2.5, "location": "Golconda Fort Citadel", "time": "Morning", "desc": "Explore the medieval diamond-trading fortress famous for ingenious sound acoustics where a handclap at the entrance echoes at the top citadel."},
                {"id": "act-hyd-2", "destination_key": "hyderabad", "name": "Old City Charminar, Laad Bazaar & Irani Chai Trail", "category": "Food", "cost": 350.0, "duration": 2.0, "location": "Charminar & Laad Bazaar", "time": "Evening", "desc": "Iconic 1591 CE four-minaret monument, dazzling lacquer glass bangle lanes, and steaming spiced Irani chai with buttery Osmania biscuits."},
                {"id": "act-hyd-3", "destination_key": "hyderabad", "name": "Chowmahalla Palace Royal Nizam Heritage Walk", "category": "Culture", "cost": 300.0, "duration": 2.0, "location": "Chowmahalla Palace", "time": "Afternoon", "desc": "Grand durbar halls of the Asaf Jahi Nizams, crystal chandeliers from Belgium, royal courtyards, and vintage Rolls-Royce fleet."},

                # Telangana — Warangal
                {"id": "act-war-1", "destination_key": "warangal", "name": "UNESCO Ramappa 13th-Century Floating Bricks Tour", "category": "Heritage", "cost": 300.0, "duration": 2.0, "location": "Ramappa Temple, Palampet", "time": "Morning", "desc": "Marvel at Kakatiya architecture constructed with lightweight porous bricks that float on water and exquisitely carved sandstone dancers."},
                {"id": "act-war-2", "destination_key": "warangal", "name": "Thousand Pillar Temple & Warangal Stone Gateway", "category": "Culture", "cost": 250.0, "duration": 1.5, "location": "Hanamkonda", "time": "Morning", "desc": "Triple-shrine star-shaped Kakatiya temple dedicated to Shiva, Vishnu, and Surya with polished black basalt Nandi bull sculpture."},
                {"id": "act-war-3", "destination_key": "warangal", "name": "Laknavaram Lake Suspension Bridge Island Trek", "category": "Nature", "cost": 400.0, "duration": 2.5, "location": "Laknavaram Lake", "time": "Afternoon", "desc": "Walking across 13 lush islands connected by hanging suspension bridges across an expansive reservoir surrounded by dense forests."},

                # Rajasthan — Jaipur
                {"id": "act-jai-1", "destination_key": "jaipur", "name": "Amber Fort Hilltop Palace & Sheesh Mahal Tour", "category": "Heritage", "cost": 550.0, "duration": 3.0, "location": "Amer, Jaipur", "time": "Morning", "desc": "Ascend to the hilltop citadel of the Kachwaha kings, featuring mirror palace (Sheesh Mahal), ornate courtyards, and underground secret tunnels."},
                {"id": "act-jai-2", "destination_key": "jaipur", "name": "Hawa Mahal & City Palace Royal Museum Tour", "category": "Culture", "cost": 450.0, "duration": 2.5, "location": "Old City, Jaipur", "time": "Afternoon", "desc": "953 latticed sandstone jharokhas of the Palace of Winds, followed by royal costumes, armory, and courtyards of the Jaipur Royal family."},
                {"id": "act-jai-3", "destination_key": "jaipur", "name": "Johari Bazaar Hand-Block Print Textile Workshop", "category": "Shopping", "cost": 600.0, "duration": 2.0, "location": "Johari Bazaar / Sanganer", "time": "Evening", "desc": "Interactive woodblock printing workshop using natural vegetable dyes, followed by gemstone and jewelry exploration."},

                # Rajasthan — Udaipur
                {"id": "act-udr-1", "destination_key": "udaipur", "name": "Lake Pichola Sunset Boat Cruise & Jag Mandir", "category": "Relaxation", "cost": 750.0, "duration": 1.5, "location": "Lake Pichola", "time": "Sunset", "desc": "Scenic lake cruise passing the floating Lake Palace, marble ghats, and royal summer pavilions of Jag Mandir under golden twilight."},
                {"id": "act-udr-2", "destination_key": "udaipur", "name": "Udaipur City Palace & Crystal Gallery Guided Trail", "category": "Heritage", "cost": 500.0, "duration": 2.5, "location": "City Palace Complex", "time": "Morning", "desc": "Rajasthan's largest royal palace complex with peacock mosaic courtyards, stained glass galleries, and Mewar royal family relics."},
                {"id": "act-udr-3", "destination_key": "udaipur", "name": "Bagore Ki Haveli Rajasthani Folk Dance Show", "category": "Culture", "cost": 300.0, "duration": 1.5, "location": "Gangaur Ghat", "time": "Evening", "desc": "High-energy Chari, Ghoomar, and puppet dance performances on the historic waterfront haveli courtyard."},

                # Rajasthan — Jodhpur
                {"id": "act-jod-1", "destination_key": "jodhpur", "name": "Mehrangarh Fort Flying Fox Aerial Zipline", "category": "Adventure", "cost": 1500.0, "duration": 2.0, "location": "Mehrangarh Fort Walls", "time": "Morning", "desc": "Soaring on 6 thrilling zip lines across the battlements, lakes, and desert canyons of the towering Mehrangarh fort."},
                {"id": "act-jod-2", "destination_key": "jodhpur", "name": "Blue City Old Quarter Heritage Photography Walk", "category": "Culture", "cost": 350.0, "duration": 2.0, "location": "Navchokiya & Brahmapuri", "time": "Morning", "desc": "Guided stroll through indigo-washed maze lanes, meeting local stepwell keepers, sweetmakers, and spice merchants."},
                {"id": "act-jod-3", "destination_key": "jodhpur", "name": "Clock Tower Spice & Handcrafted Leather Market", "category": "Shopping", "cost": 250.0, "duration": 1.5, "location": "Sardar Market", "time": "Evening", "desc": "Vibrant bustling bazaar famous for Mathania red chillies, camel leather mojris, and saffron lassi."},

                # Himachal Pradesh — Shimla
                {"id": "act-shm-1", "destination_key": "shimla", "name": "UNESCO Kalka-Shimla Toy Train Heritage Ride", "category": "Heritage", "cost": 500.0, "duration": 3.0, "location": "Shimla Railway Station", "time": "Morning", "desc": "Historic 1903 narrow-gauge mountain railway traversing 102 tunnels, arched bridges, and breathtaking pine valleys."},
                {"id": "act-shm-2", "destination_key": "shimla", "name": "Jakhoo Hill Ropeway & Sunset Mountain Panorama", "category": "Nature", "cost": 450.0, "duration": 1.5, "location": "Jakhoo Temple & Ropeway", "time": "Sunset", "desc": "Aerial cable car ride up to the highest peak in Shimla (8,000 ft) with panoramic Himalayan views and giant Hanuman statue."},
                {"id": "act-shm-3", "destination_key": "shimla", "name": "Kufri Himalayan Nature Park & Snow Valley Walk", "category": "Adventure", "cost": 650.0, "duration": 3.0, "location": "Kufri Hills", "time": "Morning", "desc": "Pine forest nature walks, spotting rare Himalayan monal and musk deer, with panoramic views of snow-capped Pir Panjal peaks."},

                # Himachal Pradesh — Manali
                {"id": "act-mnl-1", "destination_key": "manali", "name": "Solang Valley Tandem Paragliding Flight", "category": "Adventure", "cost": 2200.0, "duration": 1.5, "location": "Solang Valley", "time": "Morning", "desc": "High-altitude tandem flight launching from 9,000 ft over glacial valleys, pine forests, and roaring mountain streams."},
                {"id": "act-mnl-2", "destination_key": "manali", "name": "Atal Tunnel Scenic Drive & Sissu Waterfalls", "category": "Nature", "cost": 1200.0, "duration": 4.0, "location": "Atal Tunnel / Lahaul Valley", "time": "Morning", "desc": "Drive through the 9-km engineering marvel under Rohtang Pass entering the stark trans-Himalayan landscapes of Sissu in Lahaul."},
                {"id": "act-mnl-3", "destination_key": "manali", "name": "Old Manali Cafe Trail & Hadimba Cedar Temple", "category": "Culture", "cost": 300.0, "duration": 2.0, "location": "Dhungri Cedar Forest", "time": "Afternoon", "desc": "1553 CE pagoda-style wooden temple nestled inside colossal deodar cedars, followed by artisanal bakery and trout cafe trails."},

                # Goa — North Goa
                {"id": "act-ngo-1", "destination_key": "north_goa", "name": "Calangute Jet Ski & Parasailing Water Sports", "category": "Adventure", "cost": 1400.0, "duration": 2.0, "location": "Calangute / Baga Coast", "time": "Morning", "desc": "Adrenaline-fueled Arabian sea combo with certified instructors, lifejackets, and high-flying parachute views of the coast."},
                {"id": "act-ngo-2", "destination_key": "north_goa", "name": "Fort Aguada Lighthouse & Arabian Sea Sunset", "category": "Heritage", "cost": 200.0, "duration": 1.5, "location": "Sinquerim, Candolim", "time": "Sunset", "desc": "17th-century Portuguese fortress and vintage stone lighthouse overlooking the meeting point of Mandovi River and Arabian Sea."},
                {"id": "act-ngo-3", "destination_key": "north_goa", "name": "Anjuna Flea Market & Live Acoustic Shack Evening", "category": "Shopping", "cost": 400.0, "duration": 2.5, "location": "Anjuna Beachfront", "time": "Evening", "desc": "Eclectic bohemian beachfront market with handmade crafts, spices, jewelry, and seaside candlelit acoustic music."},

                # Goa — South Goa
                {"id": "act-sgo-1", "destination_key": "south_goa", "name": "Palolem Dolphin Spotting Boat Trip & Butterfly Beach", "category": "Nature", "cost": 800.0, "duration": 2.0, "location": "Palolem Bay", "time": "Morning", "desc": "Early morning fisherman boat expedition to spot playful humpback dolphins near hidden cove beaches."},
                {"id": "act-sgo-2", "destination_key": "south_goa", "name": "Sahakari Organic Spice Plantation Guided Feast", "category": "Food", "cost": 650.0, "duration": 2.5, "location": "Ponda Spice Valleys", "time": "Afternoon", "desc": "Traditional herbal flower welcome, guided spice forest walk, elephant washing viewing, and buffet Goan feast on betel nut plates."},
                {"id": "act-sgo-3", "destination_key": "south_goa", "name": "Cabo de Rama Fort Panoramic Ocean Walk", "category": "Relaxation", "cost": 250.0, "duration": 1.5, "location": "Canacona Ridge", "time": "Sunset", "desc": "Ancient cliff fort with legendary Ramayana ties offering 300-degree ocean views and quiet untouched rocky beaches."},

                # Delhi NCR — Delhi
                {"id": "act-del-1", "destination_key": "delhi", "name": "Old Delhi Rickshaw Spice & Street Food Safari", "category": "Food", "cost": 500.0, "duration": 2.5, "location": "Chandni Chowk & Khari Baoli", "time": "Morning", "desc": "Cycle rickshaw ride through Asia's largest spice market, sampling famous Paranthe Wali Gali paranthas and jalebis."},
                {"id": "act-del-2", "destination_key": "delhi", "name": "Qutub Minar & Mehrauli Archaeological Park Walk", "category": "Heritage", "cost": 350.0, "duration": 2.0, "location": "Mehrauli, South Delhi", "time": "Afternoon", "desc": "UNESCO 73-meter brick minaret built in 1192 CE, ancient rust-free iron pillar, and stepwells of the Delhi Sultanate."},
                {"id": "act-del-3", "destination_key": "delhi", "name": "Humayun's Tomb Mughal Charbagh Garden Tour", "category": "Culture", "cost": 400.0, "duration": 2.0, "location": "Nizamuddin East", "time": "Sunset", "desc": "The architectural precursor to the Taj Mahal with symmetrical waterways, red sandstone arches, and marble domes."},

                # Uttar Pradesh — Agra
                {"id": "act-agr-1", "destination_key": "agra", "name": "Sunrise Taj Mahal Guided Monument of Love Tour", "category": "Heritage", "cost": 750.0, "duration": 3.0, "location": "Taj Mahal Complex", "time": "Morning", "desc": "Witness the white marble wonder glow pink and gold under morning sunrise with licensed architectural historian storyteller."},
                {"id": "act-agr-2", "destination_key": "agra", "name": "Agra Fort Royal Red Sandstone Citadel Tour", "category": "Heritage", "cost": 450.0, "duration": 2.0, "location": "Agra Fort", "time": "Afternoon", "desc": "Massive UNESCO Mughal fortress with the Jahangiri Mahal, Diwan-i-Khas, and Shah Jahan's octagonal tower overlooking the Yamuna."},
                {"id": "act-agr-3", "destination_key": "agra", "name": "Mehtab Bagh Moonlight Garden Sunset View", "category": "Relaxation", "cost": 300.0, "duration": 1.5, "location": "Opposite Taj Mahal, Yamuna Bank", "time": "Sunset", "desc": "Peaceful Mughal garden aligned with the Taj Mahal offering postcard reflection views across the calm river away from crowds."},

                # Karnataka — Bengaluru
                {"id": "act-blr-1", "destination_key": "bengaluru", "name": "Lalbagh Botanical Glasshouse & Heritage Tree Walk", "category": "Nature", "cost": 250.0, "duration": 2.0, "location": "Lalbagh Botanical Garden", "time": "Morning", "desc": "240-acre royal botanical sanctuary founded by Hyder Ali with century-old trees, lotus ponds, and London Crystal Palace glasshouse."},
                {"id": "act-blr-2", "destination_key": "bengaluru", "name": "Old Bangalore Filter Coffee & Benne Dosa Trail", "category": "Food", "cost": 300.0, "duration": 2.0, "location": "VV Puram & Basavanagudi", "time": "Morning", "desc": "Taste legendary crispy butter dosas, filter kaapi, and idlis in iconic heritage eateries established in the 1940s."},

                # Karnataka — Mysore
                {"id": "act-mys-1", "destination_key": "mysore", "name": "Mysore Royal Palace Grand Illumination Tour", "category": "Heritage", "cost": 400.0, "duration": 2.5, "location": "Mysore Palace Complex", "time": "Evening", "desc": "Indo-Saracenic royal palace with 100,000 glowing bulbs on weekends, carved teak ceilings, silver thrones, and stained glass ceilings."},
                {"id": "act-mys-2", "destination_key": "mysore", "name": "Devaraja Century-Old Silk, Sandalwood & Flower Market", "category": "Culture", "cost": 250.0, "duration": 1.5, "location": "Sayyaji Rao Road", "time": "Morning", "desc": "Vibrant market filled with jasmine garlands, authentic Mysore sandalwood oils, incense cones, and betel leaves."},

                # Karnataka — Coorg (Kodagu)
                {"id": "act-crg-1", "destination_key": "coorg", "name": "Organic Arabica Coffee Plantation Trail & Roast Demo", "category": "Nature", "cost": 450.0, "duration": 2.0, "location": "Madikeri Coffee Valley", "time": "Morning", "desc": "Walk under shade-grown coffee canopies, learn bean harvesting, and taste freshly brewed artisan estate coffee."},
                {"id": "act-crg-2", "destination_key": "coorg", "name": "Abbey Falls & Western Ghats Rainforest Walk", "category": "Adventure", "cost": 300.0, "duration": 2.0, "location": "Abbey Falls, Madikeri", "time": "Afternoon", "desc": "Suspension bridge viewing of roaring mountain waterfalls surrounded by pepper vines and wild ferns."},

                # Maharashtra — Mumbai
                {"id": "act-bom-1", "destination_key": "mumbai", "name": "Gateway of India & Colaba Heritage Architecture Walk", "category": "Culture", "cost": 400.0, "duration": 2.0, "location": "Colaba Waterfront", "time": "Morning", "desc": "Explore Victorian Gothic and Art Deco UNESCO heritage buildings, Taj Mahal Palace history, and seaside promenades."},
                {"id": "act-bom-2", "destination_key": "mumbai", "name": "Elephanta Island 6th-Century Shiva Caves Boat Tour", "category": "Heritage", "cost": 650.0, "duration": 3.5, "location": "Elephanta Island, Mumbai Harbour", "time": "Morning", "desc": "Harbour ferry ride to UNESCO rock-cut cave temples featuring the colossal three-headed Trimurti Shiva sculpture."},

                # West Bengal — Darjeeling
                {"id": "act-dar-1", "destination_key": "darjeeling", "name": "Tiger Hill Kanchenjunga Sunrise View (8,482 ft)", "category": "Nature", "cost": 600.0, "duration": 2.5, "location": "Tiger Hill Observatory", "time": "Morning", "desc": "Watch first rays of sunlight illuminate the snow-capped peak of Mount Kanchenjunga, world's 3rd highest mountain."},
                {"id": "act-dar-2", "destination_key": "darjeeling", "name": "Happy Valley 1854 Organic Tea Estate & Factory Trail", "category": "Nature", "cost": 350.0, "duration": 1.5, "location": "Lebong Cart Road", "time": "Morning", "desc": "High altitude tea plucking with panoramic valley views, learning the secret of the champagne of teas."},

                # Uttarakhand — Rishikesh
                {"id": "act-rsh-1", "destination_key": "rishikesh", "name": "Ganga White Water Rafting & Cliff Jump (16 km)", "category": "Adventure", "cost": 1100.0, "duration": 3.0, "location": "Shivpuri to Rishikesh", "time": "Morning", "desc": "Navigate exhilarating Grade III rapids on the holy Ganges under expert international river guides."},
                {"id": "act-rsh-2", "destination_key": "rishikesh", "name": "Triveni Ghat Evening Ganga Aarti & Sacred Chants", "category": "Spiritual", "cost": 0.0, "duration": 1.5, "location": "Triveni Ghat", "time": "Sunset", "desc": "Soul-stirring Vedic fire ceremony with chanting priests, glowing oil lamps floating on the river, and conch shells."}
            ]

            for a in activities_data:
                act = DestinationActivity(
                    id=a["id"],
                    destination_key=a["destination_key"],
                    name=a["name"],
                    category=a["category"],
                    duration_hours=a["duration"],
                    approx_cost_inr=a["cost"],
                    location_name=a["location"],
                    best_time_of_day=a["time"],
                    description=a["desc"],
                    is_verified=True
                )
                db.add(act)
            db.commit()
            print(f"Seeded {len(activities_data)} verified Destination Activities successfully!")

        # 6. Seed Transport Credentials for Tour Operators
        cred1 = db.query(TransportCredential).filter(TransportCredential.id == "tc-2026-001").first()
        if not cred1:
            cred1 = TransportCredential(
                id="tc-2026-001",
                credential_number="TC-2026-KL-0918",
                tour_operator_id="usr-touroperator-1",
                status="ACTIVE",
                compliance_status="COMPLIANT",
                issued_by_id="usr-transport-1",
                notes="Authorized for Western Ghats, Kerala, and Inter-State Golden Circuit operations."
            )
            db.add(cred1)
            db.flush()

            # Assign initial fleet vehicle
            v1 = db.query(Vehicle).first()
            if v1:
                db.add(TransportCredentialVehicle(
                    id="tcv-1",
                    credential_id=cred1.id,
                    vehicle_id=v1.id,
                    status="ACTIVE"
                ))

            # Assign initial verified driver
            d1 = db.query(Driver).first()
            if d1:
                db.add(TransportCredentialDriver(
                    id="tcd-1",
                    credential_id=cred1.id,
                    driver_id=d1.id,
                    status="ACTIVE"
                ))

            db.commit()
            print("Seeded Transport Credential 'TC-2026-KL-0918' for Tour Operator!")

        # 7. Seed Initial Tour Packages in Database
        pkg1 = db.query(TourPackage).filter(TourPackage.id == "pkg-munnar-5d").first()
        if not pkg1:
            pkg1 = TourPackage(
                id="pkg-munnar-5d",
                operator_id="usr-touroperator-1",
                title="5-Day Munnar Tea Trail & Mist Valley Odyssey",
                destination_key="kerala",
                destination_name="Kerala (Munnar & Anamudi)",
                destinations_json=["kerala", "munnar"],
                category="eco_adventure",
                duration_days=5,
                duration_nights=4,
                base_price_inr=18500.0,
                discounted_price_inr=16999.0,
                max_capacity_per_batch=15,
                min_capacity_per_batch=2,
                difficulty_level="MODERATE",
                guide_requirement="LICENSED_STORYTELLER",
                inclusions_json=["Colonial Estate Stay", "All Traditional Sadhya Meals", "Private 4x4 Jeep Safari", "Storyteller Naturalist Guide", "Tea Tasting Workshop"],
                exclusions_json=["Personal Laundry", "Extra Alcoholic Beverages", "Camera Charges at National Parks"],
                cancellation_policy="Full refund up to 7 days before departure. 50% refund between 3 to 7 days.",
                status="PUBLISHED",
                rating=4.94,
                total_bookings=28,
                cover_image_url="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80",
                gallery_json=["https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80"]
            )
            db.add(pkg1)
            db.flush()

            sch1 = TourSchedule(
                id="sch-101",
                package_id=pkg1.id,
                start_date="2026-10-15",
                end_date="2026-10-19",
                batch_capacity=15,
                booked_seats=4,
                status="OPEN"
            )
            db.add(sch1)

        pkg2 = db.query(TourPackage).filter(TourPackage.id == "pkg-shimla-4d").first()
        if not pkg2:
            pkg2 = TourPackage(
                id="pkg-shimla-4d",
                operator_id="usr-touroperator-1",
                title="Shimla Mountain Explorer & Pine Forest Heritage Walk",
                destination_key="shimla",
                destination_name="Himachal Pradesh (Shimla & Kufri)",
                destinations_json=["shimla", "kufri", "himachal"],
                category="heritage",
                duration_days=4,
                duration_nights=3,
                base_price_inr=15000.0,
                discounted_price_inr=13999.0,
                max_capacity_per_batch=12,
                min_capacity_per_batch=2,
                difficulty_level="EASY",
                guide_requirement="LICENSED_STORYTELLER",
                inclusions_json=["Heritage Pine Villa Stay", "Toy Train Heritage Experience", "Kufri Snow Valley Walk", "Local Storyteller Guide"],
                exclusions_json=["Personal Expenses", "Ropeway Tickets"],
                cancellation_policy="Full refund up to 5 days before departure.",
                status="PUBLISHED",
                rating=4.91,
                total_bookings=14,
                cover_image_url="https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=600&auto=format&fit=crop&q=80",
                gallery_json=["https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=600&auto=format&fit=crop&q=80"]
            )
            db.add(pkg2)
            db.flush()

            sch2 = TourSchedule(
                id="sch-102",
                package_id=pkg2.id,
                start_date="2026-11-01",
                end_date="2026-11-04",
                batch_capacity=12,
                booked_seats=3,
                status="OPEN"
            )
            db.add(sch2)

        # Multi-destination Golden Triangle Package
        pkg3 = db.query(TourPackage).filter(TourPackage.id == "pkg-golden-triangle-6d").first()
        if not pkg3:
            pkg3 = TourPackage(
                id="pkg-golden-triangle-6d",
                operator_id="usr-touroperator-1",
                title="6-Day Golden Triangle Imperial Expedition (Delhi → Agra → Jaipur)",
                destination_key="delhi",
                destination_name="Delhi, Agra & Jaipur (Golden Triangle)",
                destinations_json=["delhi", "agra", "jaipur", "rajasthan", "uttar pradesh"],
                category="heritage",
                duration_days=6,
                duration_nights=5,
                base_price_inr=24500.0,
                discounted_price_inr=22999.0,
                max_capacity_per_batch=16,
                min_capacity_per_batch=2,
                difficulty_level="EASY",
                guide_requirement="HISTORIAN",
                inclusions_json=["All 5-Star Heritage Stays", "Sunrise Taj Mahal Access", "Amber Fort Jeep Ascent", "Chauffeur Driven AC Tourist Vehicle", "All Monument Historian Guides"],
                exclusions_json=["Airfare to Delhi", "Personal Tips"],
                cancellation_policy="Full refund up to 7 days before departure.",
                status="PUBLISHED",
                rating=4.96,
                total_bookings=35,
                cover_image_url="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80",
                gallery_json=["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80"]
            )
            db.add(pkg3)
            db.flush()

            sch3 = TourSchedule(
                id="sch-103",
                package_id=pkg3.id,
                start_date="2026-11-10",
                end_date="2026-11-15",
                batch_capacity=16,
                booked_seats=6,
                status="OPEN"
            )
            db.add(sch3)

        db.commit()
        print("Seeded verified Tour Packages in database successfully!")

        print("Database initialization & seed complete successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
