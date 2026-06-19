import uuid
from sqlalchemy import Column, String, Integer, Numeric, DateTime, func
from sqlalchemy import Uuid as UUID, JSON as JSONB
from app.core.database import Base

class CMSHome(Base):
    __tablename__ = "cms_home"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hero = Column(JSONB, nullable=False, default=dict)
    why_us = Column(JSONB, nullable=False, default=dict)
    cta = Column(JSONB, nullable=False, default=dict)
    trust_bar = Column(JSONB, nullable=False, default=dict)
    testimonials = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())


class CMSService(Base):
    __tablename__ = "cms_services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    description = Column(String, nullable=True)
    long_description = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    accent_color = Column(String, nullable=True)
    image = Column(String, nullable=True)
    hero_image = Column(String, nullable=True)
    category = Column(String, nullable=True)
    stats = Column(JSONB, default=list)
    procedures = Column(JSONB, default=list)
    prices = Column(JSONB, default=list)
    doctors = Column(JSONB, default=list)
    faqs = Column(JSONB, default=list)
    related_services = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())


class CMSDoctor(Base):
    __tablename__ = "cms_doctors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    image = Column(String, nullable=True)
    rating = Column(Numeric(precision=2, scale=1), default=5.0)
    reviews_count = Column(Integer, default=0)
    title = Column(String, nullable=True)
    education = Column(String, nullable=True)
    languages = Column(JSONB, default=list)
    available_days = Column(JSONB, default=list)
    bio = Column(String, nullable=True)
    specializations = Column(JSONB, default=list)
    achievements = Column(JSONB, default=list)
    consultation_fee = Column(String, nullable=True)
    reviews = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())


class CMSPackage(Base):
    __tablename__ = "cms_packages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    package_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    original_price = Column(Integer, nullable=True)
    badge = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    features = Column(JSONB, default=list)
    accent_color = Column(String, default="teal")
    description = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    target_audience = Column(String, nullable=True)
    preparation = Column(JSONB, default=list)
    includes = Column(JSONB, default=list)
    faqs = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
