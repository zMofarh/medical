import uuid
from sqlalchemy import Column, String, DateTime, func, JSON
from sqlalchemy import Uuid as UUID

from app.core.database import Base

class CMSSearch(Base):
    __tablename__ = "cms_search"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hero = Column(JSON, nullable=False, default=dict)
    popular_searches = Column(JSON, nullable=False, default=list)
    quick_links = Column(JSON, nullable=False, default=list)
    cta = Column(JSON, nullable=False, default=dict)
    results_config = Column(JSON, nullable=False, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
