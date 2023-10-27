from fastapi import APIRouter, HTTPException, Depends, status
from Backend.models.models import UserCreateShipment
from Backend.config.db import conn, users_collection, shipments_collection
from Backend.utils import get_current_user
from datetime import date
from pydantic import EmailStr
from fastapi import Request, Response
from fastapi.responses import JSONResponse


# To create an instance of APIRouter for user-related routes
user = APIRouter()


###### ----------Route for Createshipment----------######

@user.post("/createshipment", response_model=dict)
async def createshipment(request: Request, user_ship: UserCreateShipment, 
                            current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        # Check if the shipment is already registered
        existing_shipment = shipments_collection.find_one({"shipment_no": user_ship.shipment_no})

        if existing_shipment:
            raise HTTPException(status_code=400, detail="Shipment already exists")

        # creation date/time
        creation_date = str(date.today())

        new_shipment = {
                "username": current_user["username"],
                "email": current_user["email"],  
                "shipment_no": user_ship.shipment_no,
                "route_details": user_ship.route_details,
                "device": user_ship.device,
                "po_no": user_ship.po_no,
                "ndc_no": user_ship.ndc_no,
                "serial_no": user_ship.serial_no,
                "container_no": user_ship.container_no,
                "goods_type": user_ship.goods_type,
                "expected_delivery": user_ship.expected_delivery,
                "delivery_no": user_ship.delivery_no,
                "batch_id": user_ship.batch_id,
                "shipment_des": user_ship.shipment_des,
                "creation_date": creation_date
            }

        # Insert the new shipment into the MongoDB collection
        shipments_collection.insert_one(new_shipment)  # Fixed this line

        # raise HTTPException(status_code=200, detail="Shipment Created Successfully")
        return {"message": "Shipment Created Successfully"}

    except HTTPException as http_error:

        if http_error.detail == "Not authenticated":
            raise HTTPException(status_code=400, detail=http_error.detail)

        if http_error.detail == "Shipment already exists":
            raise HTTPException(status_code=400, detail=http_error.detail)
        raise http_error  

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


###### ----------route to display my shipment page after shipment created successfully----------######

@user.get("/myshipment", response_model=list)
async def myshipment(request: Request, current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        user_shipments = list(shipments_collection.find({"username":current_user["username"] },{"_id":0}))

        return JSONResponse(content=user_shipments)
    except HTTPException as http_error:
        if http_error.detail == "Not authenticated":
            raise HTTPException(status_code=400, detail=http_error.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


###### ----------route to view all shipments from the db(Only admins are allowed)----------######

@user.get("/viewallshipments", response_model=list[dict])
async def viewallshipments(request: Request, current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        # Fetch shipment data from the MongoDB collection
        user_shipments = shipments_collection.find({})

        role = current_user.get('role')

        # Check if the user has the 'admin' role, if not, return an error message
        if role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can access")

        user_shipments = list(shipments_collection.find({},{"_id":0}))

        return JSONResponse(content=user_shipments)
    
    except HTTPException as http_error:
        if http_error.detail == "Not authenticated":
            raise HTTPException(status_code=400, detail=http_error.detail)
        raise http_error
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")


