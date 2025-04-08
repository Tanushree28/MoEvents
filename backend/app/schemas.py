from pydantic import BaseModel
from datetime import date as _date, time as _time

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True
class TokenData(BaseModel):
    username: str | None = None

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

class EventDelete(BaseModel):
    event_id: int
    deleted: bool = True

    class Config:
        orm_mode = True

class RegistrationBase(BaseModel):
    user_id: int
    event_id: int

class RegistrationCreate(RegistrationBase):
    pass

class RegistrationRead(RegistrationBase):
    registration_id: int

    class Config:
        orm_mode = True

