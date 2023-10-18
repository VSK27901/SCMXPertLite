from fastapi import APIRouter, HTTPException, Depends, Query
from Backend.models.models import UserCreate, User, UserLogin, UserForgotPassword, UserCreateShipment
from Backend.config.db import conn, users_collection, shipments_collection, device_collection, verification_collection
from Backend.utils import Hash, create_access_token,  get_current_user, decode_token
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
import secrets
from datetime import datetime, date
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()




# To create an instance of APIRouter for user-related routes
user = APIRouter()


###### ----------Route for login page----------######

@user.post("/login", response_model=dict)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = users_collection.find_one({"email": form_data.username})

        if user is None:
            raise HTTPException(status_code=400, detail="User not found")

        if not Hash.verify_password(form_data.password, user["password"]):
            raise HTTPException(status_code=400, detail="Incorrect Password")

        current_user = {
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
        
        access_token = create_access_token(data={"sub": user["username"], "email": user["email"]})
        
        return {"access_token": access_token, "current_user": current_user}

    except HTTPException as http_error:
        if http_error.detail == "User not found":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        if http_error.detail == "Incorrect Password":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        raise http_error  
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")

