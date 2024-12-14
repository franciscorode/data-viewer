from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime

Base = declarative_base()


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)
    computer_name = Column(String)
    source_ip = Column(String)
    destination_ip = Column(String)
    destination_port = Column(Integer)
