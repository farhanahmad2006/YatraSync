import os
import uuid
import re
from io import BytesIO
from typing import List, Optional
from datetime import datetime
from PIL import Image
from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Hotel, HotelImage, RoomType, RoomInventoryBlock, User
from app.schemas.schemas import (
    HotelOnboardRequest,
    HotelStatusUpdateRequest,
    HotelResponse,
    RoomTypeCreateRequest,
    RoomTypeUpdateRequest,
    RoomTypeResponse,
    RoomInventoryBlockCreateRequest,
    RoomInventoryBlockResponse,
    HotelAvailabilityResponse,
    RoomTypeAvailabilityResponse,
    HotelDashboardSummaryResponse,
    InventoryConfirmRequest
)
from app.core.permissions import (
    get_current_user_optional,
    get_current_user,
    require_hotel_admin,
    require_hotel_owner,
    require_hotel_owner_or_admin,
    require_super_admin,
    require_permission,
    verify_hotel_ownership
)
from app.services.audit_service import log_audit_event
from app.services.availability_service import (
    calculate_room_type_availability,
    calculate_hotel_availability,
    get_hotel_dashboard_metrics,
    parse_date_flexible
)
from app.websocket.ws_manager import ws_manager

from sqlalchemy import or_
from app.services.recommendation_service import DESTINATION_CATALOG

router = APIRouter(prefix="/hotels", tags=["Hotel Management & Inventory"])

@router.get("", response_model=List[HotelResponse])
def search_hotels(
    city: Optional[str] = None,
    state: Optional[str] = None,
    destination: Optional[str] = None,
    destination_key: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Hotel)
    # Customers and public only see APPROVED or ACTIVE hotels
    if not current_user or current_user.role == "CUSTOMER":
        query = query.filter(Hotel.approval_status.in_(["APPROVED", "ACTIVE"]))
    elif current_user.role == "HOTEL_OWNER":
        query = query.filter(Hotel.owner_id == current_user.id)
    elif current_user.role in ["HOTEL_ADMIN", "SUPER_ADMIN"]:
        if status:
            query = query.filter(Hotel.approval_status == status.upper())
    elif status:
        query = query.filter(Hotel.approval_status == status.upper())

    target_dest = destination_key or destination or city
    if target_dest:
        clean_dest = target_dest.strip().lower().replace("-", "_")
        dest_meta = DESTINATION_CATALOG.get(clean_dest)
        dest_name = dest_meta["name"] if dest_meta else clean_dest
        dest_state = dest_meta["state"] if dest_meta else ""
        base_city = dest_name.split("(")[0].strip()

        # Check if query is targeting a full state or a specific city/destination
        known_states = ["kerala", "himachal", "himachal_pradesh", "rajasthan", "telangana", "goa", "andhra_pradesh", "andhrapradesh", "karnataka", "tamil_nadu", "tamilnadu", "maharashtra", "delhi"]
        is_state_query = clean_dest in known_states or (dest_state and clean_dest == dest_state.lower().replace(" ", "_"))

        if is_state_query:
            state_target = dest_state or clean_dest.replace("_", " ")
            query = query.filter(Hotel.state.ilike(f"%{state_target}%"))
        else:
            # Strictly filter by city name / destination / property name
            query = query.filter(
                or_(
                    Hotel.city.ilike(f"%{clean_dest}%"),
                    Hotel.city.ilike(f"%{base_city}%"),
                    Hotel.property_name.ilike(f"%{clean_dest}%"),
                    Hotel.property_name.ilike(f"%{base_city}%")
                )
            )

    if state and not target_dest:
        query = query.filter(Hotel.state.ilike(f"%{state}%"))

    hotels = query.all()
    results = []
    for h in hotels:
        photos = [img.image_url for img in h.images] if h.images else []
        results.append({
            "id": h.id,
            "propertyName": h.property_name,
            "propertyType": h.property_type,
            "ownerName": h.owner_name,
            "contactPhone": h.contact_phone,
            "contactEmail": h.contact_email,
            "address": {
                "line": h.address_line,
                "city": h.city,
                "state": h.state,
                "pincode": h.pincode,
                "landmark": h.landmark
            },
            "details": {
                "roomCount": h.room_count,
                "baseTariffINR": h.base_tariff_inr,
                "description": h.description,
                "amenities": h.amenities or ["Wi-Fi", "Free Breakfast"],
                "photos": photos
            },
            "verification": {
                "panNumber": h.pan_number or "ABCDE1234F",
                "gstin": h.gstin or "32ABCDE1234F1Z5",
                "digiLockerVerified": h.digilocker_verified,
                "inventoryConfirmed": h.inventory_confirmed,
                "documentUrls": []
            },
            "approvalStatus": h.approval_status,
            "rating": h.rating,
            "totalBookings": h.total_bookings,
            "createdAt": h.created_at
        })
    return results

@router.post("/onboard")
def onboard_hotel(
    request: HotelOnboardRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    owner_id = current_user.id if current_user else None
    owner_name = current_user.name if current_user else request.ownerName

    # If an existing user onboards their hotel, ensure role is HOTEL_OWNER
    if current_user and current_user.role == "CUSTOMER":
        current_user.role = "HOTEL_OWNER"
        db.commit()

    hotel = Hotel(
        property_name=request.propertyName,
        property_type=request.propertyType,
        owner_id=owner_id,
        owner_name=owner_name,
        contact_phone=request.contactPhone,
        contact_email=request.contactEmail,
        address_line=request.address.get("line", "Main Road"),
        city=request.address.get("city", "Kochi"),
        state=request.address.get("state", "Kerala"),
        pincode=request.address.get("pincode", "682001"),
        landmark=request.address.get("landmark"),
        room_count=request.details.get("roomCount", 5),
        base_tariff_inr=float(request.details.get("baseTariffINR", 1800)),
        description=request.details.get("description", "Verified zero-surcharge partner homestay."),
        amenities=request.details.get("amenities", ["Wi-Fi", "Free Breakfast"]),
        pan_number=request.verification.get("panNumber") if request.verification else "ABCDE1234F",
        gstin=request.verification.get("gstin") if request.verification else "32ABCDE1234F1Z5",
        digilocker_verified=True,
        approval_status="UNDER_REVIEW",
        inventory_confirmed=False,
        rating=4.85,
        total_bookings=0
    )
    db.add(hotel)
    db.commit()
    db.refresh(hotel)

    # Save images
    photos = request.details.get("photos", [])
    for p in photos:
        img = HotelImage(hotel_id=hotel.id, image_url=p, is_verified=True)
        db.add(img)
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_SUBMITTED",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=current_user.id if current_user else None,
        actor_role=current_user.role if current_user else "HOTEL_OWNER",
        description=f"New hotel property '{hotel.property_name}' submitted for approval by {hotel.owner_name}."
    )

    return {
        "message": "Hotel property submitted for verification",
        "property": {
            "id": hotel.id,
            "propertyName": hotel.property_name,
            "approvalStatus": hotel.approval_status,
            "inventoryConfirmed": hotel.inventory_confirmed
        }
    }

@router.get("/assigned", response_model=List[HotelResponse])
def get_assigned_hotels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "SUPER_ADMIN":
        hotels = db.query(Hotel).order_by(Hotel.created_at.desc()).all()
    else:
        hotels = db.query(Hotel).filter(Hotel.owner_id == current_user.id).order_by(Hotel.created_at.desc()).all()

    results = []
    for h in hotels:
        photos = [img.image_url for img in h.images] if h.images else []
        results.append({
            "id": h.id,
            "propertyName": h.property_name,
            "propertyType": h.property_type,
            "ownerName": h.owner_name,
            "contactPhone": h.contact_phone,
            "contactEmail": h.contact_email,
            "address": {
                "line": h.address_line,
                "city": h.city,
                "state": h.state,
                "pincode": h.pincode,
                "landmark": h.landmark
            },
            "details": {
                "roomCount": h.room_count,
                "baseTariffINR": h.base_tariff_inr,
                "description": h.description,
                "amenities": h.amenities or ["Wi-Fi", "Free Breakfast"],
                "photos": photos
            },
            "verification": {
                "panNumber": h.pan_number or "ABCDE1234F",
                "gstin": h.gstin or "32ABCDE1234F1Z5",
                "digiLockerVerified": h.digilocker_verified,
                "inventoryConfirmed": h.inventory_confirmed,
                "documentUrls": []
            },
            "approvalStatus": h.approval_status,
            "rating": h.rating,
            "totalBookings": h.total_bookings,
            "createdAt": h.created_at
        })
    return results

@router.get("/{hotel_id}")
def get_hotel(hotel_id: str, db: Session = Depends(get_db)):
    h = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    photos = [img.image_url for img in h.images] if h.images else []
    return {
        "id": h.id,
        "propertyName": h.property_name,
        "propertyType": h.property_type,
        "ownerId": h.owner_id,
        "ownerName": h.owner_name,
        "contactPhone": h.contact_phone,
        "contactEmail": h.contact_email,
        "address": {
            "line": h.address_line,
            "city": h.city,
            "state": h.state,
            "pincode": h.pincode,
            "landmark": h.landmark
        },
        "details": {
            "roomCount": h.room_count,
            "baseTariffINR": h.base_tariff_inr,
            "description": h.description,
            "amenities": h.amenities or ["Wi-Fi", "Free Breakfast"],
            "photos": photos
        },
        "verification": {
            "panNumber": h.pan_number or "ABCDE1234F",
            "gstin": h.gstin or "32ABCDE1234F1Z5",
            "digiLockerVerified": h.digilocker_verified,
            "inventoryConfirmed": h.inventory_confirmed,
            "documentUrls": []
        },
        "approvalStatus": h.approval_status,
        "rating": h.rating,
        "totalBookings": h.total_bookings,
        "createdAt": h.created_at
    }

@router.put("/{hotel_id}/status")
def update_hotel_status(
    hotel_id: str,
    request: HotelStatusUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    h = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hotel property not found")

    old_status = h.approval_status
    h.approval_status = request.approvalStatus.upper()
    db.commit()

    log_audit_event(
        db,
        action="HOTEL_APPROVAL_UPDATE",
        entity_type="HOTEL",
        entity_id=h.id,
        actor_user_id=admin.id,
        actor_role=admin.role,
        old_value={"approvalStatus": old_status},
        new_value={"approvalStatus": h.approval_status},
        description=f"Hotel property '{h.property_name}' status updated from {old_status} to {h.approval_status} by Admin."
    )

# -------------------------------------------------------------
# HOTEL IMAGES MANAGEMENT (HOTEL_OWNER & ADMIN)
# -------------------------------------------------------------
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB per image
MAX_FILES_COUNT = 20

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
HOTELS_UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads", "hotels")
os.makedirs(HOTELS_UPLOADS_DIR, exist_ok=True)

@router.get("/{hotel_id}/images")
def get_hotel_images(
    hotel_id: str,
    db: Session = Depends(get_db)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")
    
    images = db.query(HotelImage).filter(HotelImage.hotel_id == hotel_id).order_by(HotelImage.created_at.asc()).all()
    return [
        {
            "id": img.id,
            "hotelId": img.hotel_id,
            "imageUrl": img.image_url,
            "imageSource": img.image_source,
            "isVerified": img.is_verified,
            "createdAt": img.created_at.isoformat() if img.created_at else None
        }
        for img in images
    ]

@router.post("/{hotel_id}/images")
async def upload_hotel_images(
    hotel_id: str,
    request: Request,
    files: Optional[List[UploadFile]] = File(default=None),
    file: Optional[UploadFile] = File(default=None),
    images: Optional[List[UploadFile]] = File(default=None),
    photos: Optional[List[UploadFile]] = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")
    
    # Strict hotel ownership verification (403 if not owner or super admin)
    verify_hotel_ownership(hotel, current_user)
    
    upload_list: List[UploadFile] = []
    
    # Check FastAPI injected candidate parameters
    for candidate in [files, images, photos]:
        if candidate:
            for item in candidate:
                if item and hasattr(item, "filename") and item.filename:
                    upload_list.append(item)
    if file and hasattr(file, "filename") and file.filename:
        upload_list.append(file)
    
    # If no files found from injected parameters, parse form fields directly from request
    if not upload_list:
        try:
            form = await request.form()
            for key, val in form.multi_items():
                if isinstance(val, UploadFile) and getattr(val, "filename", None):
                    upload_list.append(val)
        except Exception:
            pass
    
    if not upload_list or len(upload_list) == 0:
        raise HTTPException(status_code=400, detail="No valid image files provided for upload.")
    
    if len(upload_list) > MAX_FILES_COUNT:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_FILES_COUNT} images can be uploaded in one operation.")
    
    hotel_dir = os.path.join(HOTELS_UPLOADS_DIR, hotel_id)
    os.makedirs(hotel_dir, exist_ok=True)
    
    uploaded_records = []
    
    for file_item in upload_list:
        original_filename = file_item.filename or "hotel_photo.jpg"
        ext = os.path.splitext(original_filename)[1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format '{ext}' for file '{original_filename}'. Allowed formats: JPG, JPEG, PNG, WEBP."
            )
        
        content_type = file_item.content_type.lower() if file_item.content_type else ""
        if content_type and content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid MIME type '{content_type}' for file '{original_filename}'."
            )
        
        content = await file_item.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File '{original_filename}' exceeds maximum allowed size of 10 MB."
            )
        if len(content) < 100:
            raise HTTPException(
                status_code=400,
                detail=f"File '{original_filename}' is empty or invalid."
            )
        
        # Verify valid image content via PIL
        try:
            pil_img = Image.open(BytesIO(content))
            pil_img.verify()
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"File '{original_filename}' is not a valid or readable image."
            )
        
        # Sanitize filename and save locally
        safe_name = re.sub(r'[^a-zA-Z0-9_\-.]', '_', original_filename)
        file_uuid = uuid.uuid4().hex[:12]
        saved_filename = f"{file_uuid}_{safe_name}"
        file_path = os.path.join(hotel_dir, saved_filename)
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Create database metadata record
        img_url = f"/uploads/hotels/{hotel_id}/{saved_filename}"
        hotel_img = HotelImage(
            id=str(uuid.uuid4()),
            hotel_id=hotel_id,
            image_url=img_url,
            image_source="partner_upload",
            is_verified=True,
            created_at=datetime.utcnow()
        )
        db.add(hotel_img)
        uploaded_records.append(hotel_img)
    
    db.commit()
    for record in uploaded_records:
        db.refresh(record)
    
    log_audit_event(
        db,
        action="HOTEL_IMAGES_UPLOADED",
        entity_type="HOTEL",
        entity_id=hotel_id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Hotel Owner '{current_user.name}' uploaded {len(uploaded_records)} photos for property '{hotel.property_name}'."
    )
    
    return {
        "message": f"Successfully uploaded {len(uploaded_records)} photo(s).",
        "images": [
            {
                "id": img.id,
                "hotelId": img.hotel_id,
                "imageUrl": img.image_url,
                "imageSource": img.image_source,
                "isVerified": img.is_verified,
                "createdAt": img.created_at.isoformat() if img.created_at else None
            }
            for img in uploaded_records
        ]
    }

@router.delete("/{hotel_id}/images/{image_id}")
def delete_hotel_image(
    hotel_id: str,
    image_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel property not found")
    
    verify_hotel_ownership(hotel, current_user)
    
    img = db.query(HotelImage).filter(
        HotelImage.id == image_id,
        HotelImage.hotel_id == hotel_id
    ).first()
    if not img:
        raise HTTPException(status_code=404, detail="Hotel image not found")
    
    # Delete physical file if exists
    if img.image_url.startswith("/uploads/"):
        rel_path = img.image_url.lstrip("/")
        phys_path = os.path.join(BACKEND_DIR, rel_path)
        if os.path.exists(phys_path):
            try:
                os.remove(phys_path)
            except Exception:
                pass
    
    db.delete(img)
    db.commit()
    
    log_audit_event(
        db,
        action="HOTEL_IMAGE_DELETED",
        entity_type="HOTEL",
        entity_id=hotel_id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Hotel image '{image_id}' deleted from property '{hotel.property_name}' by '{current_user.name}'."
    )
    
    return {
        "message": "Hotel image deleted successfully.",
        "imageId": image_id
    }

# -------------------------------------------------------------
# ROOM TYPES & INVENTORY MANAGEMENT
# -------------------------------------------------------------
@router.get("/{hotel_id}/rooms", response_model=List[RoomTypeResponse])
def get_hotel_room_types(hotel_id: str, db: Session = Depends(get_db)):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        return []
    
    rooms = db.query(RoomType).filter(RoomType.hotel_id == hotel.id).all()
    return [
        {
            "id": r.id,
            "hotelId": r.hotel_id,
            "name": r.name,
            "description": r.description,
            "bedConfig": r.bed_config or "King Bed",
            "roomSizeSqft": r.room_size_sqft or 320,
            "inventoryCount": r.inventory_count or 1,
            "maxOccupancy": r.max_occupancy or 3,
            "adultCapacity": r.adult_capacity or 2,
            "childCapacity": r.child_capacity or 1,
            "basePrice": r.base_price,
            "extraAdultPrice": r.extra_adult_price or 500.0,
            "extraChildPrice": r.extra_child_price or 250.0,
            "amenities": r.amenities or ["Wi-Fi", "Attached Bath"],
            "status": r.status or "ACTIVE",
            "createdAt": r.created_at
        }
        for r in rooms
    ]

@router.post("/{hotel_id}/rooms", response_model=RoomTypeResponse)
def create_room_type(
    hotel_id: str,
    request: RoomTypeCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_TYPE_CREATE_OWN"))
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    # Strict ownership verification
    verify_hotel_ownership(hotel, current_user)

    new_room = RoomType(
        hotel_id=hotel.id,
        name=request.name,
        description=request.description,
        bed_config=request.bedConfig,
        room_size_sqft=request.roomSizeSqft,
        inventory_count=request.inventoryCount,
        max_occupancy=request.maxOccupancy,
        adult_capacity=request.adultCapacity,
        child_capacity=request.childCapacity,
        base_price=request.basePrice,
        extra_adult_price=request.extraAdultPrice,
        extra_child_price=request.extraChildPrice,
        amenities=request.amenities or ["Wi-Fi", "Attached Bath"],
        status=request.status or "ACTIVE"
    )
    db.add(new_room)
    
    # Update hotel total room count
    hotel.room_count = (hotel.room_count or 0) + request.inventoryCount
    db.commit()
    db.refresh(new_room)
    
    log_audit_event(
        db,
        action="ROOM_TYPE_CREATED",
        entity_type="ROOM_TYPE",
        entity_id=new_room.id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Created room category '{new_room.name}' ({new_room.inventory_count} rooms at INR {new_room.base_price}/night) for {hotel.property_name}."
    )

    return {
        "id": new_room.id,
        "hotelId": new_room.hotel_id,
        "name": new_room.name,
        "description": new_room.description,
        "bedConfig": new_room.bed_config,
        "roomSizeSqft": new_room.room_size_sqft,
        "inventoryCount": new_room.inventory_count,
        "maxOccupancy": new_room.max_occupancy,
        "adultCapacity": new_room.adult_capacity,
        "childCapacity": new_room.child_capacity,
        "basePrice": new_room.base_price,
        "extraAdultPrice": new_room.extra_adult_price,
        "extraChildPrice": new_room.extra_child_price,
        "amenities": new_room.amenities or [],
        "status": new_room.status,
        "createdAt": new_room.created_at
    }

@router.put("/rooms/{room_id}", response_model=RoomTypeResponse)
def update_room_type(
    room_id: str,
    request: RoomTypeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_TYPE_UPDATE_OWN"))
):
    room = db.query(RoomType).filter(RoomType.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
        
    hotel = db.query(Hotel).filter(Hotel.id == room.hotel_id).first()
    if hotel:
        verify_hotel_ownership(hotel, current_user)

    if request.name is not None:
        room.name = request.name
    if request.description is not None:
        room.description = request.description
    if request.bedConfig is not None:
        room.bed_config = request.bedConfig
    if request.roomSizeSqft is not None:
        room.room_size_sqft = request.roomSizeSqft

    old_inv = room.inventory_count
    if request.inventoryCount is not None:
        if request.inventoryCount < old_inv:
            from app.db.models import RoomBookingItem, Booking
            active_items = (
                db.query(RoomBookingItem)
                .join(Booking, Booking.id == RoomBookingItem.booking_id)
                .filter(
                    RoomBookingItem.room_type_id == room.id,
                    Booking.status.in_(["Confirmed", "Active", "Pending"])
                )
                .all()
            )
            max_booked = sum(item.rooms_count for item in active_items) if active_items else 0
            if request.inventoryCount < max_booked:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot reduce inventory to {request.inventoryCount}. {max_booked} room(s) are currently committed to active guest bookings."
                )
        room.inventory_count = request.inventoryCount
        if hotel:
            hotel.room_count = max(1, (hotel.room_count or 0) - old_inv + request.inventoryCount)
    if request.maxOccupancy is not None:
        room.max_occupancy = request.maxOccupancy
    if request.adultCapacity is not None:
        room.adult_capacity = request.adultCapacity
    if request.childCapacity is not None:
        room.child_capacity = request.childCapacity
    if request.basePrice is not None:
        room.base_price = request.basePrice
    if request.extraAdultPrice is not None:
        room.extra_adult_price = request.extraAdultPrice
    if request.extraChildPrice is not None:
        room.extra_child_price = request.extraChildPrice
    if request.amenities is not None:
        room.amenities = request.amenities
    if request.status is not None:
        room.status = request.status
        
    db.commit()
    db.refresh(room)
    
    log_audit_event(
        db,
        action="ROOM_TYPE_UPDATED",
        entity_type="ROOM_TYPE",
        entity_id=room.id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Updated room type '{room.name}' (Inventory: {room.inventory_count}, Price: INR {room.base_price})."
    )

    return {
        "id": room.id,
        "hotelId": room.hotel_id,
        "name": room.name,
        "description": room.description,
        "bedConfig": room.bed_config,
        "roomSizeSqft": room.room_size_sqft,
        "inventoryCount": room.inventory_count,
        "maxOccupancy": room.max_occupancy,
        "adultCapacity": room.adult_capacity,
        "childCapacity": room.child_capacity,
        "basePrice": room.base_price,
        "extraAdultPrice": room.extra_adult_price,
        "extraChildPrice": room.extra_child_price,
        "amenities": room.amenities or [],
        "status": room.status,
        "createdAt": room.created_at
    }

@router.delete("/rooms/{room_id}")
def delete_room_type(
    room_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_TYPE_ARCHIVE_OWN"))
):
    room = db.query(RoomType).filter(RoomType.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    hotel = db.query(Hotel).filter(Hotel.id == room.hotel_id).first()
    if hotel:
        verify_hotel_ownership(hotel, current_user)
        hotel.room_count = max(0, (hotel.room_count or 0) - (room.inventory_count or 0))

    db.delete(room)
    db.commit()
    return {"message": "Room type deleted successfully", "id": room_id}

# -------------------------------------------------------------
# REAL-TIME AVAILABILITY CALCULATION ENDPOINTS
# -------------------------------------------------------------
@router.get("/{hotel_id}/availability", response_model=HotelAvailabilityResponse)
def get_hotel_availability(
    hotel_id: str,
    check_in: Optional[str] = Query(None, alias="check_in"),
    check_out: Optional[str] = Query(None, alias="check_out"),
    db: Session = Depends(get_db)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    avail_data = calculate_hotel_availability(db, hotel, check_in, check_out)
    return avail_data

@router.get("/room-types/{room_type_id}/availability", response_model=RoomTypeAvailabilityResponse)
def get_room_type_availability_endpoint(
    room_type_id: str,
    check_in: Optional[str] = Query(None, alias="check_in"),
    check_out: Optional[str] = Query(None, alias="check_out"),
    db: Session = Depends(get_db)
):
    room = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    c_in = parse_date_flexible(check_in)
    c_out = parse_date_flexible(check_out)
    return calculate_room_type_availability(db, room, c_in, c_out)

# -------------------------------------------------------------
# INVENTORY BLOCKS & MAINTENANCE MANAGEMENT
# -------------------------------------------------------------
@router.post("/room-types/{room_type_id}/blocks", response_model=RoomInventoryBlockResponse)
def create_inventory_block(
    room_type_id: str,
    request: RoomInventoryBlockCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_AVAILABILITY_UPDATE_OWN"))
):
    room = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    hotel = db.query(Hotel).filter(Hotel.id == room.hotel_id).first()
    if hotel:
        verify_hotel_ownership(hotel, current_user)

    block = RoomInventoryBlock(
        hotel_id=room.hotel_id,
        room_type_id=room.id,
        quantity=request.quantity,
        start_date=request.startDate,
        end_date=request.endDate,
        reason=request.reason.upper(),
        note=request.note,
        status="ACTIVE",
        created_by_user_id=current_user.id
    )
    db.add(block)
    db.commit()
    db.refresh(block)

    log_audit_event(
        db,
        action="ROOM_INVENTORY_BLOCKED",
        entity_type="INVENTORY_BLOCK",
        entity_id=block.id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Blocked {block.quantity} rooms for {room.name} from {block.start_date} to {block.end_date} (Reason: {block.reason})."
    )

    return {
        "id": block.id,
        "hotelId": block.hotel_id,
        "roomTypeId": block.room_type_id,
        "quantity": block.quantity,
        "startDate": block.start_date,
        "endDate": block.end_date,
        "reason": block.reason,
        "note": block.note,
        "status": block.status,
        "createdAt": block.created_at
    }

@router.get("/{hotel_id}/blocks", response_model=List[RoomInventoryBlockResponse])
def get_hotel_inventory_blocks(
    hotel_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_AVAILABILITY_VIEW_OWN"))
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    verify_hotel_ownership(hotel, current_user)
    blocks = db.query(RoomInventoryBlock).filter(
        RoomInventoryBlock.hotel_id == hotel.id,
        RoomInventoryBlock.status == "ACTIVE"
    ).all()

    return [
        {
            "id": b.id,
            "hotelId": b.hotel_id,
            "roomTypeId": b.room_type_id,
            "quantity": b.quantity,
            "startDate": b.start_date,
            "endDate": b.end_date,
            "reason": b.reason,
            "note": b.note,
            "status": b.status,
            "createdAt": b.created_at
        }
        for b in blocks
    ]

@router.delete("/inventory-blocks/{block_id}")
def release_inventory_block(
    block_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_AVAILABILITY_UPDATE_OWN"))
):
    block = db.query(RoomInventoryBlock).filter(RoomInventoryBlock.id == block_id).first()
    if not block:
        raise HTTPException(status_code=404, detail="Inventory block not found")
    
    hotel = db.query(Hotel).filter(Hotel.id == block.hotel_id).first()
    if hotel:
        verify_hotel_ownership(hotel, current_user)

    block.status = "RELEASED"
    db.commit()

    log_audit_event(
        db,
        action="ROOM_INVENTORY_UNBLOCKED",
        entity_type="INVENTORY_BLOCK",
        entity_id=block.id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Released {block.quantity} blocked rooms back to active inventory."
    )

    return {"message": "Inventory block released successfully", "id": block.id}

# -------------------------------------------------------------
# OWNER INVENTORY CONFIRMATION & DASHBOARD SUMMARY
# -------------------------------------------------------------
@router.post("/{hotel_id}/inventory/confirm")
def confirm_hotel_inventory(
    hotel_id: str,
    request: InventoryConfirmRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ROOM_INVENTORY_UPDATE_OWN"))
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    verify_hotel_ownership(hotel, current_user)

    hotel.inventory_confirmed = request.confirmed
    db.commit()

    log_audit_event(
        db,
        action="INVENTORY_CONFIRMED_BY_OWNER",
        entity_type="HOTEL",
        entity_id=hotel.id,
        actor_user_id=current_user.id,
        actor_role=current_user.role,
        description=f"Hotel Owner '{current_user.name}' verified and confirmed room inventory accuracy for {hotel.property_name}."
    )

    return {
        "message": "Hotel room inventory confirmed by owner",
        "hotelId": hotel.id,
        "inventoryConfirmed": hotel.inventory_confirmed
    }

@router.get("/{hotel_id}/dashboard-summary", response_model=HotelDashboardSummaryResponse)
def get_hotel_dashboard_summary(
    hotel_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("HOTEL_VIEW_OWN"))
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    verify_hotel_ownership(hotel, current_user)
    summary = get_hotel_dashboard_metrics(db, hotel)
    return summary
