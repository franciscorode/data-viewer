from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite+aiosqlite:///./events.db"
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db():
    async with async_session() as session:
        yield session
