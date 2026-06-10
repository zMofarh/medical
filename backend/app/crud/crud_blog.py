from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.blog import BlogCategory, BlogPost
from app.schemas.blog import (
    BlogCategoryCreate,
    BlogPostCreate, BlogPostUpdate
)

def get_dict(obj, exclude_unset=False):
    if hasattr(obj, "model_dump"):
        return obj.model_dump(exclude_unset=exclude_unset)
    return obj.dict(exclude_unset=exclude_unset)

# --- Blog Categories ---

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(BlogCategory).offset(skip).limit(limit).all()

def get_category_by_id(db: Session, category_id: str):
    return db.query(BlogCategory).filter(BlogCategory.category_id == category_id).first()

def create_category(db: Session, category_in: BlogCategoryCreate):
    db_obj = BlogCategory(**get_dict(category_in))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_category(db: Session, category_id: str):
    db_obj = get_category_by_id(db, category_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj


# --- Blog Posts ---

def get_posts(db: Session, skip: int = 0, limit: int = 100, category: str = None, status: str = None, search: str = None):
    query = db.query(BlogPost)
    
    if category:
        query = query.filter(BlogPost.category_id == category)
    
    if status:
        query = query.filter(BlogPost.status == status)
        
    if search:
        query = query.filter(or_(
            BlogPost.title.ilike(f"%{search}%"),
            BlogPost.content.ilike(f"%{search}%")
        ))
        
    return query.offset(skip).limit(limit).all()

def get_post_by_id(db: Session, post_id: str):
    return db.query(BlogPost).filter(BlogPost.post_id == post_id).first()

def get_post_by_id_and_increment_views(db: Session, post_id: str):
    post = db.query(BlogPost).filter(BlogPost.post_id == post_id).first()
    if post:
        post.views += 1
        db.commit()
        db.refresh(post)
    return post

def create_post(db: Session, post_in: BlogPostCreate):
    db_obj = BlogPost(**get_dict(post_in))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_post(db: Session, post_id: str, update_data: BlogPostUpdate):
    db_obj = get_post_by_id(db, post_id)
    if db_obj:
        update_dict = get_dict(update_data, exclude_unset=True)
        for field, value in update_dict.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_post(db: Session, post_id: str):
    db_obj = get_post_by_id(db, post_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj
