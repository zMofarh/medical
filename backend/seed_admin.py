from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import get_password_hash
import uuid

# Ensure tables exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()

try:
    user = db.query(User).filter(User.email == "admin@clinic.com").first()
    if not user:
        user = User(
            id=uuid.uuid4(),
            name="مدير النظام",
            email="admin@clinic.com",
            hashed_password=get_password_hash("admin123"),
            role="super_admin",
            avatar="https://readdy.ai/api/search-image?query=professional%20arab%20business%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=100&height=100&seq=admin1&orientation=squarish"
        )
        db.add(user)
        db.commit()
        print("Admin user created successfully!")
    else:
        # Update password just in case
        user.hashed_password = get_password_hash("admin123")
        db.commit()
        print("Admin user already exists, updated password to admin123")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
