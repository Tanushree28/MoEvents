# backend/app/routers/events.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db
from typing import List

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

@router.get("/", response_model=List[schemas.EventOut])
def read_events(db: Session = Depends(get_db)):
    return crud.get_all_events(db)
