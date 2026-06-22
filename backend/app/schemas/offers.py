from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

# CMS Offers (Page Config)
class CMSOffersBase(BaseModel):
    hero: Dict[str, Any] = {}
    how_to_redeem: List[Dict[str, Any]] = []
    notify: Dict[str, Any] = {}

class CMSOffersCreate(CMSOffersBase):
    pass

class CMSOffersUpdate(CMSOffersBase):
    pass

class CMSOffers(CMSOffersBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

# Offer
class OfferBase(BaseModel):
    offer_id: str
    type: str # 'seasonal' or 'flash'
    active: bool = True
    package_ids: List[str] = []
    title: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    icon: Optional[str] = None
    bg_gradient: Optional[str] = None
    badge_color: Optional[str] = None
    discount_percent: Optional[int] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = None
    flash_discount: Optional[int] = None
    ends_in: Optional[int] = None
    label: Optional[str] = None

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    active: Optional[bool] = None
    package_ids: Optional[List[str]] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    icon: Optional[str] = None
    bg_gradient: Optional[str] = None
    badge_color: Optional[str] = None
    discount_percent: Optional[int] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = None
    flash_discount: Optional[int] = None
    ends_in: Optional[int] = None
    label: Optional[str] = None

class Offer(OfferBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
