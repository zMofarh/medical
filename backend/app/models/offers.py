import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, func, JSON
from sqlalchemy import Uuid as UUID

from app.core.database import Base

class CMSOffers(Base):
    __tablename__ = "cms_offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hero = Column(JSON, nullable=False, default=dict)
    how_to_redeem = Column(JSON, nullable=False, default=list)
    notify = Column(JSON, nullable=False, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())


class Offer(Base):
    __tablename__ = "offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    offer_id = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=False) # 'seasonal' or 'flash'
    
    # Common fields
    active = Column(Boolean, default=True)
    package_ids = Column(JSON, default=list)
    
    # Seasonal offer specific
    title = Column(String, nullable=True)
    subtitle = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    bg_gradient = Column(String, nullable=True)
    badge_color = Column(String, nullable=True)
    discount_percent = Column(Integer, nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    description = Column(String, nullable=True)
    
    # Flash deal specific
    flash_discount = Column(Integer, nullable=True)
    ends_in = Column(Integer, nullable=True) # hours
    label = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
