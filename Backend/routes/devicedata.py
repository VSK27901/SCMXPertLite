from fastapi import APIRouter, HTTPException, Depends, Query
from Backend.models.models import User, UserDeviceData, UserDeviceid
from Backend.config.db import conn, device_collection
from Backend.utils import get_current_user
from fastapi import Request, Depends, Form, HTTPException, status, Response
from fastapi.responses import RedirectResponse, JSONResponse
import requests
from typing import List


user = APIRouter()

# http://127.0.0.1:8000/devicedata?page=2&items_per_page=5

###### ----------Route for devicedata----------######

@user.get("/devicedata", response_model=list)
async def devicedata(
    page: int = Query(1, description="Page number", gt=0),
    items_per_page: int = Query(5, description="Items per page", gt=0, le=100),
    device_id: str = Query(..., description="Device ID"),
    current_user: dict = Depends(get_current_user)):

    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        # print(current_user)

        # Get the role of the current user
        role = current_user.get('role')
        # print(role)

        # Check if the user has the 'admin' role, if not, return an error message
        if role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can access")
        # Calculate the number of documents to skip
        skip = (page - 1) * items_per_page

        # Fetch paginated items from MongoDB
        device_data = list(device_collection.find({"Device_Id": int(device_id)}, {"_id":0}).skip(skip).limit(items_per_page))
        # print(device_data)
        paginated_items = [UserDeviceData(**device_data) for device_data in device_data]
        # print(paginated_items)
        return JSONResponse(content=device_data)
    
    except HTTPException as http_error:
        if http_error.detail == "Not authenticated":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        raise http_error  
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")