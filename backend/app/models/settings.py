from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy import Uuid as UUID
import uuid

from app.core.database import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_name = Column(String, default="عيادة أفينيو")
    phone = Column(String, default="0500000000")
    email = Column(String, default="info@avenue.com")
    whatsapp = Column(String, default="0500000000")
    address = Column(String, default="الرياض, المملكة العربية السعودية")
    
    # JSONB for complex structures
    working_hours = Column(JSON, default=dict)
    maintenance_mode = Column(Boolean, default=False)
    seo = Column(JSON, default=dict)
    pixels = Column(JSON, default=dict)
    chatbot = Column(JSON, default=dict)
    ai = Column(JSON, default=dict)
    appearance = Column(JSON, default=dict)
