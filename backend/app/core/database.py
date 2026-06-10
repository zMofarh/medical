from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# تهيئة محرك قاعدة البيانات
engine = create_engine(settings.DATABASE_URL)

# تهيئة الجلسة (SessionLocal)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# قاعدة النموذج الأساسي للجداول
Base = declarative_base()

# دالة وسيطة لجلب جلسة قاعدة البيانات وإغلاقها تلقائياً
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
