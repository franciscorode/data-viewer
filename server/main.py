from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from datetime import datetime

from models import Event, Base
from database import get_db, engine

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow requests from the specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/api/events", response_model=List[dict])
async def get_events(
    source_ip: Optional[str] = Query(None),
    destination_ip: Optional[str] = Query(None),
    destination_port: Optional[str] = Query(None),
    computer_name: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: Optional[int] = Query(100, le=1000),
    db: AsyncSession = Depends(get_db),
):
    query = select(Event)

    if source_ip:
        query = query.where(Event.source_ip.contains(source_ip))
    if destination_ip:
        query = query.where(Event.destination_ip.contains(destination_ip))
    if destination_port:
        query = query.where(Event.destination_port.contains(destination_port))
    if computer_name:
        query = query.where(Event.computer_name.contains(computer_name))
    if start_date:
        query = query.where(Event.timestamp >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.where(Event.timestamp <= datetime.fromisoformat(end_date))

    query = query.limit(limit)
    result = await db.execute(query)
    events = result.scalars().all()

    return [
        {
            "id": event.id,
            "timestamp": event.timestamp,
            "computer_name": event.computer_name,
            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "destination_port": event.destination_port,
        }
        for event in events
    ]
