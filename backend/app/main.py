from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import auth, contact, bookings, cms_home, services, doctors, packages, blog

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The Medical Avenue Clinic API providing precision medicine, metabolic disorder management, and international second opinion services.",
    version="1.0.0",
    contact={
        "name": "The Medical Avenue IT Team",
        "email": "support@medicalavenue.com",
    },
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# إعداد CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تسجيل المسارات
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(contact.router, prefix="/api/contact", tags=["Public Forms & Admin"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Public Forms & Admin"])
app.include_router(cms_home.router, prefix="/api/cms/home", tags=["CMS Home"])
app.include_router(services.router, prefix="/api/services", tags=["CMS Services"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["CMS Doctors"])
app.include_router(packages.router, prefix="/api/packages", tags=["CMS Packages"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog & Articles"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

