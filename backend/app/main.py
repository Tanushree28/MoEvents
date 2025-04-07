from fastapi import FastAPI
from .routers import events, registrations
from .database import engine
from .models import Base

app = FastAPI()

# Include the events router
app.include_router(events.router)
app.include_router(registrations.router)