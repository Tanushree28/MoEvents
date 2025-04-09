from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/registration", tags=["Registrations"])

@router.post("/", response_model=schemas.RegistrationCreate)
def create_registration(
    registration: schemas.RegistrationCreate,
    db: Session = Depends(get_db),
):
    return crud.create_registration(db, registration)

@router.get("/", response_model=list[schemas.RegistrationCreate])
def get_all_registrations(db: Session = Depends(get_db)):
    return crud.get_all_registrations(db)

@router.get("/{id}", response_model=schemas.RegistrationCreate)
def get_registration_by_id(id: int, db: Session = Depends(get_db)):
    return crud.get_registration_by_id(db, id) 

# User Register for an event API
@router.post("/user_event", response_model=schemas.UserRegisterEvent)
def register_user_for_event(
    registration: schemas.UserRegisterEvent,
    db: Session = Depends(get_db),
):
    return crud.register_user_for_event(db, registration.user_id, registration.event_id)