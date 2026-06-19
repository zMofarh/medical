import uuid
from sqlalchemy import Column, String, Integer, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class FAQCategory(Base):
    __tablename__ = "faq_categories"

    id = Column(String, primary_key=True, index=True) # e.g. "general"
    label = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    faqs = relationship("FAQItem", back_populates="category_rel", cascade="all, delete-orphan")


class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    category = Column(String, ForeignKey("faq_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    category_rel = relationship("FAQCategory", back_populates="faqs")
