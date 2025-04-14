from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/visuals", tags=["Visualtizations"])

@router.get("/event_count", response_model=schemas.UpcomingEventCountResponse)
def get_upcoming_event_count(date: str, db: Session = Depends(get_db)):
    return crud.count_upcoming_events(db, date)

@router.get("/registrations_per_event", response_model=schemas.RegistrationsPerEventResponse)
def get_registrations_per_event(db: Session = Depends(get_db)):
    return crud.count_registrations_per_event(db)

@router.get("/total_events", response_model=schemas.EventCountResponse)
def get_total_event_count(db: Session = Depends(get_db)):
    return crud.count_all_events(db)