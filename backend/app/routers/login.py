from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app import schemas, crud
from backend.app.database import get_db
from backend.app.login.login import authenticate_user
from backend.app.middleware import get_current_user


router = APIRouter(prefix="/auth", tags=["Login"])


@router.post("/login", response_model=schemas.LoginResponse)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    token = authenticate_user(user, db)
    return {"token": token, "type": "bearer"}


@router.post("/signup", response_model=schemas.UserBase)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db, user)
    return {"username": user.name, "email": user.email}


@router.post("/logout")
def logout():
    # Invalidate the token (you can implement token blacklist logic here)
    return {"message": "Logged out successfully"}


@router.get("/protected-route", response_model=schemas.UserRead)
def protected_route(current_user: schemas.UserRead = Depends(get_current_user)):
    return current_user
