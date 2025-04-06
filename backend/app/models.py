# backend/app/models.py

from sqlalchemy import Column, Integer, String, Text, Enum, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import enum

# Enum for user role
class UserRole(enum.Enum):
    student = "student"
    admin = "admin"

class User(Base):
    __tablename__ = "Users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    events = relationship("Event", back_populates="creator")
    registrations = relationship("Registration", back_populates="user")
    feedbacks = relationship("Feedback", back_populates="user")

class Event(Base):
    __tablename__ = "Events"

    event_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    location = Column(String(255), nullable=False)
    created_by = Column(Integer, ForeignKey("Users.user_id"))

    creator = relationship("User", back_populates="events")
    registrations = relationship("Registration", back_populates="event")
    feedbacks = relationship("Feedback", back_populates="event")

class Registration(Base):
    __tablename__ = "Registrations"

    registration_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"))
    event_id = Column(Integer, ForeignKey("Events.event_id"))

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")

class Feedback(Base):
    __tablename__ = "Feedback"

    feedback_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"))
    event_id = Column(Integer, ForeignKey("Events.event_id"))
    rating = Column(Integer)
    comment = Column(Text)

    user = relationship("User", back_populates="feedbacks")
    event = relationship("Event", back_populates="feedbacks")
