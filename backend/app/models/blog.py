import uuid
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, func
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class BlogCategory(Base):
    __tablename__ = "blog_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(String, unique=True, index=True, nullable=False)
    label = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())

    # علاقة عكسية مع المقالات
    posts = relationship("BlogPost", back_populates="category_rel")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=True)
    content = Column(String, nullable=True)
    category = Column(String, nullable=True)
    category_id = Column(String, ForeignKey("blog_categories.category_id"), nullable=True)
    author = Column(String, nullable=True)
    author_role = Column(String, nullable=True)
    author_image = Column(String, nullable=True)
    date = Column(String, nullable=True)
    read_time = Column(String, nullable=True)
    image = Column(String, nullable=True)
    tags = Column(JSONB, default=list)
    featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    status = Column(String(20), default="draft")  # (published, draft)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # علاقة الربط مع التصنيف
    category_rel = relationship("BlogCategory", back_populates="posts")
