from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models
from .database import SessionLocal

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI app instance
app = FastAPI()

# Create an event
@app.post("/events/", response_model=models.EventOut)
def create_event(event: models.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db=db, event=event)

# Get all events
@app.get("/events/", response_model=list[models.EventOut])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_events(db=db, skip=skip, limit=limit)

# Get event by ID
@app.get("/events/{event_id}", response_model=models.EventOut)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event_by_id(db=db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

# Update an event
@app.put("/events/{event_id}", response_model=models.EventOut)
def update_event(event_id: int, event: models.EventCreate, db: Session = Depends(get_db)):
    db_event = crud.update_event(db=db, event_id=event_id, event=event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

# Delete an event
@app.delete("/events/{event_id}", response_model=models.EventOut)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.delete_event(db=db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

