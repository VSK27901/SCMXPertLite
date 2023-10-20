from fastapi import APIRouter, HTTPException, Depends
from Backend.models.models import  UserUpdateRole, UserList
from Backend.config.db import conn, users_collection
from Backend.utils import Hash, create_access_token, get_current_user, decode_token
from bson import ObjectId
from datetime import timedelta
from pydantic import EmailStr
from fastapi import Request, Depends, Form, HTTPException, status, Response
from jose import jwt, JWTError
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
import re
import requests
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import secrets


user = APIRouter()

###### ----------Route for updating user role ----------######
###### ----------myaccount --> update user role ----------######

@user.post("/updaterole", response_model=dict)
async def updaterole(request: Request, User_role: UserUpdateRole, 
                                            current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        user = users_collection.find_one({"email": User_role.email})

        if user is None:
            raise HTTPException(status_code=400, detail="User not found")

        # Get the role of the current user
        role = current_user.get('role')

        # Check if the user has the 'admin' role, if not, return an error message
        if role != "admin":
            raise HTTPException(status_code=405, detail= "Not Allowed!")

        # Update the user's role in the database
        users_collection.update_one({"email": User_role.email}, {"$set": {"role": User_role.newrole}})


        return {"message": "User Role Updated Successfully"}

    except HTTPException as http_error:
        if http_error.detail == "Not authenticated":
            raise HTTPException(status_code=400, detail=http_error.detail)
        if http_error.detail == "User not found":
            raise HTTPException(status_code=400, detail=http_error.detail)
        if http_error.detail == "Not Allowed!":
            raise HTTPException(status_code=400, detail=http_error.detail)
        raise http_error  
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")


###### ----------route to get myaccount page in the dashboard----------######

@user.get("/myaccount", response_model=dict)  
async def myaccount(request: Request, current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        # Fetch user account data from the database
        user_data = users_collection.find_one({"email": current_user["email"]}, {"_id": 0})

        if user_data is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Extract username, email, role, creation_date, and creation_time from the user data
        user={
                "username":user_data["username"],
                "email":user_data["email"],
                "role":user_data["role"],
                "creation_date":user_data["creation_date"],
                "creation_time":user_data["creation_time"]
            }    
        return user  
    except HTTPException as http_error:
        if http_error.detail == "Not authenticated":
            raise HTTPException(status_code=400, detail=http_error.detail)
        if http_error.detail == "User not found":
            raise HTTPException(status_code=400, detail=http_error.detail)
        raise http_error  
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")


###### ----------To display all user(only admins can see)----------######

@user.get("/userslist", response_model=list)
async def userslist(request: Request, current_user: dict = Depends(get_current_user)):
    try:
        if current_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        # Fetch user account data from the database
        user_db = users_collection.find({})

        role = current_user.get('role')

        # Check if the user has the 'admin' role, if not, return an error message
        if role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can access")

        # Create a list to store user information
        user_list = []

        for user_data in user_db:
            user = {
                "username": user_data.get("username"),
                "email": user_data.get("email"),
                "role": user_data.get("role"),
                "creation_date": user_data.get("creation_date"),
                "creation_time": user_data.get("creation_time")
            }
            user_list.append(user)

        return user_list

    except HTTPException as http_error:
        if http_error.detail == "Not authenticated":
            raise HTTPException(status_code=400, detail=http_error.detail)
        raise http_error
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")