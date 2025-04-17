from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_operator: bool
    is_blocked: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class TransactionBase(BaseModel):
    amount: float
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    date: datetime
    is_fraud: bool
    owner_id: int

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    message: str

class NotificationCreate(NotificationBase):
    operator_id: Optional[int] = None

class Notification(NotificationBase):
    id: int
    created_at: datetime
    operator_id: Optional[int]
    is_read: bool

    class Config:
        from_attributes = True

class Verdict(BaseModel):
    is_fraud: bool