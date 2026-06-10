from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_blog
from app.schemas.blog import (
    BlogCategoryCreate, BlogCategoryResponse,
    BlogPostCreate, BlogPostUpdate, BlogPostResponse
)

router = APIRouter()

# --- Categories ---

@router.get("/categories", response_model=List[BlogCategoryResponse])
def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """Get all categories (Public)"""
    return crud_blog.get_categories(db, skip=skip, limit=limit)

@router.post("/categories", response_model=BlogCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: BlogCategoryCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor", "doctor"]))
):
    """Create a new category"""
    if crud_blog.get_category_by_id(db, category_in.category_id):
        raise HTTPException(status_code=400, detail="Category ID already exists")
    return crud_blog.create_category(db, category_in)

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """Delete a category (Admin only)"""
    category = crud_blog.delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}


# --- Posts ---

@router.get("/posts", response_model=List[BlogPostResponse])
def get_posts(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None, description="Filter by category_id"),
    status: Optional[str] = Query("published", description="Filter by status (default published)"),
    search: Optional[str] = Query(None, description="Search term in title or content"),
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user_optional)
):
    """Get all posts. Public can only see published. Admins can see all if they pass status=None"""
    
    # Ensure public users can only see published posts
    if not current_user and status != "published":
        status = "published"
        
    if status == "all":
        status = None

    return crud_blog.get_posts(db, skip=skip, limit=limit, category=category, status=status, search=search)

@router.get("/posts/{post_id}", response_model=BlogPostResponse)
def get_post(
    post_id: str,
    db: Session = Depends(deps.get_db)
):
    """Get post by ID and increment views (Public)"""
    post = crud_blog.get_post_by_id_and_increment_views(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/posts", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: BlogPostCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor", "doctor"]))
):
    """Create a new blog post"""
    if crud_blog.get_post_by_id(db, post_in.post_id):
        raise HTTPException(status_code=400, detail="Post ID already exists")
    return crud_blog.create_post(db, post_in)

@router.put("/posts/{post_id}", response_model=BlogPostResponse)
def update_post(
    post_id: str,
    post_in: BlogPostUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor", "doctor"]))
):
    """Update a blog post"""
    post = crud_blog.update_post(db, post_id, post_in)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/posts/{post_id}")
def delete_post(
    post_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """Delete a blog post (Admin only)"""
    post = crud_blog.delete_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}
