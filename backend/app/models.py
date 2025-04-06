# backend/app/models.py

from sqlalchemy import Column, Integer, String, Text, Enum, Date, Time, ForeignKey
from .database import Base
import enum


# Enum for user role
class UserRole(enum.Enum):
    student = "student"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)


class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    location = Column(String(255), nullable=False)
    created_by = Column(Integer, ForeignKey("users.user_id"))


class Registration(Base):
    __tablename__ = "registrations"

    registration_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    event_id = Column(Integer, ForeignKey("events.event_id"))


class Feedback(Base):
    __tablename__ = "feedbacks"

    feedback_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    event_id = Column(Integer, ForeignKey("events.event_id"))
    rating = Column(Integer)
    comment = Column(Text)
