from sqlalchemy.orm import Session
from .models import Event, EventCreate, EventOut

# Create a new event
def create_event(db: Session, event: EventCreate):
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Get all events
def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

# Get event by ID
def get_event_by_id(db: Session, event_id: int):
    return db.query(Event).filter(Event.event_id == event_id).first()

# Update an event
def update_event(db: Session, event_id: int, event: EventCreate):
    db_event = db.query(Event).filter(Event.event_id == event_id).first()
    if db_event:
        for key, value in event.dict().items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event

# Delete an event
def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(Event.event_id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event
