# Changes made by @MdFarhanAhmad
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Import API v1 routers
from app.api.v1 import (
    auth,
    users,
    hotels,
    vehicles,
    trips,
    cart,
    bookings,
    transactions,
    admin,
    analytics,
    notifications,
    partner,
    tour_operator,
    transport_admin,
    custom_journeys
)
from app.db.database import engine, Base, SessionLocal
import app.db.models
from app.services.rbac_service import seed_rbac_data
from app.websocket.ws_manager import ws_manager

# Ensure all database tables exist and RBAC seed data is initialized
Base.metadata.create_all(bind=engine)
_init_db = SessionLocal()
try:
    seed_rbac_data(_init_db)
finally:
    _init_db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_rbac_data(db)
    finally:
        db.close()

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")
os.makedirs(os.path.join(UPLOADS_DIR, "hotels"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include v1 REST routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(hotels.router, prefix=settings.API_V1_STR)
app.include_router(vehicles.router, prefix=settings.API_V1_STR)
app.include_router(trips.router, prefix=settings.API_V1_STR)
app.include_router(cart.router, prefix=settings.API_V1_STR)
app.include_router(bookings.router, prefix=settings.API_V1_STR)
app.include_router(transactions.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(partner.router, prefix=settings.API_V1_STR)
app.include_router(tour_operator.router, prefix=settings.API_V1_STR)
app.include_router(transport_admin.router, prefix=settings.API_V1_STR)
app.include_router(custom_journeys.router, prefix=settings.API_V1_STR)

# Direct top-level endpoints for frontend compatibility
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(hotels.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(partner.router, prefix="/api")
app.include_router(tour_operator.router, prefix="/api")
app.include_router(transport_admin.router, prefix="/api")
app.include_router(custom_journeys.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": "YatraSync Indian Travel Platform API",
        "database": f"PostgreSQL ({settings.PG_HOST}:{settings.PG_PORT}/{settings.PG_DB})",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.websocket("/ws")
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str = None):
    await ws_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo heartbeat or process message
            await ws_manager.send_personal_message({"status": "acknowledged", "received": data}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, user_id)
