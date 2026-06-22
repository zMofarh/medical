from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

class CMSContactBase(BaseModel):
    hero: Dict[str, Any] = {}
    methods: List[Dict[str, Any]] = []
    form_config: Dict[str, Any] = {}
    map_config: Dict[str, Any] = {}
    cta_banner: Dict[str, Any] = {}
    faq_teaser: Dict[str, Any] = {}

class CMSContactCreate(CMSContactBase):
    pass

class CMSContactUpdate(CMSContactBase):
    pass

class CMSContact(CMSContactBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
