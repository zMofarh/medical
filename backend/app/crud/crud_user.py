from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password
from typing import Optional

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve a user from the database by email address."""
    return db.query(User).filter(User.email == email).first()

def authenticate(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
