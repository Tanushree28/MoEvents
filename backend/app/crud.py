# backend/app/crud.py

from sqlalchemy.orm import Session
from .models import Event

# Fetch all events
def get_all_events(db: Session):
    return db.query(Event).all()
