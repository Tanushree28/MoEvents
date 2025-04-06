# backend/app/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(1000))
    event_type = Column(String(100))
    department = Column(String(100))
    date = Column(Date)
    time = Column(Time)
    location = Column(String(255))
    created_by = Column(Integer, ForeignKey("users.user_id"))
