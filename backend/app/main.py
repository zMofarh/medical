from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import (
    auth,
    contact,
    bookings,
    cms_home,
    services,
    doctors,
    packages,
    blog,
    faq,
    settings as settings_router,
    dashboard,
    ai_reports,
    about,
    offers,
    contact_cms,
    search_cms,
    dna_config
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The Medical Avenue Clinic API providing precision medicine, metabolic disorder management, and international second opinion services.",
    version="1.0.0",
    contact={
        "name": "The Medical Avenue IT Team",
        "email": "support@medicalavenue.com",
    },
    docs_url="/api/docs" if settings.SHOW_DOCS else None,
    redoc_url="/api/redoc" if settings.SHOW_DOCS else None,
    openapi_url="/api/openapi.json" if settings.SHOW_DOCS else None
)

# إعداد CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(contact.router, prefix="/api/contact", tags=["Public Forms & Admin"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Public Forms & Admin"])
app.include_router(cms_home.router, prefix="/api/cms/home", tags=["CMS Home"])
app.include_router(services.router, prefix="/api/services", tags=["CMS Services"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["CMS Doctors"])
app.include_router(packages.router, prefix="/api/packages", tags=["CMS Packages"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog & Articles"])
app.include_router(faq.router, prefix="/api", tags=["FAQ"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["Settings"])
app.include_router(ai_reports.router, prefix="/api/ai-reports", tags=["AI Reports"])
app.include_router(about.router, prefix="/api/cms-about", tags=["CMS About"])
app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
app.include_router(contact_cms.router, prefix="/api/cms-contact", tags=["CMS Contact"])
app.include_router(search_cms.router, prefix="/api/cms-search", tags=["CMS Search"])
app.include_router(dna_config.router, prefix="/api/dna-config", tags=["DNA Simulator Config"])
app.include_router(dashboard.router, prefix="/api/admin", tags=["Admin Dashboard"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

