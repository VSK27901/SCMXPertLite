from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.models import User, UserDeviceData
from app.config.db import conn, users_collection, shipments_collection, device_collection, verification_collection
from app.utils import Hash, create_access_token, get_current_user, decode_token
from bson import ObjectId
from datetime import timedelta
from pydantic import EmailStr
from fastapi import Request, Depends, Form, HTTPException, status, Cookie, Response
from jose import jwt, JWTError
from fastapi.responses import HTMLResponse, RedirectResponse
import re
import requests
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.email.emailver import send_verification_email
from app.email.resetpass import send_passreset_email
import secrets
from datetime import datetime, date


user = APIRouter()



###### ----------Route for devicedata----------######

@user.get("/devicedata", response_model=dict)
async def get_paginated_items(
    page: int = Query(1, description="Page number", gt=0),
    items_per_page: int = Query(10, description="Items per page", gt=0, le=100),
):

    try:
        # Calculate the number of documents to skip
        skip = (page - 1) * items_per_page

        # Fetch paginated items from MongoDB
        device_data = list(device_collection.find({}).skip(skip).limit(items_per_page))
        # Transform MongoDB documents to Pydantic models
        paginated_items = [UserDeviceData(**device_data) for device_data in device_data]

        return paginated_items
    
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")
