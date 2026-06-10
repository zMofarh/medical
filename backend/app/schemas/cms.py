from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

# --- CMS Home ---

class CMSHomeBase(BaseModel):
    hero: Dict[str, Any] = Field(default_factory=dict)
    why_us: Dict[str, Any] = Field(default_factory=dict)
    cta: Dict[str, Any] = Field(default_factory=dict)
    trust_bar: Dict[str, Any] = Field(default_factory=dict)
    testimonials: Dict[str, Any] = Field(default_factory=dict)

class CMSHomeUpdate(CMSHomeBase):
    pass

class CMSHomeResponse(CMSHomeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- CMS Service ---

class CMSServiceBase(BaseModel):
    service_id: str
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    icon: Optional[str] = None
    accent_color: Optional[str] = None
    image: Optional[str] = None
    hero_image: Optional[str] = None
    category: Optional[str] = None
    stats: List[Dict[str, Any]] = Field(default_factory=list)
    procedures: List[Dict[str, Any]] = Field(default_factory=list)
    prices: List[Dict[str, Any]] = Field(default_factory=list)
    doctors: List[Dict[str, Any]] = Field(default_factory=list)
    faqs: List[Dict[str, Any]] = Field(default_factory=list)
    related_services: List[str] = Field(default_factory=list)

class CMSServiceCreate(CMSServiceBase):
    pass

class CMSServiceUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    icon: Optional[str] = None
    accent_color: Optional[str] = None
    image: Optional[str] = None
    hero_image: Optional[str] = None
    category: Optional[str] = None
    stats: Optional[List[Dict[str, Any]]] = None
    procedures: Optional[List[Dict[str, Any]]] = None
    prices: Optional[List[Dict[str, Any]]] = None
    doctors: Optional[List[Dict[str, Any]]] = None
    faqs: Optional[List[Dict[str, Any]]] = None
    related_services: Optional[List[str]] = None

class CMSServiceResponse(CMSServiceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- CMS Doctor ---

class CMSDoctorBase(BaseModel):
    doctor_id: str
    name: str
    specialty: Optional[str] = None
    experience: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[float] = 5.0
    reviews_count: Optional[int] = 0
    title: Optional[str] = None
    education: Optional[str] = None
    languages: List[str] = Field(default_factory=list)
    available_days: List[str] = Field(default_factory=list)
    bio: Optional[str] = None
    specializations: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    consultation_fee: Optional[str] = None
    reviews: List[Dict[str, Any]] = Field(default_factory=list)

class CMSDoctorCreate(CMSDoctorBase):
    pass

class CMSDoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialty: Optional[str] = None
    experience: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    title: Optional[str] = None
    education: Optional[str] = None
    languages: Optional[List[str]] = None
    available_days: Optional[List[str]] = None
    bio: Optional[str] = None
    specializations: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    consultation_fee: Optional[str] = None
    reviews: Optional[List[Dict[str, Any]]] = None

class CMSDoctorResponse(CMSDoctorBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- CMS Package ---

class CMSPackageBase(BaseModel):
    package_id: str
    name: str
    category: str
    price: int
    original_price: Optional[int] = None
    badge: Optional[str] = None
    icon: Optional[str] = None
    features: List[Dict[str, Any]] = Field(default_factory=list)
    accent_color: str = "teal"
    description: Optional[str] = None
    duration: Optional[str] = None
    target_audience: Optional[str] = None
    preparation: List[str] = Field(default_factory=list)
    includes: List[str] = Field(default_factory=list)
    faqs: List[Dict[str, Any]] = Field(default_factory=list)

class CMSPackageCreate(CMSPackageBase):
    pass

class CMSPackageUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    original_price: Optional[int] = None
    badge: Optional[str] = None
    icon: Optional[str] = None
    features: Optional[List[Dict[str, Any]]] = None
    accent_color: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    target_audience: Optional[str] = None
    preparation: Optional[List[str]] = None
    includes: Optional[List[str]] = None
    faqs: Optional[List[Dict[str, Any]]] = None

class CMSPackageResponse(CMSPackageBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
