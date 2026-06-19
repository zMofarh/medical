import uuid
from sqlalchemy.orm import Session
from app.models.faq import FAQCategory, FAQItem
from app.schemas.faq import FAQCategoryCreate, FAQCategoryUpdate, FAQItemCreate, FAQItemUpdate

# --- FAQ Category CRUD ---

def get_faq_category(db: Session, category_id: str):
    return db.query(FAQCategory).filter(FAQCategory.id == category_id).first()

def get_faq_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FAQCategory).offset(skip).limit(limit).all()

def create_faq_category(db: Session, category: FAQCategoryCreate):
    db_obj = FAQCategory(
        id=category.id,
        label=category.label,
        icon=category.icon
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_faq_category(db: Session, db_obj: FAQCategory, obj_in: FAQCategoryUpdate):
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_faq_category(db: Session, db_obj: FAQCategory):
    db.delete(db_obj)
    db.commit()
    return db_obj

# --- FAQ Item CRUD ---

def get_faq_item(db: Session, faq_id: str):
    return db.query(FAQItem).filter(FAQItem.id == faq_id).first()

def get_faq_items(db: Session, skip: int = 0, limit: int = 100, category: str = None):
    query = db.query(FAQItem)
    if category:
        query = query.filter(FAQItem.category == category)
    # Order by category then order index
    return query.order_by(FAQItem.category, FAQItem.order).offset(skip).limit(limit).all()

def create_faq_item(db: Session, item: FAQItemCreate):
    db_obj = FAQItem(
        id=item.id if item.id else str(uuid.uuid4()),
        category=item.category,
        question=item.question,
        answer=item.answer,
        order=item.order
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_faq_item(db: Session, db_obj: FAQItem, obj_in: FAQItemUpdate):
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_faq_item(db: Session, db_obj: FAQItem):
    db.delete(db_obj)
    db.commit()
    return db_obj
