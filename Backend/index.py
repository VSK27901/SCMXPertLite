from fastapi import FastAPI
from Backend.routes.login import user as login   # Import the user routers from app routes
from Backend.routes.password import user as password
from Backend.routes.shipment import user as shipment
from Backend.routes.signup import user as signup
from Backend.routes.devicedata import user as devicedata
from fastapi.middleware.cors import CORSMiddleware

# Create a FastAPI instance
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
]

# Configure CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login)       # Login Route
app.include_router(password)    # Password-related routes
app.include_router(shipment)    # Shipment-related routes
app.include_router(signup)      # Signup and verification routes
app.include_router(devicedata)  # Device data routes


