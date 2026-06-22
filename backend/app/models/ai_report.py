from sqlalchemy import Column, String, Integer, Text, JSON, DateTime
from sqlalchemy import Uuid as UUID
import uuid
from datetime import datetime

from app.core.database import Base

class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_name = Column(String, nullable=True)
    patient_age = Column(Integer, nullable=True)
    symptoms = Column(Text, nullable=False)
    report_content = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
