from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db
from backend.app.utils.dependencies import admin_required

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/", response_model=schemas.EventCreate)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    # current_admin = Depends(admin_required)
):
    # event.admin_id = current_admin.user_id
    return crud.create_event(db, event)


@router.get("/", response_model=list[schemas.EventRead])
def read_events(db: Session = Depends(get_db)):
    return crud.get_all_events(db)


@router.get("/{id}", response_model=schemas.EventRead)
def get_event_by_id(id: int, db: Session = Depends(get_db)):
    return crud.get_event_by_id(db, id)


@router.put("/{id}", response_model=schemas.EventRead)
def update_event(id: int, event: schemas.EventUpdate, db: Session = Depends(get_db)):
    return crud.update_event_by_id(db, id, event)

@router.delete("/{id}", response_model=schemas.EventRead)
def delete_event(id: int, db: Session = Depends(get_db)):
    return crud.delete_event_by_id(db, id)

@router.get("/upcoming/{date}", response_model=list[schemas.EventRead])
def get_upcoming_events(date: str, db: Session = Depends(get_db)):
    return crud.get_upcoming_events(db, date)

