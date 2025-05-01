from datetime import datetime, timezone
import logging
from fastapi import HTTPException, status
from pydantic import ValidationError, validate_email
from pymysql import DatabaseError
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import bcrypt
from sqlalchemy import func

from backend.app.schemas import EventCreate, EventRead, EventUpdate, UserCreate
from backend.app.models import Event, Registration, TokenBlacList
from backend.app.schemas import RegistrationCreate
from backend.app.models import User

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


def create_registration(db: Session, registration: RegistrationCreate):
    try:
        # Check if event exists
        event = db.query(Event).filter(Event.event_id == registration.event_id).first()
        if not event:
            raise ValueError(f"Event with ID {registration.event_id} does not exist.")

        # Check if user exists
        user = db.query(User).filter(User.user_id == registration.user_id).first()
        if not user:
            raise ValueError(f"User with ID {registration.user_id} does not exist.")

        # Optional: Check if already registered
        existing = db.query(Registration).filter(
            Registration.event_id == registration.event_id,
            Registration.user_id == registration.user_id
        ).first()
        if existing:
            raise ValueError("User is already registered for this event.")

        # Create the registration
        reg = Registration(
            event_id=registration.event_id,
            user_id=registration.user_id,
        )
        db.add(reg)
        db.commit()
        db.refresh(reg)

        return reg

    except ValueError as ve:
        logger.warning(f"Validation error: {ve}")
        raise ve

    except DatabaseError as e:
        db.rollback()
        logger.error(f"Database error creating registration: {e}")
        raise e


def get_all_registrations(db: Session):
    return db.query(Registration).all()


def get_registration_by_id(db: Session, id: int) -> Registration:
    try:
        registration = (
            db.query(Registration).filter(Registration.registration_id == id).first()
        )
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
    try:
        # Normalize inputs
        username = user.username.strip().lower()

        # Checking for user existence
        if db.query(User).filter_by(name=username).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Username already exists"
            )

        # Check if email exists
        if db.query(User).filter_by(email=user.email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
            )

        # Hash the password
        hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())

        # Create user record
        db_user = User(
            name=user.username,
            password=hashed_password.decode("utf-8"),
            email=user.email,
            role="student",
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format",
        )
    except IntegrityError as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database integrity error",
        )
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )


def get_user_by_username(db: Session, username: str) -> User:
    try:
        validate_email(username)
        return db.query(User).filter(User.email == username).first()
    except ValueError:
        return db.query(User).filter(User.name == username).first()


def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


# User Register for an event API crud
def register_user_for_event(db: Session, user_id: int, event_id: int):
    registration = Registration(user_id=user_id, event_id=event_id)
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration

# Upcoming Events Schedule also consider situation when given date has no events
def get_upcoming_events(db: Session, date: str):
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        events = db.query(Event).filter(Event.date == date_obj).distinct()
        if not events:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No upcoming events found"
            )
        return events
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format"
        )
    except SQLAlchemyError as e:
        logger.error(f"Error fetching events: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )
    

################################
######## Token blacklist #######
################################
def revoke_jti(db: Session, jti: str, expires_at: datetime):
    db.merge(TokenBlacList(jti=jti, expires_at=expires_at))
    db.commit()


def is_jti_revoked(db: Session, jti: str) -> bool:
    return db.query(TokenBlacList).filter(TokenBlacList.jti == jti).first() is not None


def prune_expired_jtis(db: Session):
    db.query(TokenBlacList).filter(
        TokenBlacList.expires_at < datetime.now(timezone.utc)
    ).delete(synchronize_session=False)
    db.commit()

################################
######## Visulization Panel #######
################################

def count_upcoming_events(db: Session, date: str):
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        count = db.query(Event).filter(Event.date >= date_obj).count()
        return {"count": count}
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format")
    except SQLAlchemyError as e:
        logger.error(f"Error fetching events: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")

def count_registrations_per_event(db: Session):
    try:
        results = (
            db.query(Event.title, func.count(Registration.registration_id).label("registration_count"))
            .join(Registration, Event.event_id == Registration.event_id)
            .group_by(Event.event_id, Event.title)
            .all()
        )
        return {"data": [{"title": r[0], "registration_count": r[1]} for r in results]}
    except SQLAlchemyError as e:
        logger.error(f"Error fetching registrations: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")

def count_all_events(db: Session):
    try:
        count = db.query(Event).count()
        return {"count": count}
    except SQLAlchemyError as e:
        logger.error(f"Error fetching total events: {e}")
        raise HTTPException(status_code=500, detail="Database error")
