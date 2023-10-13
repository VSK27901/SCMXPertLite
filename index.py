from fastapi import FastAPI
from app.routes.login import user as login   # Import the user routers from app routes
from app.routes.password import user as password
from app.routes.shipment import user as shipment
from app.routes.signup import user as signup
from app.routes.devicedata import user as devicedata


# Create a FastAPI instance
app = FastAPI()

app.include_router(login)       # Login Route
app.include_router(password)    # Password-related routes
app.include_router(shipment)    # Shipment-related routes
app.include_router(signup)      # Signup and verification routes
app.include_router(devicedata)  # Device data routes
