import uuid
from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy import Uuid as UUID
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(50), nullable=False)  # (super_admin, admin, editor, receptionist, viewer, doctor)
    avatar = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
