from fastapi import FastAPI, APIRouter, HTTPException, Depends
from Backend.config.db import conn, users_collection
from Backend.utils import Hash, create_access_token
from fastapi import Request, Depends, Form, HTTPException, status, Response
import requests
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


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
        
        #create access token after successfull login
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

