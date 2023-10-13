from pydantic import BaseModel, EmailStr, Field
from fastapi import Form


class UserCreate(BaseModel):
    username: str 
    email: EmailStr 
    password: str
    confirm_password: str
    role: str = Field(default="User") 

class User(BaseModel):
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserForgotPassword(BaseModel):
    email: EmailStr

class UserResetPass(BaseModel):
    token: str
    new_password: str
    confirm_new_password: str

class UserUpdatePassword(BaseModel):
    oldpassword: str 
    password: str
    confirm_password: str


class UserCreateShipment(BaseModel):
    shipment_no: str 
    route_details: str 
    device: str
    po_no: str 
    ndc_no: str 
    serial_no: str
    container_no: str 
    goods_type: str
    expected_delivery: str 
    delivery_no: str 
    batch_id: str 
    shipment_des: str 

class UserDeviceData(BaseModel):
    Battery_Level: float
    Device_Id: int
    First_Sensor_temperature: float
    Route_From: str
    Route_To: str

class Shipment_Data(BaseModel):
    Shipment_Invoice_Number: str
    Device: str
    Goods_Type: str
    Route_Details: str
    Expected_Delivery_Date: str
    






