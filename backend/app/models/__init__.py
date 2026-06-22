from app.models.user import User
from app.models.cms import CMSHome, CMSService, CMSDoctor, CMSPackage
from app.models.blog import BlogCategory, BlogPost
from app.models.booking import Booking
from app.models.contact import ContactMessage
from app.models.faq import FAQCategory, FAQItem
from app.models.settings import SystemSettings
from app.models.ai_report import AIReport
from app.models.about import CMSAbout
from app.models.offers import CMSOffers, Offer
from app.models.contact_cms import CMSContact
from app.models.search_cms import CMSSearch
from app.models.dna_config import DNAQuestion, DNAResultTemplate, DNAEvaluation

# تصدير كافة النماذج كحزمة واحدة لتسهيل الاستيراد وتهيئة هجرات Alembic
__all__ = [
    "User",
    "CMSHome",
    "CMSService",
    "CMSDoctor",
    "CMSPackage",
    "BlogCategory",
    "BlogPost",
    "Booking",
    "ContactMessage",
    "FAQCategory",
    "FAQItem",
    "SystemSettings",
    "AIReport",
    "CMSAbout",
    "CMSOffers",
    "Offer",
    "CMSContact",
    "CMSSearch",
    "DNAQuestion",
    "DNAResultTemplate",
    "DNAEvaluation",
]
