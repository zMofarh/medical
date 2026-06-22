from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from uuid import UUID

class SystemSettingsBase(BaseModel):
    clinic_name: Optional[str] = "عيادة أفينيو"
    phone: Optional[str] = "0500000000"
    email: Optional[str] = "info@avenue.com"
    whatsapp: Optional[str] = "0500000000"
    address: Optional[str] = "الرياض, المملكة العربية السعودية"
    working_hours: Optional[Dict[str, Any]] = Field(default_factory=dict)
    maintenance_mode: Optional[bool] = False
    seo: Optional[Dict[str, Any]] = Field(default_factory=dict)
    pixels: Optional[Dict[str, Any]] = Field(default_factory=dict)
    chatbot: Optional[Dict[str, Any]] = Field(default_factory=dict)
    ai: Optional[Dict[str, Any]] = Field(default_factory=dict)
    appearance: Optional[Dict[str, Any]] = Field(default_factory=dict)

class SystemSettingsCreate(SystemSettingsBase):
    pass

class SystemSettingsUpdate(SystemSettingsBase):
    pass

class SystemSettingsInDBBase(SystemSettingsBase):
    id: UUID

    class Config:
        orm_mode = True

# Properties to return to admin
class SystemSettingsResponse(SystemSettingsInDBBase):
    pass

# Properties to return to public API (sanitized, no API keys or pixels)
class SystemSettingsPublic(BaseModel):
    clinic_name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    whatsapp: Optional[str]
    address: Optional[str]
    working_hours: Optional[Dict[str, Any]]
    maintenance_mode: Optional[bool]
    seo: Optional[Dict[str, Any]]
    chatbot: Optional[Dict[str, Any]]
    appearance: Optional[Dict[str, Any]]

    class Config:
        orm_mode = True
