from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db
from ..login.login import create_access_token
from fastapi import Depends
from ..middleware import get_current_user

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/token", response_model=schemas.TokenData)

def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout():
    # Invalidate the token (you can implement token blacklist logic here)
    return {"message": "Logged out successfully"}


@router.get("/protected-route", response_model=schemas.UserRead)
def protected_route(current_user: schemas.UserRead = Depends(get_current_user)):
    return current_user