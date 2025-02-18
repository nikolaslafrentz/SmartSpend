from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: constr(min_length=8)
    weekly_budget: float = 0.0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    weekly_budget: float
    total_balance: float
    points: int
    created_at: datetime
    
    class Config:
        from_attributes = True
