import uuid
from sqlalchemy import Column, String, DateTime, func, JSON
from sqlalchemy import Uuid as UUID

from app.core.database import Base

class CMSContact(Base):
    __tablename__ = "cms_contact"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hero = Column(JSON, nullable=False, default=dict)
    methods = Column(JSON, nullable=False, default=list)
    form_config = Column(JSON, nullable=False, default=dict)
    map_config = Column(JSON, nullable=False, default=dict)
    cta_banner = Column(JSON, nullable=False, default=dict)
    faq_teaser = Column(JSON, nullable=False, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
