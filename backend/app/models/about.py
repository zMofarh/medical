import uuid
from sqlalchemy import Column, String, DateTime, func, JSON
from sqlalchemy import Uuid as UUID

from app.core.database import Base

class CMSAbout(Base):
    __tablename__ = "cms_about"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hero = Column(JSON, nullable=False, default=dict)
    story = Column(JSON, nullable=False, default=dict)
    mission = Column(JSON, nullable=False, default=list)
    values = Column(JSON, nullable=False, default=list)
    timeline = Column(JSON, nullable=False, default=list)
    team = Column(JSON, nullable=False, default=list)
    awards = Column(JSON, nullable=False, default=list)
    
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
