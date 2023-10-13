from fastapi import APIRouter, HTTPException, Depends
from app.models.models import UserResetPass, UserForgotPassword, User, UserUpdatePassword
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


# To create an instance of APIRouter for user-related routes
user = APIRouter()



###### ----------Route for forgot password page----------######

@user.post("/forgotpassword", response_model=dict)
async def forgotpassword(request: Request, user_forgot_password: UserForgotPassword):
    try:
        user = users_collection.find_one({'email': user_forgot_password.email})
        if user:
            # Generate a reset password token
            reset_password_token = secrets.token_urlsafe(16)

            # Store the reset password token and user's email in the database
            reset_password_data = {
                "email": user_forgot_password.email,
                "reset_password_token": reset_password_token,
            }

            users_collection.update_one( {"email": user_forgot_password.email}, {"$set": {"reset_password_token": reset_password_token}})

            # Send the reset password email with the token
            # Function to send the email
            send_passreset_email(user_forgot_password.email, reset_password_token)
            return{"message":"Password reset email has been sent to your mail id"}

        else:
            raise HTTPException(status_code=400, detail="Email id not registered")

    except HTTPException as http_error:
        if http_error.detail == "Email id not registered":
            raise HTTPException(status_code=400, detail=http_error.detail)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")


###### ----------Route for reset password----------######

@user.post("/resetpassword", response_model=dict)
async def resetpassword(request: Request, user_reset_password: UserResetPass):
    try:
        # Check if the reset password token exists in the database
        reset_password_data = users_collection.find_one(
            {"reset_password_token": user_reset_password.token})

        if not reset_password_data:
            raise HTTPException(status_code=400, detail="Invalid reset password token")

        email = reset_password_data["email"]

        # Validate password requirements
        if not re.search(r"[A-Z]", user_reset_password.new_password):
            raise HTTPException(status_code=400, detail="Password must contain at least 8 characters, including one uppercase letter, one digit, and one special character")
        if not re.search(r"\d", user_reset_password.new_password):
            raise HTTPException(status_code=400, detail="Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>-_+=]", user_reset_password.new_password):
            raise HTTPException(status_code=400, detail="Password must contain at least one special character")
        if len(user_reset_password.new_password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

        # Check if the new passwords match
        if user_reset_password.new_password != user_reset_password.confirm_new_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Hash the new password
        hashed_password = Hash.hash_password(user_reset_password.new_password)

        # Update the user's password
        users_collection.update_one(
            {"email": email}, {"$set": {"password": hashed_password, "reset_password_token":None}})

        # Delete the reset password data by token
        users_collection.delete_one({"reset_password_token": user_reset_password.token})

        return {"message": "Password reset successful"}


    except HTTPException as http_error:
        if http_error.detail == "Invalid reset password token":
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
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")


###### ----------Route for updatepassword----------######

@user.post("/updatepassword", response_model=dict)
async def updatepassword(request: Request, user_update: UserUpdatePassword, current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        # Retrieve the user's email from the current user data
        email = current_user.get("email")

        # Check if the old password matches the user's current password
        user = users_collection.find_one({"email": email})
        if not Hash.verify_password(user_update.oldpassword, user["password"]):
            raise HTTPException(status_code=400, detail="Incorrect old password")

        # Validate password requirements
        if not re.search(r"[A-Z]", user_update.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
        if not re.search(r"\d", user_update.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>-_+=]", user_update.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one special character")
        if len(user_update.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

        # Check if new passwords match
        if user_update.password != user_update.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Hash the new password
        hashed_password = Hash.hash_password(user_update.password)

        # Update the user's password in the database
        users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

        return {"message": "Password Changed Successfully"}

    except HTTPException as http_error:
        if http_error.detail == "Incorrect old password":
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
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")
