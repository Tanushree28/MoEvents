# backend/app/schemas.py

from pydantic import BaseModel
from typing import Optional
from datetime import date, time


class EventBase(BaseModel):
    title: str
    description: str
    event_type: str
    department: str
    date: date
    time: time
    location: str


class EventCreate(EventBase):
    created_by: int


class EventOut(EventBase):
    event_id: int
    created_by: Optional[int]

    class Config:
        orm_mode = True
