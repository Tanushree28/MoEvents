from fastapi import FastAPI
from .routers import events, registrations, login
from .database import engine
from .models import Base
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for frontend (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify the frontend URL here like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



# Include the events router
app.include_router(login.router)
app.include_router(events.router)
app.include_router(registrations.router)
