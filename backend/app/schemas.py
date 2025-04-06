# backend/app/schemas.py

from pydantic import BaseModel
from datetime import date as _date, time as _time


class EventBase(BaseModel):
    title: str
    description: str
    event_type: str
    department: str
    date: _date
    time: _time
    location: str


class EventCreate(EventBase):
    created_by: int


class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    event_type: str | None = None
    department: str | None = None
    date: _date | None = None
    time: _time | None = None
    location: str | None = None


class EventRead(EventBase):
    event_id: int
    created_by: int | None = None

    class Config:
        orm_mode = True
