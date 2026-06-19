from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.faq import (
    FAQCategoryCreate, FAQCategoryUpdate, FAQCategoryResponse,
    FAQItemCreate, FAQItemUpdate, FAQItemResponse
)
from app.crud import crud_faq

router = APIRouter()

# --- FAQ Categories ---

@router.get("/faq-categories", response_model=List[FAQCategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """جلب كل التصنيفات"""
    return crud_faq.get_faq_categories(db, skip=skip, limit=limit)

@router.post("/faq-categories", response_model=FAQCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: FAQCategoryCreate, db: Session = Depends(get_db)):
    """إضافة تصنيف جديد"""
    db_category = crud_faq.get_faq_category(db, category_id=category.id)
    if db_category:
        raise HTTPException(status_code=400, detail="Category ID already registered")
    return crud_faq.create_faq_category(db=db, category=category)

@router.put("/faq-categories/{category_id}", response_model=FAQCategoryResponse)
def update_category(category_id: str, category_in: FAQCategoryUpdate, db: Session = Depends(get_db)):
    """تعديل تصنيف موجود"""
    db_category = crud_faq.get_faq_category(db, category_id=category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return crud_faq.update_faq_category(db=db, db_obj=db_category, obj_in=category_in)

@router.delete("/faq-categories/{category_id}", response_model=FAQCategoryResponse)
def delete_category(category_id: str, db: Session = Depends(get_db)):
    """حذف تصنيف"""
    db_category = crud_faq.get_faq_category(db, category_id=category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return crud_faq.delete_faq_category(db=db, db_obj=db_category)


# --- FAQ Items ---

@router.get("/faqs", response_model=List[FAQItemResponse])
def get_faqs(category: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """جلب كل الأسئلة مع إمكانية الفلترة حسب التصنيف"""
    return crud_faq.get_faq_items(db, skip=skip, limit=limit, category=category)

@router.post("/faqs", response_model=FAQItemResponse, status_code=status.HTTP_201_CREATED)
def create_faq(item: FAQItemCreate, db: Session = Depends(get_db)):
    """إضافة سؤال جديد"""
    # التحقق من وجود التصنيف أولاً
    db_category = crud_faq.get_faq_category(db, category_id=item.category)
    if not db_category:
        raise HTTPException(status_code=400, detail="Category not found")
        
    if item.id:
        db_item = crud_faq.get_faq_item(db, faq_id=item.id)
        if db_item:
            raise HTTPException(status_code=400, detail="FAQ ID already exists")
            
    return crud_faq.create_faq_item(db=db, item=item)

@router.put("/faqs/{faq_id}", response_model=FAQItemResponse)
def update_faq(faq_id: str, item_in: FAQItemUpdate, db: Session = Depends(get_db)):
    """تعديل سؤال موجود"""
    db_item = crud_faq.get_faq_item(db, faq_id=faq_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="FAQ not found")
        
    if item_in.category:
        db_category = crud_faq.get_faq_category(db, category_id=item_in.category)
        if not db_category:
            raise HTTPException(status_code=400, detail="Category not found")
            
    return crud_faq.update_faq_item(db=db, db_obj=db_item, obj_in=item_in)

@router.delete("/faqs/{faq_id}", response_model=FAQItemResponse)
def delete_faq(faq_id: str, db: Session = Depends(get_db)):
    """حذف سؤال"""
    db_item = crud_faq.get_faq_item(db, faq_id=faq_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return crud_faq.delete_faq_item(db=db, db_obj=db_item)
