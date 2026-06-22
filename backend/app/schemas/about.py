from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

class CMSAboutBase(BaseModel):
    hero: Dict[str, Any] = {}
    story: Dict[str, Any] = {}
    mission: List[Dict[str, Any]] = []
    values: List[Dict[str, Any]] = []
    timeline: List[Dict[str, Any]] = []
    team: List[Dict[str, Any]] = []
    awards: List[Dict[str, Any]] = []

class CMSAboutCreate(CMSAboutBase):
    pass

class CMSAboutUpdate(CMSAboutBase):
    pass

class CMSAbout(CMSAboutBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
