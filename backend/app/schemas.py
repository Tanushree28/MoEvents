from fastapi import HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator, validate_email
from datetime import date as _date, time as _time
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserLogin(BaseModel):
    username: str
    password: str

    @field_validator("username")
    def validate_user_or_email(cls, value):
        # If not '@' then it is plain username
        if "@" not in value:
            return value

        # If '@' is present then is email
        try:
            validate_email(value)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email format"
            )

        return value


class UserCreate(UserBase):
    password: str
    verify_password: str


class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True


class TokenData(BaseModel):
    username: str | None = None


class LoginResponse(BaseModel):
    token: str
    type: str


class EventBase(BaseModel):
    title: str
    description: str
    event_type: str
    department: str
    date: _date
    time: _time
    location: str


class EventCreate(EventBase):
    # created_by: int
    created_by: Optional[int] = None


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


# User Register for an event API schema
class UserRegisterEvent(BaseModel):
    event_id: int
    user_id: int

    class Config:
        orm_mode = True
