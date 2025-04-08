import logging
from fastapi import HTTPException, status
from pymysql import DatabaseError
from sqlalchemy.orm import Session
import bcrypt

from backend.app.schemas import EventCreate, EventRead, EventUpdate
from backend.app.models import Registration
from backend.app.schemas import RegistrationCreate
from backend.app.models import User
from .schemas import UserCreate
from .models import Event

logger = logging.getLogger(__name__)

# EVENTS CRUD operations
def create_event(db: Session, event: EventCreate):
    try:
        event = Event(
            title=event.title,
            description=event.description,
            event_type=event.event_type,
            department=event.department,
            date=event.date,
            time=event.time,
            location=event.location,
        )
        db.add(event)
        db.commit()
        db.refresh(event)

        return event
    except DatabaseError as e:
        logger.error(f"Error creating event: {e}")
        raise e


# Fetch all events
def get_all_events(db: Session):
    return db.query(Event).all()


def get_event_by_id(db: Session, id: int) -> EventRead:
    try:
        event = db.query(Event).filter(Event.event_id == id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )

        return event
    except DatabaseError as e:
        logger.error(f"Error updating event: {e}")
        raise


def update_event_by_id(db: Session, id: int, event_update: EventUpdate) -> EventRead:
    try:
        existing_event = get_event_by_id(db, id)

        # Only update fields that are set in the request
        update_data = event_update.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(existing_event, field, value)

        db.commit()
        db.refresh(existing_event)
        return existing_event

    except DatabaseError as e:
        logger.error(f"Error updating event: {e}")
        raise


def delete_event_by_id(db: Session, id: int) -> EventRead:
    try:
        event = get_event_by_id(db, id)
        db.delete(event)
        db.commit()
        return event
    except DatabaseError as e:
        logger.error(f"Error deleting event: {e}")
        raise e
    
# Registration CRUD operations

def create_registration(db: Session, registration: RegistrationCreate):
    try:
        registration = Registration(
            event_id=registration.event_id,
            user_id=registration.user_id,
            status=registration.status,
        )
        db.add(registration)
        db.commit()
        db.refresh(registration)

        return registration
    except DatabaseError as e:
        logger.error(f"Error creating registration: {e}")
        raise e

def get_all_registrations(db: Session):
    return db.query(Registration).all()

def get_registration_by_id(db: Session, id: int) -> Registration:
    try:
        registration = db.query(Registration).filter(Registration.registration_id == id).first()
        if not registration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found"
            )

        return registration
    except DatabaseError as e:
        logger.error(f"Error updating registration: {e}")
        raise



# Login
def create_user(db: Session, user: UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = User(username=user.username, hashed_password=hashed_password, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
