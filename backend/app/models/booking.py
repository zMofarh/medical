import uuid
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy import Uuid as UUID
from app.core.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_ref = Column(String(20), unique=True, index=True, nullable=False) # مثل MC-XXXXXX
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    complaint = Column(String, nullable=True)
    service_id = Column(String, nullable=True)
    doctor_id = Column(String, nullable=True)
    package_id = Column(String, nullable=True)
    visit_type = Column(String(20), nullable=False) # (first, followup, consultation)
    selected_date = Column(String(20), nullable=False)
    selected_time = Column(String(20), nullable=False)
    status = Column(String(20), default="pending") # (pending, confirmed, cancelled)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
