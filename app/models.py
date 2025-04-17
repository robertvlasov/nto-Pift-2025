from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_operator = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)

    transactions = relationship("Transaction", back_populates="owner")
    notifications = relationship("Notification", back_populates="operator")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    is_fraud = Column(Boolean, default=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="transactions")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    operator_id = Column(Integer, ForeignKey("users.id"))
    is_read = Column(Boolean, default=False)

    operator = relationship("User", back_populates="notifications")