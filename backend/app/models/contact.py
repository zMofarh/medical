import uuid
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    status = Column(String(20), default="new") # (new, read, replied)
    created_at = Column(DateTime(timezone=True), default=func.now())
