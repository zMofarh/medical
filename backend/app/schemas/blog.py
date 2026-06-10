from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# --- Blog Category ---

class BlogCategoryBase(BaseModel):
    category_id: str
    label: str

class BlogCategoryCreate(BlogCategoryBase):
    pass

class BlogCategoryUpdate(BaseModel):
    label: Optional[str] = None

class BlogCategoryResponse(BlogCategoryBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Blog Post ---

class BlogPostBase(BaseModel):
    post_id: str
    title: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    category_id: Optional[str] = None
    author: Optional[str] = None
    author_role: Optional[str] = None
    author_image: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = None
    image: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    featured: Optional[bool] = False
    status: str = Field("draft", description="Status can be draft or published")

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    category_id: Optional[str] = None
    author: Optional[str] = None
    author_role: Optional[str] = None
    author_image: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    status: Optional[str] = None

class BlogPostResponse(BlogPostBase):
    id: UUID
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
