from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- FAQ Category ---
class FAQCategoryBase(BaseModel):
    id: str
    label: str
    icon: Optional[str] = None

class FAQCategoryCreate(FAQCategoryBase):
    pass

class FAQCategoryUpdate(BaseModel):
    label: Optional[str] = None
    icon: Optional[str] = None

class FAQCategoryResponse(FAQCategoryBase):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- FAQ Item ---
class FAQItemBase(BaseModel):
    id: Optional[str] = None
    category: str
    question: str
    answer: str
    order: Optional[int] = 0

class FAQItemCreate(BaseModel):
    id: Optional[str] = None
    category: str
    question: str
    answer: str
    order: Optional[int] = 0

class FAQItemUpdate(BaseModel):
    category: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None

class FAQItemResponse(BaseModel):
    id: str
    category: str
    question: str
    answer: str
    order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
