import csv
from datetime import datetime
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Base, Event

DATABASE_URL = "sqlite+aiosqlite:///./events.db"


async def load_csv():
    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        with open("synthetic_10m.csv", "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                event = Event(
                    timestamp=datetime.strptime(
                        row["TIMESTAMP"], "%Y-%m-%dT%H:%M:%S.%f"
                    ),
                    computer_name=row["ComputerName"],
                    source_ip=row["SourceIp"],
                    destination_ip=row["DestinationIp"],
                    destination_port=int(row["DestinationPort"]),
                )
                session.add(event)
        await session.commit()


asyncio.run(load_csv())
