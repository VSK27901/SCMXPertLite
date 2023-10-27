from fastapi import APIRouter, HTTPException, Depends, Query
from Backend.models.models import UserCreate
from Backend.config.db import conn, users_collection, verification_collection
from Backend.utils import Hash, create_access_token, get_current_user, decode_token
from datetime import timedelta
from fastapi import Request, Depends, Form, HTTPException, status, Response
from jose import jwt, JWTError
from fastapi.responses import HTMLResponse, RedirectResponse
import re
import requests
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from Backend.email.emailver import send_verification_email
import secrets
from datetime import datetime, date


# To create an instance of APIRouter for user-related routes
user = APIRouter()


###### ----------Route for signup page----------######

@user.post("/signup", response_model=dict)
async def signup(request: Request, user_create: UserCreate):
    try:
        # Check if the username is available
        existing_user = users_collection.find_one({"username": user_create.username})  # db query
        # Check if the email is already registered
        existing_email = users_collection.find_one({"email": user_create.email})  # db query
        if existing_user:
            raise HTTPException(
                status_code=400, detail="Username already used")
        if existing_email:
            raise HTTPException(
                status_code=400, detail="Email already registered")
        # Confirm pass
        if user_create.password != user_create.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Validate password requirements
        if not re.search(r"[A-Z]", user_create.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
        # \d Matches any digit character. Equivalent to [0-9].
        if not re.search(r"\d", user_create.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", user_create.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one special character")
        if len(user_create.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

        # Hash the password
        hashed_password = Hash.hash_password(user_create.password)

        # Generate a verification token
        verification_token = secrets.token_urlsafe(16)

        # creation date/time
        creation_date = str(date.today())

        # Store the current time in HH:MM:SS format
        creation_time = datetime.now().time().strftime("%H:%M:%S")

        # Store the verification token and user's email in the database
        verification_data = {
            "username": user_create.username,
            "email": user_create.email,
            "password": hashed_password,
            "verification_token": verification_token,
            "creation_date": creation_date,
            "creation_time": creation_time

        }

        # Insert into verification_collection
        verification_collection.insert_one(verification_data)

        # Send the verification email with the token
        # Function to send the email
        send_verification_email(user_create.username, user_create.email, verification_token)

        return{"message":"Verify your Mail id"}

    except HTTPException as http_error:
        if http_error.detail == "Email already registered":
            raise HTTPException(status_code=400, detail=http_error.detail)
        if http_error.detail == "Passwords do not match":
            raise HTTPException(status_code=400, detail=http_error.detail)
        if http_error.detail == "Password must contain at least one uppercase letter":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        if http_error.detail == "Password must contain at least one digit":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        if http_error.detail == "Password must contain at least one special character":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        if http_error.detail == "Password must be at least 8 characters long":
            raise HTTPException(
                status_code=400, detail=http_error.detail)
        raise http_error  
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")



###### ----------Check if the email is verified and then push the user details to main db----------######

@user.get("/verification", response_model=dict)
async def verification(request: Request, token: str = Query(...)):
    try:
        # Check if the verification token exists in the database
        verification_data = verification_collection.find_one({"verification_token": token})

        if not verification_data:
            raise HTTPException(
                status_code=400, detail="Invalid verification token")

        # Mark the email as verified (you can update the user's status in the database)
        users_collection.update_one({"email": verification_data["email"]}, {
                                    "$set": {"verified": True}})

        # Delete the verification token from the database
        verification_collection.delete_one({"verification_token": token})

        # Now that the email is verified, insert the user's data into the database(after verfication)
        new_user = {
            "username": verification_data["username"],
            "email": verification_data["email"],
            "password": verification_data["password"],
            "role": "User",
            "verified": True,  # Set the verified status to True
            "creation_date": verification_data["creation_date"],
            "creation_time": verification_data["creation_time"]

        }

        users_collection.insert_one(new_user)

        return{"message":"User Verified Successsfully"}

    except HTTPException as http_error:
        if http_error.detail == "Invalid verification token":
            raise HTTPException(status_code=400, detail=http_error.detail)
        raise http_error  
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")
