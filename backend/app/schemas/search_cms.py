from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

class CMSSearchBase(BaseModel):
    hero: Dict[str, Any] = {}
    popular_searches: List[Dict[str, Any]] = []
    quick_links: List[Dict[str, Any]] = []
    cta: Dict[str, Any] = {}
    results_config: Dict[str, Any] = {}

class CMSSearchCreate(CMSSearchBase):
    pass

class CMSSearchUpdate(CMSSearchBase):
    pass

class CMSSearch(CMSSearchBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
