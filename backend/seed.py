import sys
import os
import uuid

# Add parent directory to path to enable app imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import (
    User,
    CMSHome,
    CMSService,
    CMSDoctor,
    CMSPackage,
    BlogCategory,
    BlogPost,
    Booking,
    ContactMessage,
    SystemSettings,
    AIReport,
    CMSAbout,
    CMSContact,
    CMSOffers,
    CMSSearch
)

def seed_db():
    print("Connecting to database and starting seed process...")
    db = SessionLocal()
    try:
        # 1. Clean existing data (respecting foreign key constraints)
        print("Cleaning existing database tables...")
        db.query(BlogPost).delete()
        db.query(BlogCategory).delete()
        db.query(CMSPackage).delete()
        db.query(CMSDoctor).delete()
        db.query(CMSService).delete()
        db.query(CMSHome).delete()
        db.query(CMSAbout).delete()
        db.query(CMSContact).delete()
        db.query(CMSOffers).delete()
        db.query(CMSSearch).delete()
        db.query(User).delete()
        db.query(Booking).delete()
        db.query(ContactMessage).delete()
        db.query(AIReport).delete()
        db.query(SystemSettings).delete()
        db.commit()
        print("Database tables cleared successfully.")

        # 2. Seed Users
        print("Seeding Users...")
        admin_pass = get_password_hash("ad1212")
        users = [
            User(
                name="مدير النظام",
                email="admin@clinic.com",
                hashed_password=admin_pass,
                role="super_admin",
                avatar="https://readdy.ai/api/search-image?query=professional%20arab%20business%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=100&height=100&seq=admin1&orientation=squarish",
                is_active=True
            ),
            User(
                name="موظف استقبال",
                email="receptionist@clinic.com",
                hashed_password=get_password_hash("receptionist123"),
                role="receptionist",
                avatar="https://readdy.ai/api/search-image?query=professional%20arab%20young%20man%20portrait%20headshot%20neutral%20background&width=100&height=100&seq=rec1&orientation=squarish",
                is_active=True
            ),
            User(
                name="د. فيصل الأحمد",
                email="dr.faisal@clinic.com",
                hashed_password=get_password_hash("doctor123"),
                role="doctor",
                avatar="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope&width=100&height=100&seq=doc1&orientation=squarish",
                is_active=True
            ),
            User(
                name="محرر المحتوى",
                email="editor@clinic.com",
                hashed_password=get_password_hash("editor123"),
                role="editor",
                avatar="https://readdy.ai/api/search-image?query=professional%20arab%20woman%20portrait&width=100&height=100&seq=ed1&orientation=squarish",
                is_active=True
            ),
            User(
                name="مراقب النظام",
                email="viewer@clinic.com",
                hashed_password=get_password_hash("viewer123"),
                role="viewer",
                avatar="",
                is_active=True
            ),            User(
                name="مراقب النظام",
                email="h@h.com",
                hashed_password=get_password_hash("h@123123"),
                role="super_admin",
                avatar="",
                is_active=True
            )
        ]
        db.add_all(users)
        db.commit()
        print(f"Seeded {len(users)} users.")

        # 2.5 Seed System Settings
        print("Seeding System Settings...")
        default_settings = SystemSettings(
            clinic_name="ذا مديكال أفينيو",
            phone="0500000000",
            email="info@medicalavenue.com",
            whatsapp="0500000000",
            address="الرياض, المملكة العربية السعودية",
            working_hours={
                "saturday": {"isOpen": True, "open": "09:00", "close": "21:00"},
                "sunday": {"isOpen": True, "open": "09:00", "close": "21:00"},
                "monday": {"isOpen": True, "open": "09:00", "close": "21:00"},
                "tuesday": {"isOpen": True, "open": "09:00", "close": "21:00"},
                "wednesday": {"isOpen": True, "open": "09:00", "close": "21:00"},
                "thursday": {"isOpen": True, "open": "09:00", "close": "21:00"},
                "friday": {"isOpen": False, "open": "00:00", "close": "00:00"}
            },
            maintenance_mode=False,
            seo={
                "defaultTitle": "ذا مديكال أفينيو | مركز الطب الدقيق",
                "defaultDescription": "عيادة متخصصة في الطب الدقيق والوظيفي بأسلوب علمي متكامل.",
                "ogImage": "https://example.com/og-image.jpg"
            },
            pixels={
                "facebook": "FB-123456789",
                "snapchat": "SNAP-123456789",
                "tiktok": "TT-123456789",
                "googleAnalytics": "G-123456789"
            },
            chatbot={
                "enabled": True,
                "welcomeMessage": "مرحباً بك في ذا مديكال أفينيو. كيف يمكننا مساعدتك اليوم؟",
                "faqs": [
                    {"q": "متى أوقات العمل؟", "a": "نعمل من السبت إلى الخميس من 9 صباحاً حتى 9 مساءً."},
                    {"q": "هل تقبلون التأمين؟", "a": "نعم، نقبل معظم شركات التأمين الرئيسية."}
                ]
            },
            ai={
                "openaiKey": "sk-mock-key-1234567890",
                "defaultModel": "gpt-4-turbo"
            },
            appearance={
                "primaryColor": "#0F766E",
                "logoUrl": "/images/logo.png"
            }
        )
        db.add(default_settings)
        db.commit()
        print("Seeded System Settings.")

        # 3. Seed CMS Home
        print("Seeding CMS Home Content...")
        cms_home = CMSHome(
            hero={
                "badge": "مركز الطب الدقيق والعافية المتكاملة",
                "heading1": "صحتك تستحق",
                "typewriterWords": ["فهماً أعمق", "رعاية أدق", "علماً حقيقياً", "مساراً مخصصاً"],
                "description": "نقدم طبًا يقرأ ما وراء الأعراض — يربط بين الجينات، الأيض، والعمر البيولوجي لبناء خطة صحية حقيقية لك.",
                "subDescription": "عيادة متخصصة في الطب الدقيق، الطب الوظيفي، وإدارة الأمراض المزمنة بأسلوب علمي متكامل.",
                "btnBook": "احجز موعدك",
                "btnServices": "استكشف خدماتنا",
                "pillars": ["طب دقيق", "رعاية شاملة", "خبرة دولية"],
                "stats": [
                    { "value": "+2,400", "label": "مريض سنوياً" },
                    { "value": "98%", "label": "نسبة الرضا" },
                    { "value": "6", "label": "استشاريين" }
                ],
                "backgroundImage": "https://readdy.ai/api/search-image?query=serene%20minimalist%20medical%20clinic%20interior%20soft%20natural%20light%20warm%20cream%20beige%20tones%20clean%20white%20walls%20subtle%20green%20plants%20calm%20peaceful%20healthcare%20environment%20elegant%20simple&width=1440&height=900&seq=hero-ma-calm2&orientation=landscape"
            },
            why_us={
                "badge": "لماذا ذا مديكال أفينيو؟",
                "heading": "طب أعمق، أكثر تخصيصًا،",
                "subHeading": "ومدعوم بالدقة",
                "description": "نحن لسنا عيادة أسرع — بل عيادة أعمق. نفكك الحالة ونقرأ ما وراء العرض، ونربط بين الحاضر الصحي والمخاطر المستقبلية.",
                "subDescription": "كل مريض يملك بيولوجيا ومسارًا صحيًا مختلفًا. لذلك نصمم لكل حالة خطة مبنية على تقييمها الفعلي، لا على بروتوكول عام.",
                "mainImage": "https://readdy.ai/api/search-image?query=precision%20medicine%20doctor%20reviewing%20advanced%20diagnostic%20data%20DNA%20genomics%20screens%20modern%20sophisticated%20clinical%20environment%20dark%20teal%20professional%20medical%20science&width=700&height=550&seq=whyus-ma1&orientation=landscape",
                "items": [
                    { "icon": "ri-dna-line", "title": "تحليل جيني متقدم", "description": "نقرأ خريطتك الجينية لفهم استعداداتك الصحية وتخصيص العلاج." },
                    { "icon": "ri-heart-pulse-line", "title": "تقييم العمر البيولوجي", "description": "نقيس عمرك البيولوجي الحقيقي بعيداً عن العمر الزمني." },
                    { "icon": "ri-microscope-line", "title": "طب وظيفي متكامل", "description": "نعالج الأسباب الجذرية لا الأعراض فقط." },
                    { "icon": "ri-global-line", "title": "خبرة دولية", "description": "شراكات مع مراكز طبية في USA وكوريا وأوروبا." }
                ]
            },
            cta={
                "badge": "ابدأ رحلتك نحو فهم حقيقي",
                "heading": "جسدك يستحق أن يُفهم، لا أن يُعالج فقط",
                "description": "احجز استشارتك الأولى مع فريقنا المتخصص وابدأ رحلة صحية مبنية على العلم والدقة.",
                "subDescription": "نقدم طبًا أعمق · أكثر تخصيصًا · مدعومًا بالتقنيات الدقيقة والخبرة الدولية",
                "btnBook": "احجز موعدك الآن",
                "btnContact": "تواصل معنا"
            },
            trust_bar={
                "items": [
                    { "icon": "ri-award-line", "value": "+2,400", "label": "مريض سنوياً" },
                    { "icon": "ri-star-line", "value": "98%", "label": "نسبة رضا المرضى" },
                    { "icon": "ri-user-star-line", "value": "6", "label": "استشاريين متخصصين" },
                    { "icon": "ri-hospital-line", "value": "12+", "label": "سنة خبرة طبية" },
                    { "icon": "ri-global-line", "value": "3", "label": "شراكات دولية" }
                ]
            },
            testimonials={
                "badge": "آراء مرضانا",
                "heading": "تجارب حقيقية، نتائج ملموسة",
                "description": "ما يقوله مرضانا عن تجربتهم في ذا مديكال أفينيو",
                "items": [
                    {
                        "name": "أحمد الشمري",
                        "role": "مريض منذ 2023",
                        "text": "تجربة استثنائية. الفريق الطبي أخذ وقته الكافي لفهم حالتي بشكل كامل وقدم لي خطة علاجية مخصصة غيّرت حياتي.",
                        "rating": 5.0,
                        "avatar": "https://readdy.ai/api/search-image?query=professional%20arab%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=t1&orientation=squarish"
                    },
                    {
                        "name": "سارة المطيري",
                        "role": "مريضة منذ 2024",
                        "text": "أخيراً وجدت عيادة تتعامل مع الجسم كنظام متكامل. التحليل الجيني الذي أجريته غيّر فهمي لصحتي تماماً.",
                        "rating": 5.0,
                        "avatar": "https://readdy.ai/api/search-image?query=professional%20arab%20woman%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style%20hijab&width=80&height=80&seq=t2&orientation=squarish"
                    },
                    {
                        "name": "خالد العتيبي",
                        "role": "مريض منذ 2022",
                        "text": "الدكاترة هنا يستمعون فعلاً. ليس مجرد وصفة طبية سريعة، بل تقييم شامل ومتابعة مستمرة. أنصح به بشدة.",
                        "rating": 5.0,
                        "avatar": "https://readdy.ai/api/search-image?query=professional%20saudi%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=t3&orientation=squarish"
                    }
                ]
            }
        )
        db.add(cms_home)
        db.commit()
        print("Seeded CMS Home Content.")

        # 3.2 Seed CMS About
        print("Seeding CMS About Content...")
        cms_about = CMSAbout(
            hero={"badge": "من نحن", "title": "ذا مديكال أفينيو", "subtitle": "منصة الطب الدقيق"},
            story={"title": "من سؤال بسيط إلى منصة طب دقيق", "paragraphs": ["بدأت ذا مديكال أفينيو..."]},
            mission=[{"title": "رسالتنا", "body": "تقديم طب أعمق"}],
            values=[{"title": "نفهم قبل أن نقرر"}],
            timeline=[{"year": "2018", "title": "التأسيس"}],
            team=[{"name": "د. فيصل الأحمد", "role": "المدير الطبي"}],
            awards=[{"title": "منصة الطب الدقيق الأولى"}]
        )
        db.add(cms_about)
        
        # 3.3 Seed CMS Contact
        print("Seeding CMS Contact Content...")
        cms_contact = CMSContact(
            hero={"title": "كيف يمكننا مساعدتك؟"},
            methods=[{"title": "اتصل بنا", "value": "+966 11 234 5678"}],
            form_config={"title": "تواصل معنا"},
            map_config={"title": "موقعنا على الخريطة"},
            cta_banner={"title": "احجز جلسة تقييم"},
            faq_teaser={"title": "هل لديك أسئلة؟"}
        )
        db.add(cms_contact)

        # 3.4 Seed CMS Offers
        print("Seeding CMS Offers Content...")
        cms_offers = CMSOffers(
            hero={"title": "عروض موسمية لا تُفوَّت"},
            how_to_redeem=[{"title": "اختر الباقة"}],
            notify={"title": "لا تفوّت أي عرض قادم!"}
        )
        db.add(cms_offers)

        # 3.5 Seed CMS Search
        print("Seeding CMS Search Content...")
        cms_search = CMSSearch(
            hero={"title": "ابحث في عيادة الطب الدقيق"},
            popular_searches=[{"label": "الطب الدقيق"}],
            quick_links=[{"label": "احجز موعداً"}],
            cta={"title": "هل تبحث عن الطب الدقيق؟"},
            results_config={"showDoctors": True}
        )
        db.add(cms_search)
        db.commit()
        print("Seeded additional CMS Pages.")

        # 4. Seed CMSServices
        print("Seeding CMSServices...")
        services = [
            CMSService(
                service_id="risk-stratification",
                name="تقييم المخاطر الصحية — Risk Stratification",
                tagline="نستبق قبل أن نطارد",
                description="قراءة عميقة للمخاطر الحالية والمستقبلية — نربط بين الحاضر الصحي والمخاطر المستقبلية",
                long_description="Risk Stratification في ذا مديكال أفينيو ليس مجرد فحص دوري — بل تقييم عميق متعدد الطبقات يفكك الحالة ويقرأ ما وراء العرض. نجمع بين التاريخ الصحي، التحاليل الوظيفية والأيضية، والمؤشرات الجينية لبناء صورة شاملة عن المخاطر الحالية والمستقبلية. الهدف ليس علاج ما ظهر، بل استباق ما لم يظهر بعد.",
                icon="ri-radar-line",
                accent_color="teal",
                image="https://readdy.ai/api/search-image?query=advanced%20medical%20risk%20assessment%20precision%20medicine%20laboratory%20modern%20clinical%20environment%20dark%20teal%20background%20sophisticated%20diagnostic%20technology%20professional%20healthcare&width=600&height=400&seq=srv-risk-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=risk%20stratification%20precision%20medicine%20advanced%20diagnostics%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare%20concept&width=1200&height=500&seq=srv-risk-hero&orientation=landscape",
                category="الطب الدقيق",
                stats=[
                    { "label": "دقيقة لكل جلسة تقييم", "value": "90–120" },
                    { "label": "طبقة تقييم متكاملة", "value": "5+" },
                    { "label": "نسبة رضا المرضى", "value": "99%" },
                    { "label": "سنة خبرة سريرية", "value": "+18" }
                ],
                procedures=[
                    { "icon": "ri-radar-line", "title": "تقييم المخاطر القلبية الأيضية", "desc": "تحليل شامل لعوامل الخطر القلبية والأيضية مع قراءة المسار المستقبلي" },
                    { "icon": "ri-dna-line", "title": "DNA Risk Score", "desc": "تحليل جيني يكشف الاستعدادات الوراثية للأمراض قبل ظهورها" },
                    { "icon": "ri-flask-line", "title": "التحاليل الوظيفية المتقدمة", "desc": "تحاليل أيضية ووظيفية تتجاوز الفحوصات التقليدية لقراءة أعمق" },
                    { "icon": "ri-heart-pulse-line", "title": "تقييم صحة القلب والأوعية", "desc": "فحص متكامل لصحة الجهاز القلبي الوعائي مع قراءة المخاطر المستقبلية" },
                    { "icon": "ri-brain-line", "title": "تقييم المخاطر العصبية", "desc": "قراءة مبكرة لمخاطر التنكس العصبي والزهايمر والأمراض المعرفية" },
                    { "icon": "ri-file-chart-line", "title": "تقرير المخاطر الشامل", "desc": "تقرير سريري مفصل يحدد المخاطر ويضع خطة استباقية شخصية" }
                ],
                prices=[
                    { "name": "جلسة تقييم المخاطر الأساسية", "price": 800, "duration": "90 دقيقة" },
                    { "name": "جلسة تقييم المخاطر المتكاملة", "price": 1400, "duration": "120 دقيقة" },
                    { "name": "DNA Risk Score", "price": 1800, "duration": "نتائج خلال 10 أيام" },
                    { "name": "تحاليل وظيفية متقدمة", "price": 650, "duration": "30 دقيقة" },
                    { "name": "تقييم العمر البيولوجي", "price": 900, "duration": "45 دقيقة" },
                    { "name": "باقة تقييم المخاطر الشاملة", "price": 2800, "duration": "يوم كامل", "note": "تشمل DNA + تحاليل + تقييم + تقرير + خطة شخصية" }
                ],
                doctors=[
                    { "name": "د. فيصل الأحمد", "role": "استشاري الطب الدقيق وتقييم المخاطر", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-risk1&orientation=squarish", "experience": "18 سنة خبرة" },
                    { "name": "د. نورة الزهراني", "role": "استشارية الجينات والطب الدقيق", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=200&height=200&seq=doc-risk2&orientation=squarish", "experience": "12 سنة خبرة" }
                ],
                faqs=[
                    { "q": "ما الفرق بين Risk Stratification والفحص الدوري التقليدي؟", "a": "الفحص الدوري التقليدي يقيس ما هو موجود الآن. Risk Stratification يقرأ المخاطر المستقبلية ويبني صورة شاملة عن المسار الصحي المحتمل، مما يتيح التدخل الاستباقي قبل ظهور الأعراض." },
                    { "q": "من يحتاج إلى تقييم المخاطر؟", "a": "كل من لديه تاريخ عائلي لأمراض مزمنة، أو يعاني من أعراض غير محددة لم تُفسَّر بشكل كافٍ، أو يريد فهمًا حقيقيًا لمساره الصحي المستقبلي." },
                    { "q": "كم تستغرق جلسة التقييم؟", "a": "جلسات التقييم في ذا مديكال أفينيو تمتد من 90 إلى 120 دقيقة — لأن بعض الملفات لا تُفهم في دقائق." }
                ],
                related_services=["dna-risk", "obesity-metabolic", "second-opinion"]
            ),
            CMSService(
                service_id="obesity-metabolic",
                name="السمنة والخلل الأيضي وMASLD",
                tagline="لا نختزل الحالة في الوزن",
                description="نتعامل مع السمنة والخلل الأيضي كمسار أيضي ووظيفي معقد يحتاج قراءة أعمق",
                long_description="في ذا مديكال أفينيو، لا نختزل السمنة في الوزن ولا نعالج MASLD كمجرد دهون في الكبد. نتعامل مع هذه الحالات كمسار أيضي ووظيفي معقد يشمل الاضطرابات الهرمونية، الالتهاب المزمن، خلل الميكروبيوم، والعوامل الجينية. نقدم تقييمًا عميقًا متعدد الطبقات مع خطة علاجية شخصية تتجاوز الحمية والتمارين.",
                icon="ri-scales-line",
                accent_color="orange",
                image="https://readdy.ai/api/search-image?query=metabolic%20medicine%20obesity%20treatment%20advanced%20clinical%20assessment%20modern%20medical%20laboratory%20precision%20diagnostics%20professional%20healthcare%20environment&width=600&height=400&seq=srv-meta-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=metabolic%20syndrome%20MASLD%20liver%20disease%20advanced%20medical%20assessment%20laboratory%20modern%20healthcare%20professional%20environment%20precision%20medicine&width=1200&height=500&seq=srv-meta-hero&orientation=landscape",
                category="الطب الأيضي",
                stats=[
                    { "label": "حالة أيضية تحت الرعاية", "value": "+500" },
                    { "label": "استشاري متخصص", "value": "4" },
                    { "label": "نسبة تحسن الحالات", "value": "94%" },
                    { "label": "سنة خبرة سريرية", "value": "+14" }
                ],
                procedures=[
                    { "icon": "ri-scales-line", "title": "التقييم الأيضي الشامل", "desc": "تحليل متكامل للمسار الأيضي يشمل الهرمونات، الالتهاب، وظائف الكبد والبنكرياس" },
                    { "icon": "ri-flask-line", "title": "تحاليل MASLD المتخصصة", "desc": "تحاليل متقدمة لتقييم درجة التليف الكبدي والالتهاب الأيضي" },
                    { "icon": "ri-scan-2-line", "title": "تصوير الكبد المتقدم", "desc": "Fibroscan وتصوير بالموجات فوق الصوتية لتقييم صحة الكبد بدقة" },
                    { "icon": "ri-dna-line", "title": "التقييم الجيني الأيضي", "desc": "فحص الاستعدادات الجينية للخلل الأيضي والسمنة" },
                    { "icon": "ri-heart-pulse-line", "title": "تقييم المخاطر القلبية الأيضية", "desc": "قراءة شاملة للمخاطر القلبية المرتبطة بالخلل الأيضي" },
                    { "icon": "ri-user-heart-line", "title": "خطة علاجية شخصية", "desc": "بروتوكول علاجي مخصص يتجاوز الحمية التقليدية ويعالج الجذر الأيضي" }
                ],
                prices=[
                    { "name": "جلسة تقييم أيضي أولية", "price": 900, "duration": "90 دقيقة" },
                    { "name": "تحاليل MASLD المتخصصة", "price": 750, "duration": "30 دقيقة" },
                    { "name": "Fibroscan الكبد", "price": 600, "duration": "30 دقيقة" },
                    { "name": "التقييم الجيني الأيضي", "price": 1200, "duration": "نتائج خلال 7 أيام" },
                    { "name": "باقة السمنة والخلل الأيضي الشاملة", "price": 2200, "duration": "يومان", "note": "تقييم + تحاليل + تصوير + خطة علاجية + متابعة 3 أشهر" },
                    { "name": "متابعة شهرية", "price": 400, "duration": "45 دقيقة" }
                ],
                doctors=[
                    { "name": "د. سارة المنصور", "role": "استشارية الخلل الأيضي وMASLD", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=200&height=200&seq=doc-meta1&orientation=squarish", "experience": "14 سنة خبرة" },
                    { "name": "د. طارق الغامدي", "role": "استشاري الكبد والجهاز الهضمي الأيضي", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20clean%20white%20background%20confident%20smile%20portrait%20gastroenterologist%20hepatologist%20specialist&width=200&height=200&seq=doc-meta2&orientation=squarish", "experience": "11 سنة خبرة" }
                ],
                faqs=[
                    { "q": "ما هو MASLD وكيف يختلف عن الكبد الدهني العادي؟", "a": "MASLD هو مرض الكبد الدهني المرتبط بالخلل الأيضي — وهو أكثر تعقيدًا من مجرد تراكم الدهون. يرتبط بالمقاومة للأنسولين، الالتهاب المزمن، والخلل الأيضي الشامل. علاجه يتطلب تقييمًا أعمق من مجرد إنقاص الوزن." },
                    { "q": "هل السمنة مجرد مشكلة غذائية؟", "a": "لا. السمنة في كثير من الحالات هي نتيجة لخلل أيضي معقد يشمل اضطرابات هرمونية، التهابًا مزمنًا، عوامل جينية، وخللًا في الميكروبيوم. نتعامل معها كمسار أيضي ووظيفي، لا كمشكلة إرادة أو نظام غذائي فقط." },
                    { "q": "كم تستغرق رحلة العلاج؟", "a": "تختلف حسب الحالة، لكن في الغالب نضع خطة علاجية لـ 6–12 شهرًا مع متابعة لصيقة ومراجعة دورية للخطة بناءً على الاستجابة." }
                ],
                related_services=["risk-stratification", "dna-risk", "iv-therapy"]
            ),
            CMSService(
                service_id="second-opinion",
                name="Second Opinion الدولي",
                tagline="قرار أكثر اطمئنانًا في الحالات الحساسة",
                description="أداة لاتخاذ قرار طبي أكثر اطمئنانًا واتساعًا — ليس خدمة شكلية",
                long_description="Second Opinion في ذا مديكال أفينيو ليس مجرد إرسال ملف إلكتروني. هو خدمة منظمة تبدأ بتقييم عميق للحالة محليًا، ثم إعداد ملف سريري متكامل، وإرساله إلى مراكز طبية متخصصة في الولايات المتحدة وجنوب كوريا وغيرها، مع ترجمة الرأي الطبي وشرحه للمريض بشكل واضح ومطمئن.",
                icon="ri-global-line",
                accent_color="teal",
                image="https://readdy.ai/api/search-image?query=international%20medical%20consultation%20second%20opinion%20global%20healthcare%20network%20professional%20doctors%20meeting%20modern%20clinic%20sophisticated%20environment&width=600&height=400&seq=srv-2op-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=international%20medical%20second%20opinion%20global%20healthcare%20collaboration%20professional%20doctors%20USA%20Korea%20modern%20clinic%20sophisticated%20environment&width=1200&height=500&seq=srv-2op-hero&orientation=landscape",
                category="الخبرة الدولية",
                stats=[
                    { "label": "مركز طبي دولي شريك", "value": "12+" },
                    { "label": "دولة في الشبكة", "value": "5" },
                    { "label": "حالة تمت مراجعتها دوليًا", "value": "+300" },
                    { "label": "يوم متوسط وقت الاستجابة", "value": "7–14" }
                ],
                procedures=[
                    { "icon": "ri-file-text-line", "title": "إعداد الملف السريري", "desc": "تجميع وتنظيم كامل الملف الطبي بصورة احترافية تناسب المراكز الدولية" },
                    { "icon": "ri-translate-2", "title": "الترجمة الطبية المتخصصة", "desc": "ترجمة دقيقة للوثائق الطبية مع الحفاظ على الدقة السريرية" },
                    { "icon": "ri-global-line", "title": "التواصل مع المراكز الدولية", "desc": "إرسال الملف إلى المراكز المتخصصة في USA وKorea وغيرها" },
                    { "icon": "ri-chat-3-line", "title": "شرح الرأي الطبي", "desc": "جلسة مع الاستشاري لشرح الرأي الدولي وترجمته إلى خطة عملية" },
                    { "icon": "ri-video-line", "title": "استشارة مرئية دولية", "desc": "إمكانية استشارة مرئية مباشرة مع الطبيب الدولي عند الحاجة" },
                    { "icon": "ri-route-line", "title": "تنسيق السفر للعلاج", "desc": "دعم لوجستي كامل لمن يحتاج السفر للعلاج في الخارج" }
                ],
                prices=[
                    { "name": "Second Opinion — مراجعة الملف", "price": 1500, "duration": "7–14 يوم", "note": "رأي طبي مكتوب من مركز دولي" },
                    { "name": "Second Opinion — استشارة مرئية", "price": 2500, "duration": "7–14 يوم", "note": "يشمل جلسة مرئية مع الطبيب الدولي" },
                    { "name": "إعداد الملف السريري", "price": 400, "duration": "3–5 أيام" },
                    { "name": "الترجمة الطبية المتخصصة", "price": 300, "duration": "2–3 أيام" },
                    { "name": "باقة Second Opinion الشاملة", "price": 3500, "duration": "14–21 يوم", "note": "إعداد ملف + ترجمة + رأي دولي + استشارة مرئية + شرح النتائج" }
                ],
                doctors=[
                    { "name": "د. فيصل الأحمد", "role": "منسق Second Opinion الدولي", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-2op1&orientation=squarish", "experience": "18 سنة خبرة" }
                ],
                faqs=[
                    { "q": "ما الحالات التي تستفيد من Second Opinion الدولي؟", "a": "الحالات المعقدة أو النادرة، الحالات التي لم تستجب للعلاج المعتاد، قرارات جراحية كبرى، تشخيصات غير مؤكدة، أو أي حالة يشعر فيها المريض بعدم الاطمئنان الكافي للقرار الطبي." },
                    { "q": "كم يستغرق الحصول على الرأي الدولي؟", "a": "في الغالب من 7 إلى 14 يومًا من تاريخ إرسال الملف الكامل. الحالات العاجلة يمكن تسريعها." },
                    { "q": "هل يمكن التواصل مباشرة مع الطبيب الدولي؟", "a": "نعم، في باقة Second Opinion الشاملة يمكن ترتيب استشارة مرئية مباشرة مع الطبيب الدولي." }
                ],
                related_services=["risk-stratification", "alzheimer", "osteoporosis"]
            ),
            CMSService(
                service_id="dna-risk",
                name="DNA Risk Score",
                tagline="نقرأ مستقبلك الصحي قبل أن يحدث",
                description="تحليل جيني يكشف الاستعدادات والمخاطر المستقبلية — لا للاستعراض التقني",
                long_description="DNA Risk Score في ذا مديكال أفينيو أداة سريرية حقيقية، لا استعراض تقني. نستخدم تحليل الـ DNA لفهم الاستعدادات الجينية للأمراض المستقبلية، ونترجم هذه النتائج إلى خطة وقائية شخصية قابلة للتطبيق. الهدف ليس إخافة المريض بأرقام جينية، بل تمكينه من قرارات صحية أكثر ذكاءً.",
                icon="ri-dna-line",
                accent_color="violet",
                image="https://readdy.ai/api/search-image?query=DNA%20genetic%20testing%20precision%20medicine%20laboratory%20advanced%20genomics%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare&width=600&height=400&seq=srv-dna-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=DNA%20risk%20score%20genetic%20testing%20precision%20medicine%20advanced%20genomics%20laboratory%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare&width=1200&height=500&seq=srv-dna-hero&orientation=landscape",
                category="الجينات والطب الدقيق",
                stats=[
                    { "label": "مرض يمكن تقييم خطره جينيًا", "value": "50+" },
                    { "label": "دقة التحليل الجيني", "value": "99.9%" },
                    { "label": "يوم للحصول على النتائج", "value": "10–14" },
                    { "label": "سنة خبرة في الطب الجيني", "value": "+12" }
                ],
                procedures=[
                    { "icon": "ri-dna-line", "title": "تحليل DNA Risk Score الشامل", "desc": "تحليل جيني يغطي أكثر من 50 مرضًا ومخاطر صحية مستقبلية" },
                    { "icon": "ri-heart-pulse-line", "title": "المخاطر القلبية الجينية", "desc": "تقييم الاستعداد الجيني لأمراض القلب والأوعية الدموية" },
                    { "icon": "ri-brain-line", "title": "مخاطر التنكس العصبي", "desc": "تقييم الاستعداد الجيني للزهايمر والأمراض العصبية التنكسية" },
                    { "icon": "ri-scales-line", "title": "الاستعداد الجيني للخلل الأيضي", "desc": "فهم الجذر الجيني للسمنة والسكري والخلل الأيضي" },
                    { "icon": "ri-mental-health-line", "title": "DNA النفسي", "desc": "تقييم الاستعداد الجيني للاضطرابات النفسية والمزاجية" },
                    { "icon": "ri-file-chart-line", "title": "تقرير وخطة وقائية", "desc": "ترجمة النتائج الجينية إلى خطة وقائية شخصية قابلة للتطبيق" }
                ],
                prices=[
                    { "name": "DNA Risk Score الأساسي", "price": 1800, "duration": "10–14 يوم", "note": "يشمل 20 مرضًا رئيسيًا" },
                    { "name": "DNA Risk Score الشامل", "price": 2800, "duration": "10–14 يوم", "note": "يشمل 50+ مرضًا ومخاطر" },
                    { "name": "DNA النفسي", "price": 1500, "duration": "10–14 يوم" },
                    { "name": "تقييم العمر البيولوجي", "price": 900, "duration": "45 دقيقة" },
                    { "name": "باقة DNA الشاملة", "price": 4200, "duration": "14–21 يوم", "note": "DNA Risk Score + DNA نفسي + عمر بيولوجي + جلسة تفسير + خطة وقائية" }
                ],
                doctors=[
                    { "name": "د. نورة الزهراني", "role": "استشارية الجينات والطب الدقيق", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=200&height=200&seq=doc-dna1&orientation=squarish", "experience": "12 سنة خبرة" },
                    { "name": "د. فيصل الأحمد", "role": "استشاري الطب الدقيق", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-dna2&orientation=squarish", "experience": "18 سنة خبرة" }
                ],
                faqs=[
                    { "q": "هل DNA Risk Score يعني أنني سأصاب بالمرض حتمًا؟", "a": "لا. الجينات تحدد الاستعداد، لا المصير. DNA Risk Score يكشف الاحتمالات ليتمكن الطبيب من وضع خطة وقائية تقلل هذه المخاطر. كثير من الأمراض يمكن تأخيرها أو منعها بالتدخل المبكر الصحيح." },
                    { "q": "كيف يتم أخذ العينة؟", "a": "العينة تؤخذ بمسحة بسيطة من الفم أو عينة دم صغيرة — إجراء غير مؤلم تمامًا." },
                    { "q": "هل النتائج سرية؟", "a": "نعم، نتائج DNA Risk Score سرية تمامًا ولا تُشارك مع أي جهة خارجية دون إذن صريح من المريض." }
                ],
                related_services=["risk-stratification", "obesity-metabolic", "alzheimer"]
            ),
            CMSService(
                service_id="iv-therapy",
                name="العلاجات الوريدية المتخصصة",
                tagline="بروتوكولات مبنية على التقييم الأيضي",
                description="علاجات وريدية مخصصة مبنية على التقييم الأيضي والوظيفي — لا بروتوكولات عامة",
                long_description="العلاجات الوريدية في ذا مديكال أفينيو ليست جلسات عامة — بل بروتوكولات مخصصة تُبنى على التقييم الأيضي والوظيفي لكل مريض. نحدد التركيبة المناسبة بناءً على نتائج التحاليل والتقييم السريري، لضمان أقصى فعالية وأعلى أمان.",
                icon="ri-drop-line",
                accent_color="cyan",
                image="https://readdy.ai/api/search-image?query=intravenous%20IV%20therapy%20specialized%20medical%20treatment%20modern%20clinical%20room%20clean%20professional%20healthcare%20environment%20sophisticated%20equipment&width=600&height=400&seq=srv-iv-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=IV%20therapy%20specialized%20intravenous%20treatment%20modern%20clinical%20environment%20professional%20healthcare%20sophisticated%20medical%20equipment&width=1200&height=500&seq=srv-iv-hero&orientation=landscape",
                category="العلاجات المتخصصة",
                stats=[
                    { "label": "بروتوكول وريدي متخصص", "value": "15+" },
                    { "label": "جلسة شهريًا", "value": "+200" },
                    { "label": "نسبة رضا المرضى", "value": "98%" },
                    { "label": "سنة خبرة", "value": "+10" }
                ],
                procedures=[
                    { "icon": "ri-drop-line", "title": "بروتوكول الطاقة الخلوية", "desc": "تركيبة وريدية لدعم وظيفة الميتوكوندريا وتحسين إنتاج الطاقة الخلوية" },
                    { "icon": "ri-shield-flash-line", "title": "بروتوكول مضادات الأكسدة", "desc": "جرعات عالية من مضادات الأكسدة لمكافحة الإجهاد التأكسدي والالتهاب المزمن" },
                    { "icon": "ri-heart-pulse-line", "title": "بروتوكول صحة القلب الأيضي", "desc": "تركيبة وريدية لدعم صحة القلب والأوعية الدموية على المستوى الأيضي" },
                    { "icon": "ri-brain-line", "title": "بروتوكول الدعم العصبي", "desc": "تركيبة وريدية لدعم وظائف الدماغ والجهاز العصبي" },
                    { "icon": "ri-scales-line", "title": "بروتوكول الدعم الأيضي", "desc": "تركيبة مخصصة لدعم التوازن الأيضي وتحسين حساسية الأنسولين" },
                    { "icon": "ri-flask-line", "title": "تحاليل ما قبل الجلسة", "desc": "تحاليل وظيفية لتحديد التركيبة المناسبة لكل مريض" }
                ],
                prices=[
                    { "name": "جلسة وريدية أساسية", "price": 450, "duration": "60–90 دقيقة" },
                    { "name": "بروتوكول الطاقة الخلوية", "price": 750, "duration": "90 دقيقة" },
                    { "name": "بروتوكول مضادات الأكسدة العالية", "price": 850, "duration": "90 دقيقة" },
                    { "name": "بروتوكول الدعم العصبي", "price": 900, "duration": "90 دقيقة" },
                    { "name": "باقة 5 جلسات مخصصة", "price": 3200, "duration": "شهر", "note": "تشمل تحاليل + 5 جلسات + متابعة" },
                    { "name": "باقة 10 جلسات مخصصة", "price": 5800, "duration": "شهرين", "note": "تشمل تحاليل + 10 جلسات + متابعة" }
                ],
                doctors=[
                    { "name": "د. ريم الحربي", "role": "استشارية العلاجات الوريدية المتخصصة", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20IV%20therapy%20specialist%20medical%20professional&width=200&height=200&seq=doc-iv1&orientation=squarish", "experience": "10 سنوات خبرة" },
                    { "name": "د. سارة المنصور", "role": "استشارية الخلل الأيضي", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=200&height=200&seq=doc-iv2&orientation=squarish", "experience": "14 سنة خبرة" }
                ],
                faqs=[
                    { "q": "هل العلاجات الوريدية آمنة؟", "a": "نعم، عند تطبيقها بشكل صحيح بناءً على تقييم سريري ومخبري دقيق. في ذا مديكال أفينيو، كل جلسة تسبقها تحاليل لتحديد التركيبة المناسبة وضمان السلامة." },
                    { "q": "كم عدد الجلسات المطلوبة؟", "a": "يختلف حسب الحالة والهدف العلاجي. في الغالب نبدأ بـ 4–6 جلسات ثم نقيّم الاستجابة ونعدّل الخطة." },
                    { "q": "هل يمكن الجمع بين العلاجات الوريدية وبروتوكولات أخرى؟", "a": "نعم، العلاجات الوريدية غالبًا تكون جزءًا من خطة علاجية متكاملة تشمل تعديلات غذائية وأدوية وتغييرات في نمط الحياة." }
                ],
                related_services=["obesity-metabolic", "risk-stratification", "osteoporosis"]
            ),
            CMSService(
                service_id="psychiatry",
                name="الطب النفسي للبالغين",
                tagline="تقييم عميق ما وراء الأعراض",
                description="تقييم نفسي عميق متعدد الطبقات مع خطط علاجية شخصية تربط البيولوجي بالنفسي",
                long_description="الطب النفسي في ذا مديكال أفينيو يتجاوز البروتوكولات التقليدية. نقدم تقييمًا نفسيًا عميقًا يربط بين الأبعاد البيولوجية والنفسية والاجتماعية، مع استخدام أدوات متقدمة كـ DNA النفسي لفهم الاستعدادات الجينية للاضطرابات النفسية. خطتنا العلاجية شخصية ومبنية على فهم حقيقي للحالة.",
                icon="ri-mental-health-line",
                accent_color="rose",
                image="https://readdy.ai/api/search-image?query=adult%20psychiatry%20mental%20health%20consultation%20modern%20clinical%20environment%20calm%20professional%20therapeutic%20setting%20sophisticated%20healthcare&width=600&height=400&seq=srv-psych-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=adult%20psychiatry%20mental%20health%20deep%20assessment%20modern%20clinical%20environment%20calm%20professional%20therapeutic%20setting%20sophisticated%20healthcare%20concept&width=1200&height=500&seq=srv-psych-hero&orientation=landscape",
                category="الطب النفسي",
                stats=[
                    { "label": "حالة تحت الرعاية", "value": "+400" },
                    { "label": "استشاري نفسي", "value": "3" },
                    { "label": "نسبة رضا المرضى", "value": "97%" },
                    { "label": "سنة خبرة", "value": "+16" }
                ],
                procedures=[
                    { "icon": "ri-mental-health-line", "title": "التقييم النفسي الشامل", "desc": "جلسة تقييم 90 دقيقة تفكك الحالة وتقرأ الأبعاد البيولوجية والنفسية والاجتماعية" },
                    { "icon": "ri-dna-line", "title": "DNA النفسي", "desc": "تقييم الاستعداد الجيني للاضطرابات النفسية والمزاجية" },
                    { "icon": "ri-brain-line", "title": "تقييم الوظائف المعرفية", "desc": "اختبارات معرفية متخصصة لتقييم الذاكرة والتركيز والوظائف التنفيذية" },
                    { "icon": "ri-heart-pulse-line", "title": "تقييم الصحة النفسية الجسدية", "desc": "ربط الأعراض النفسية بالعوامل البيولوجية والهرمونية" },
                    { "icon": "ri-user-heart-line", "title": "خطة علاجية شخصية", "desc": "بروتوكول علاجي مخصص يجمع بين الدواء والعلاج النفسي وتعديل نمط الحياة" },
                    { "icon": "ri-calendar-check-line", "title": "متابعة لصيقة", "desc": "جلسات متابعة منتظمة مع تعديل الخطة بناءً على الاستجابة" }
                ],
                prices=[
                    { "name": "جلسة تقييم نفسي أولية", "price": 900, "duration": "90 دقيقة" },
                    { "name": "جلسة متابعة", "price": 500, "duration": "60 دقيقة" },
                    { "name": "DNA النفسي", "price": 1500, "duration": "10–14 يوم" },
                    { "name": "تقييم الوظائف المعرفية", "price": 700, "duration": "90 دقيقة" },
                    { "name": "باقة الرعاية النفسية الشاملة", "price": 3500, "duration": "3 أشهر", "note": "تقييم + DNA نفسي + 6 جلسات متابعة + خطة علاجية" }
                ],
                doctors=[
                    { "name": "د. خالد العمر", "role": "استشاري الطب النفسي للبالغين", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20glasses%20clean%20white%20background%20confident%20smile%20portrait%20psychiatrist%20specialist%20senior&width=200&height=200&seq=doc-psych1&orientation=squarish", "experience": "16 سنة خبرة" }
                ],
                faqs=[
                    { "q": "ما الذي يميز الطب النفسي في ذا مديكال أفينيو؟", "a": "نقدم تقييمًا نفسيًا عميقًا يتجاوز الأعراض ليفهم الجذور البيولوجية والنفسية والاجتماعية للحالة. نستخدم DNA النفسي لفهم الاستعدادات الجينية، ونضع خطة علاجية شخصية لا بروتوكولًا عامًا." },
                    { "q": "هل الطب النفسي يعني الأدوية فقط؟", "a": "لا. خطتنا العلاجية تجمع بين الدواء (عند الحاجة)، العلاج النفسي، تعديل نمط الحياة، والتدخلات البيولوجية. الهدف هو معالجة الجذر، لا إدارة الأعراض فقط." },
                    { "q": "هل الجلسات سرية؟", "a": "نعم، جميع الجلسات والمعلومات سرية تمامًا ومحمية بموجب أعلى معايير الخصوصية الطبية." }
                ],
                related_services=["dna-risk", "risk-stratification", "iv-therapy"]
            ),
            CMSService(
                service_id="osteoporosis",
                name="هشاشة العظام المكثفة",
                tagline="رعاية متخصصة ومكثفة لا بروتوكول عام",
                description="رعاية متخصصة ومكثفة لهشاشة العظام مع خطط علاجية شخصية وقراءة مخاطر مستقبلية",
                long_description="هشاشة العظام في ذا مديكال أفينيو تُعالَج كحالة أيضية وهرمونية معقدة، لا كمجرد نقص في الكالسيوم. نقدم تقييمًا عميقًا يشمل كثافة العظام، الهرمونات، العوامل الجينية، والمخاطر المستقبلية للكسور، مع خطة علاجية مكثفة ومتابعة لصيقة.",
                icon="ri-body-scan-line",
                accent_color="amber",
                image="https://readdy.ai/api/search-image?query=osteoporosis%20bone%20density%20advanced%20medical%20treatment%20modern%20clinical%20environment%20professional%20healthcare%20sophisticated%20diagnostics&width=600&height=400&seq=srv-osteo-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=osteoporosis%20intensive%20care%20bone%20health%20advanced%20medical%20assessment%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare&width=1200&height=500&seq=srv-osteo-hero&orientation=landscape",
                category="العظام والأيض",
                stats=[
                    { "label": "حالة تحت الرعاية", "value": "+350" },
                    { "label": "استشاري متخصص", "value": "2" },
                    { "label": "نسبة تحسن كثافة العظام", "value": "89%" },
                    { "label": "سنة خبرة", "value": "+15" }
                ],
                procedures=[
                    { "icon": "ri-scan-line", "title": "قياس كثافة العظام DEXA", "desc": "قياس دقيق لكثافة العظام في مناطق متعددة مع تحليل مفصل للنتائج" },
                    { "icon": "ri-flask-line", "title": "تحاليل الأيض العظمي", "desc": "تحاليل متخصصة لمؤشرات بناء وهدم العظام والعوامل الهرمونية" },
                    { "icon": "ri-dna-line", "title": "التقييم الجيني لهشاشة العظام", "desc": "فحص الاستعدادات الجينية لهشاشة العظام والكسور" },
                    { "icon": "ri-heart-pulse-line", "title": "تقييم مخاطر الكسور", "desc": "حساب FRAX وتقييم شامل لمخاطر الكسور المستقبلية" },
                    { "icon": "ri-syringe-line", "title": "العلاجات البيولوجية المتخصصة", "desc": "بروتوكولات علاجية متقدمة تشمل العلاجات البيولوجية الحديثة" },
                    { "icon": "ri-calendar-check-line", "title": "متابعة مكثفة", "desc": "متابعة دورية مع قياس كثافة العظام وتعديل الخطة العلاجية" }
                ],
                prices=[
                    { "name": "جلسة تقييم هشاشة العظام", "price": 700, "duration": "90 دقيقة" },
                    { "name": "قياس كثافة العظام DEXA", "price": 350, "duration": "30 دقيقة" },
                    { "name": "تحاليل الأيض العظمي الشاملة", "price": 550, "duration": "30 دقيقة" },
                    { "name": "التقييم الجيني لهشاشة العظام", "price": 1200, "duration": "10–14 يوم" },
                    { "name": "باقة هشاشة العظام المكثفة", "price": 2500, "duration": "6 أشهر", "note": "تقييم + تحاليل + DEXA + خطة علاجية + متابعة 6 أشهر" }
                ],
                doctors=[
                    { "name": "د. محمد الراشد", "role": "استشاري هشاشة العظام المكثفة", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20clean%20white%20background%20confident%20smile%20portrait%20orthopedic%20bone%20specialist%20senior&width=200&height=200&seq=doc-osteo1&orientation=squarish", "experience": "15 سنة خبرة" }
                ],
                faqs=[
                    { "q": "هل هشاشة العظام قابلة للعلاج؟", "a": "نعم، مع التشخيص المبكر والعلاج المناسب يمكن تحسين كثافة العظام بشكل ملحوظ وتقليل مخاطر الكسور. العلاجات البيولوجية الحديثة أحدثت ثورة في علاج هشاشة العظام الشديدة." },
                    { "q": "من يحتاج إلى فحص كثافة العظام؟", "a": "النساء بعد سن اليأس، الرجال فوق 65 سنة، من لديهم تاريخ عائلي لهشاشة العظام، من يتناولون الكورتيزون لفترات طويلة، ومن عانوا من كسور بسبب صدمات بسيطة." }
                ],
                related_services=["risk-stratification", "iv-therapy", "second-opinion"]
            ),
            CMSService(
                service_id="alzheimer",
                name="الزهايمر والتنكس العصبي",
                tagline="تقييم مبكر وخطط وقائية للحالات عالية الخطورة",
                description="تقييم مبكر للمخاطر العصبية التنكسية مع خطط وقائية شخصية قبل ظهور الأعراض",
                long_description="في ذا مديكال أفينيو، نتعامل مع الزهايمر والتنكس العصبي كحالات يمكن استباقها، لا مجرد انتظار ظهورها. نقدم تقييمًا مبكرًا شاملًا يشمل الاستعدادات الجينية، المؤشرات الحيوية العصبية، والوظائف المعرفية، مع خطة وقائية شخصية تهدف إلى تأخير أو منع التنكس العصبي.",
                icon="ri-brain-line",
                accent_color="violet",
                image="https://readdy.ai/api/search-image?query=Alzheimer%20neurodegeneration%20brain%20health%20advanced%20medical%20assessment%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare&width=600&height=400&seq=srv-alz-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=Alzheimer%20prevention%20early%20detection%20brain%20health%20advanced%20medical%20assessment%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare&width=1200&height=500&seq=srv-alz-hero&orientation=landscape",
                category="الطب العصبي الوقائي",
                stats=[
                    { "label": "حالة تحت المتابعة الوقائية", "value": "+200" },
                    { "label": "استشاري متخصص", "value": "2" },
                    { "label": "سنة مبكرة يمكن الكشف فيها", "value": "10–20" },
                    { "label": "سنة خبرة", "value": "+12" }
                ],
                procedures=[
                    { "icon": "ri-brain-line", "title": "تقييم الوظائف المعرفية", "desc": "اختبارات معرفية متخصصة لتقييم الذاكرة والتركيز والوظائف التنفيذية" },
                    { "icon": "ri-dna-line", "title": "التقييم الجيني للزهايمر", "desc": "فحص جينات APOE وغيرها من المؤشرات الجينية للتنكس العصبي" },
                    { "icon": "ri-scan-2-line", "title": "تصوير الدماغ المتقدم", "desc": "MRI وظيفي وتصوير متقدم لتقييم صحة الدماغ والكشف المبكر" },
                    { "icon": "ri-flask-line", "title": "المؤشرات الحيوية العصبية", "desc": "تحاليل متخصصة للمؤشرات الحيوية المرتبطة بالتنكس العصبي" },
                    { "icon": "ri-shield-flash-line", "title": "خطة وقائية شخصية", "desc": "بروتوكول وقائي مخصص يشمل التدخلات الغذائية والدوائية ونمط الحياة" },
                    { "icon": "ri-calendar-check-line", "title": "متابعة سنوية", "desc": "تقييم سنوي لمتابعة المؤشرات وتعديل الخطة الوقائية" }
                ],
                prices=[
                    { "name": "جلسة تقييم مخاطر الزهايمر", "price": 900, "duration": "90 دقيقة" },
                    { "name": "تقييم الوظائف المعرفية", "price": 700, "duration": "90 دقيقة" },
                    { "name": "التقييم الجيني للزهايمر", "price": 1500, "duration": "10–14 يوم" },
                    { "name": "MRI دماغ متقدم", "price": 1200, "duration": "60 دقيقة" },
                    { "name": "باقة الوقاية من الزهايمر الشاملة", "price": 3800, "duration": "شهر", "note": "تقييم + جيني + MRI + تحاليل + خطة وقائية + متابعة سنة" }
                ],
                doctors=[
                    { "name": "د. فيصل الأحمد", "role": "استشاري الطب الدقيق والوقاية العصبية", "image": "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-alz1&orientation=squarish", "experience": "18 سنة خبرة" },
                    { "name": "د. نورة الزهراني", "role": "استشارية الجينات والطب الدقيق", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=200&height=200&seq=doc-alz2&orientation=squarish", "experience": "12 سنة خبرة" }
                ],
                faqs=[
                    { "q": "هل يمكن الوقاية من الزهايمر؟", "a": "الأبحاث الحديثة تشير إلى أن التدخل المبكر يمكن أن يؤخر أو يقلل من خطر الإصابة بالزهايمر بشكل ملحوظ. التقييم المبكر للمخاطر يتيح وضع خطة وقائية قبل ظهور الأعراض بسنوات." },
                    { "q": "من يحتاج إلى تقييم مخاطر الزهايمر؟", "a": "من لديهم تاريخ عائلي للزهايمر، من يلاحظون تراجعًا في الذاكرة أو التركيز، ومن يرغبون في تقييم مخاطرهم المستقبلية بشكل استباقي." }
                ],
                related_services=["dna-risk", "risk-stratification", "second-opinion"]
            ),
            CMSService(
                service_id="mitochondrial",
                name="خلل الميتوكوندريا",
                tagline="طاقة خلوية أعمق من المظهر",
                description="تشخيص وعلاج اضطرابات الطاقة الخلوية بأحدث التقنيات — خدمة تبني الهيبة العلمية",
                long_description="خلل الميتوكوندريا من أكثر الحالات التي تُفوَّت في الطب التقليدي. في ذا مديكال أفينيو، نقدم تقييمًا متخصصًا لوظيفة الميتوكوندريا وإنتاج الطاقة الخلوية، مع بروتوكولات علاجية مخصصة تشمل التدخلات الغذائية والمكملات المتخصصة والعلاجات الوريدية.",
                icon="ri-flashlight-line",
                accent_color="green",
                image="https://readdy.ai/api/search-image?query=mitochondrial%20dysfunction%20cellular%20energy%20medicine%20advanced%20laboratory%20precision%20diagnostics%20modern%20clinical%20environment%20professional%20healthcare&width=600&height=400&seq=srv-mito-ma1&orientation=landscape",
                hero_image="https://readdy.ai/api/search-image?query=mitochondrial%20health%20cellular%20energy%20advanced%20medical%20assessment%20laboratory%20precision%20diagnostics%20modern%20clinical%20environment%20professional%20healthcare&width=1200&height=500&seq=srv-mito-hero&orientation=landscape",
                category="الطب الخلوي",
                stats=[
                    { "label": "حالة تحت الرعاية", "value": "+150" },
                    { "label": "استشاري متخصص", "value": "2" },
                    { "label": "نسبة تحسن مستوى الطاقة", "value": "91%" },
                    { "label": "سنة خبرة", "value": "+10" }
                ],
                procedures=[
                    { "icon": "ri-flashlight-line", "title": "تقييم وظيفة الميتوكوندريا", "desc": "تحاليل متخصصة لتقييم كفاءة إنتاج الطاقة الخلوية" },
                    { "icon": "ri-flask-line", "title": "تحاليل الإجهاد التأكسدي", "desc": "قياس مستوى الإجهاد التأكسدي والالتهاب الخلوي" },
                    { "icon": "ri-dna-line", "title": "التقييم الجيني للميتوكوندريا", "desc": "فحص الطفرات الجينية المرتبطة بخلل الميتوكوندريا" },
                    { "icon": "ri-drop-line", "title": "بروتوكول الدعم الميتوكوندري الوريدي", "desc": "تركيبة وريدية متخصصة لدعم وظيفة الميتوكوندريا" },
                    { "icon": "ri-user-heart-line", "title": "خطة علاجية شخصية", "desc": "بروتوكول علاجي يشمل التدخلات الغذائية والمكملات والعلاجات الوريدية" }
                ],
                prices=[
                    { "name": "جلسة تقييم الميتوكوندريا", "price": 800, "duration": "90 دقيقة" },
                    { "name": "تحاليل الإجهاد التأكسدي", "price": 600, "duration": "30 دقيقة" },
                    { "name": "التقييم الجيني للميتوكوندريا", "price": 1500, "duration": "10–14 يوم" },
                    { "name": "باقة دعم الميتوكوندريا الشاملة", "price": 3200, "duration": "3 أشهر", "note": "تقييم + تحاليل + جيني + 6 جلسات وريدية + متابعة" }
                ],
                doctors=[
                    { "name": "د. سارة المنصور", "role": "استشارية الخلل الأيضي والميتوكوندري", "image": "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=200&height=200&seq=doc-mito1&orientation=squarish", "experience": "14 سنة خبرة" }
                ],
                faqs=[
                    { "q": "ما أعراض خلل الميتوكوندريا؟", "a": "التعب المزمن غير المفسَّر، ضعف العضلات، صعوبة التركيز، حساسية للضوء والصوت، وأعراض متعددة لا تُفسَّر بتشخيص واحد. كثير من هذه الحالات تُفوَّت في الطب التقليدي." },
                    { "q": "هل خلل الميتوكوندريا قابل للعلاج؟", "a": "مع التشخيص الصحيح والبروتوكول العلاجي المناسب، يمكن تحسين وظيفة الميتوكوندريا بشكل ملحوظ وتقليل الأعراض." }
                ],
                related_services=["iv-therapy", "obesity-metabolic", "risk-stratification"]
            )
        ]
        db.add_all(services)
        db.commit()
        print(f"Seeded {len(services)} CMSServices.")

        # 5. Seed CMSDoctor
        print("Seeding CMSDoctors...")
        doctors = [
            CMSDoctor(
                doctor_id="dr-faisal",
                name="د. فيصل الأحمد",
                specialty="الطب الدقيق وتقييم المخاطر",
                experience="18 سنة خبرة",
                image="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=400&height=500&seq=doc-ma-f1&orientation=portrait",
                rating=4.9,
                reviews_count=287,
                title="استشاري الطب الدقيق وتقييم المخاطر الصحية",
                education="دكتوراه في الطب الدقيق — جامعة هارفارد الطبية",
                languages=["العربية", "الإنجليزية"],
                available_days=["السبت", "الأحد", "الاثنين", "الثلاثاء"],
                bio="د. فيصل الأحمد المدير الطبي لذا مديكال أفينيو، حاصل على دكتوراه من جامعة هارفارد الطبية في الطب الدقيق. يقود فريق التقييم العميق ويتخصص في Risk Stratification وقراءة المخاطر الصحية المستقبلية. يؤمن بأن الطب الحقيقي يبدأ بالفهم قبل القرار، ويمنح كل حالة الوقت الذي تستحقه.",
                specializations=["Risk Stratification", "DNA Risk Score", "الطب الوقائي المتقدم", "Second Opinion الدولي", "الزهايمر والوقاية العصبية"],
                achievements=[
                    "دكتوراه من جامعة هارفارد الطبية",
                    "شراكة مع مراكز طبية في USA وKorea",
                    "رائد تطبيق DNA Risk Score سريريًا في المنطقة",
                    "أكثر من 60 بحث علمي دولي منشور"
                ],
                consultation_fee="900",
                reviews=[
                    { "name": "م. عبدالرحمن الفيصل", "rating": 5, "text": "بعد سنوات من الزيارات السريعة، جاءت جلسة التقييم مع د. فيصل لتغير كل شيء. 90 دقيقة من الاستماع الحقيقي والتحليل العميق. أخيرًا فهمت ما يحدث في جسمي.", "date": "أبريل 2026" },
                    { "name": "خالد المطيري", "rating": 5, "text": "Second Opinion الدولي الذي نظّمه د. فيصل غيّر قرار العلاج بالكامل. احترافية عالية وفهم حقيقي للحالة.", "date": "مارس 2026" },
                    { "name": "سلطان الدوسري", "rating": 5, "text": "DNA Risk Score كشف مخاطر لم أكن أعلم بها. الآن لدي خطة وقائية حقيقية. هذا هو الطب الذي كنت أبحث عنه.", "date": "فبراير 2026" }
                ]
            ),
            CMSDoctor(
                doctor_id="dr-sara",
                name="د. سارة المنصور",
                specialty="الخلل الأيضي وMASLD",
                experience="14 سنة خبرة",
                image="https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=400&height=500&seq=doc-ma-s1&orientation=portrait",
                rating=4.9,
                reviews_count=234,
                title="استشارية الخلل الأيضي والسمنة وMASLD",
                education="ماجستير الطب الأيضي — جامعة كيمبريدج",
                languages=["العربية", "الإنجليزية"],
                available_days=["الأحد", "الاثنين", "الأربعاء", "الخميس"],
                bio="د. سارة المنصور استشارية متخصصة في الخلل الأيضي والسمنة وMASLD بخبرة 14 عامًا. حاصلة على ماجستير من جامعة كيمبريدج. تؤمن بأن السمنة والخلل الأيضي مسار أيضي ووظيفي معقد يحتاج قراءة أعمق من مجرد إنقاص الوزن. تقدم تقييمًا عميقًا متعدد الطبقات مع خطط علاجية شخصية.",
                specializations=["MASLD وأمراض الكبد الأيضية", "السمنة والخلل الأيضي", "مقاومة الأنسولين", "الالتهاب المزمن", "خلل الميتوكوندريا"],
                achievements=[
                    "ماجستير من جامعة كيمبريدج في الطب الأيضي",
                    "رائدة علاج MASLD في المنطقة",
                    "أكثر من 35 بحث علمي منشور",
                    "عضو الجمعية الدولية لأمراض الكبد"
                ],
                consultation_fee="800",
                reviews=[
                    { "name": "أم فيصل", "rating": 5, "text": "د. سارة لم تعاملني كمريضة سمنة عادية. فهمت الجذر الأيضي لحالتي ووضعت خطة علاجية حقيقية. تحسنت بشكل لم أتوقعه.", "date": "أبريل 2026" },
                    { "name": "نوف السعيد", "rating": 5, "text": "MASLD كان يقلقني كثيرًا. د. سارة شرحت لي الحالة بعمق وأعطتني خطة علاجية واضحة. الآن مؤشراتي تتحسن.", "date": "مارس 2026" }
                ]
            ),
            CMSDoctor(
                doctor_id="dr-khalid",
                name="د. خالد العمر",
                specialty="الطب النفسي للبالغين",
                experience="16 سنة خبرة",
                image="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20glasses%20clean%20white%20background%20confident%20smile%20portrait%20psychiatrist%20specialist%20senior&width=400&height=500&seq=doc-ma-k1&orientation=portrait",
                rating=4.8,
                reviews_count=198,
                title="استشاري الطب النفسي للبالغين والتقييم المعرفي",
                education="دكتوراه الطب النفسي — جامعة لندن",
                languages=["العربية", "الإنجليزية"],
                available_days=["السبت", "الاثنين", "الأربعاء"],
                bio="د. خالد العمر استشاري متخصص في الطب النفسي للبالغين بخبرة 16 عامًا. حاصل على دكتوراه من جامعة لندن. يقدم تقييمًا نفسيًا عميقًا يتجاوز الأعراض ليفهم الجذور البيولوجية والنفسية والاجتماعية للحالة. يستخدم DNA النفسي كأداة سريرية لفهم الاستعدادات الجينية للاضطرابات النفسية.",
                specializations=["الاكتئاب والقلق المزمن", "الاضطرابات المزاجية", "DNA النفسي", "التقييم المعرفي", "الطب النفسي البيولوجي"],
                achievements=[
                    "دكتوراه من جامعة لندن في الطب النفسي",
                    "رائد تطبيق DNA النفسي سريريًا",
                    "أكثر من 40 بحث علمي منشور",
                    "عضو الجمعية الأوروبية للطب النفسي"
                ],
                consultation_fee="850",
                reviews=[
                    { "name": "عبدالله الغامدي", "rating": 5, "text": "د. خالد لم يعطني وصفة دواء في أول جلسة. أمضى 90 دقيقة يفهم حالتي من جميع الجوانب. هذا هو الطب النفسي الحقيقي.", "date": "أبريل 2026" },
                    { "name": "ريم الشهري", "rating": 5, "text": "DNA النفسي كشف استعدادًا جينيًا للقلق. الآن خطتي العلاجية مبنية على بيولوجيتي الخاصة، لا على بروتوكول عام.", "date": "مارس 2026" }
                ]
            ),
            CMSDoctor(
                doctor_id="dr-nora",
                name="د. نورة الزهراني",
                specialty="الجينات والطب الدقيق",
                experience="12 سنة خبرة",
                image="https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=400&height=500&seq=doc-ma-n1&orientation=portrait",
                rating=4.9,
                reviews_count=176,
                title="استشارية الجينات والطب الدقيق والوقاية المبكرة",
                education="ماجستير الجينات الطبية — جامعة ستانفورد",
                languages=["العربية", "الإنجليزية"],
                available_days=["السبت", "الأحد", "الثلاثاء", "الخميس"],
                bio="د. نورة الزهراني استشارية متخصصة في الجينات الطبية والطب الدقيق بخبرة 12 عامًا. حاصلة على ماجستير من جامعة ستانفورد. تتخصص في DNA Risk Score وتحليل الاستعدادات الجينية للأمراض المستقبلية، وترجمة النتائج الجينية إلى خطط وقائية شخصية قابلة للتطبيق.",
                specializations=["DNA Risk Score", "الجينات الطبية", "الوقاية المبكرة", "الزهايمر الجيني", "DNA النفسي"],
                achievements=[
                    "ماجستير من جامعة ستانفورد في الجينات الطبية",
                    "رائدة تطبيق DNA Risk Score في المنطقة",
                    "أكثر من 30 بحث علمي منشور",
                    "عضو الجمعية الأمريكية للجينات الطبية"
                ],
                consultation_fee="750",
                reviews=[
                    { "name": "د. منى الشريف", "rating": 5, "text": "DNA Risk Score مع د. نورة كشف استعدادًا وراثيًا لم أكن أعلم به. الآن لدي خطة وقائية حقيقية مبنية على بيولوجيتي الخاصة.", "date": "أبريل 2026" },
                    { "name": "فهد العنزي", "rating": 5, "text": "شرحت لي نتائج DNA بطريقة واضحة ومطمئنة. لم تخفني بالأرقام، بل مكّنتني من قرارات صحية أذكى.", "date": "فبراير 2026" }
                ]
            ),
            CMSDoctor(
                doctor_id="dr-mohammed",
                name="د. محمد الراشد",
                specialty="هشاشة العظام المكثفة",
                experience="15 سنة خبرة",
                image="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20clean%20white%20background%20confident%20smile%20portrait%20orthopedic%20bone%20specialist%20senior&width=400&height=500&seq=doc-ma-m1&orientation=portrait",
                rating=4.8,
                reviews_count=212,
                title="استشاري هشاشة العظام والأيض العظمي المكثف",
                education="دكتوراه طب العظام — جامعة ميونخ",
                languages=["العربية", "الإنجليزية", "الألمانية"],
                available_days=["الأحد", "الاثنين", "الأربعاء", "الخميس"],
                bio="د. محمد الراشد استشاري متخصص في هشاشة العظام والأيض العظمي بخبرة 15 عامًا. حاصل على دكتوراه من جامعة ميونخ. يتعامل مع هشاشة العظام كحالة أيضية وهرمونية معقدة، لا كمجرد نقص في الكالسيوم. يقدم رعاية مكثفة مع بروتوكولات علاجية متقدمة تشمل العلاجات البيولوجية الحديثة.",
                specializations=["هشاشة العظام الشديدة", "الأيض العظمي", "العلاجات البيولوجية", "الكسور المرضية", "الوقاية من هشاشة العظام"],
                achievements=[
                    "دكتوراه من جامعة ميونخ في طب العظام",
                    "خبير في العلاجات البيولوجية لهشاشة العظام",
                    "أكثر من 45 بحث علمي منشور",
                    "عضو الجمعية الدولية لهشاشة العظام"
                ],
                consultation_fee="700",
                reviews=[
                    { "name": "أم سلطان", "rating": 5, "text": "د. محمد لم يعطني كالسيوم وفيتامين D فقط. فهم الجذر الأيضي لهشاشة العظام عندي ووضع خطة علاجية حقيقية. كثافة عظامي تتحسن.", "date": "مارس 2026" },
                    { "name": "أبو لجين", "rating": 5, "text": "متخصص حقيقي في هشاشة العظام. يشرح بعمق ويضع خطة علاجية مخصصة لكل حالة.", "date": "يناير 2026" }
                ]
            ),
            CMSDoctor(
                doctor_id="dr-reem",
                name="د. ريم الحربي",
                specialty="العلاجات الوريدية المتخصصة",
                experience="10 سنوات خبرة",
                image="https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20IV%20therapy%20specialist%20medical%20professional&width=400&height=500&seq=doc-ma-r1&orientation=portrait",
                rating=4.8,
                reviews_count=189,
                title="استشارية العلاجات الوريدية المتخصصة والطب الوظيفي",
                education="ماجستير الطب الوظيفي — جامعة ملبورن",
                languages=["العربية", "الإنجليزية"],
                available_days=["السبت", "الأحد", "الثلاثاء", "الخميس"],
                bio="د. ريم الحربي استشارية متخصصة في العلاجات الوريدية والطب الوظيفي بخبرة 10 سنوات. حاصلة على ماجستير من جامعة ملبورن. تصمم بروتوكولات وريدية مخصصة مبنية على التقييم الأيضي والوظيفي لكل مريض، لا على بروتوكولات عامة.",
                specializations=["العلاجات الوريدية المتخصصة", "دعم الميتوكوندريا", "مضادات الأكسدة العالية", "الدعم الأيضي الوريدي", "الطب الوظيفي"],
                achievements=[
                    "ماجستير من جامعة ملبورن في الطب الوظيفي",
                    "خبيرة في بروتوكولات الميتوكوندريا الوريدية",
                    "أكثر من 20 بحث علمي منشور",
                    "عضو الجمعية الدولية للطب الوظيفي"
                ],
                consultation_fee="650",
                reviews=[
                    { "name": "سعد المالكي", "rating": 5, "text": "بروتوكول الطاقة الخلوية مع د. ريم غيّر مستوى طاقتي بشكل ملحوظ. ليست جلسات عامة، بل مخصصة لحالتي تمامًا.", "date": "أبريل 2026" },
                    { "name": "خالد الرشيدي", "rating": 5, "text": "متخصصة ومتمكنة. تشرح كل تركيبة وريدية وسبب اختيارها لحالتك. هذا هو الفرق الحقيقي.", "date": "فبراير 2026" }
                ]
            )
        ]
        db.add_all(doctors)
        db.commit()
        print(f"Seeded {len(doctors)} CMSDoctors.")

        # 6. Seed CMSPackage
        print("Seeding CMSPackages...")
        packages = [
            # التقييم العميق
            CMSPackage(
                package_id="deep-basic",
                name="التقييم العميق الأساسي",
                category="التقييم العميق",
                price=800,
                icon="ri-focus-3-line",
                accent_color="teal",
                features=["جلسة تقييم 90 دقيقة", "تحاليل وظيفية أساسية", "قراءة المخاطر الحالية", "تقرير سريري مفصل"]
            ),
            CMSPackage(
                package_id="deep-standard",
                name="التقييم العميق الشامل",
                category="التقييم العميق",
                price=1400,
                original_price=1800,
                badge="الأكثر طلباً",
                icon="ri-stack-line",
                accent_color="teal",
                features=["جلسة تقييم 120 دقيقة", "تحاليل وظيفية وأيضية متقدمة", "قراءة المخاطر الحالية والمستقبلية", "استشارة استشاري أول", "تقرير سريري + خطة شخصية", "متابعة شهر"],
                description="التقييم العميق الشامل هو جوهر تجربة ذا مديكال أفينيو. جلسة 120 دقيقة مع استشاري أول يفكك فيها الحالة ويقرأ ما وراء العرض، ويربط بين الحاضر الصحي والمخاطر المستقبلية.",
                duration="120 دقيقة + متابعة شهر",
                target_audience="مناسب لمن لم تمنحهم الزيارات السريعة صورة واضحة، ويحتاجون تقييمًا متعدد الطبقات",
                preparation=["إحضار جميع التقارير الطبية السابقة", "قائمة الأدوية الحالية", "الصيام 8 ساعات للتحاليل", "ارتداء ملابس مريحة"],
                includes=[
                    { "label": "جلسة تقييم 120 دقيقة", "icon": "ri-time-line" },
                    { "label": "تحاليل وظيفية وأيضية متقدمة", "icon": "ri-flask-line" },
                    { "label": "قراءة المخاطر المستقبلية", "icon": "ri-radar-line" },
                    { "label": "استشارة استشاري أول", "icon": "ri-user-star-line" },
                    { "label": "تقرير سريري مفصل", "icon": "ri-file-chart-line" },
                    { "label": "خطة شخصية قابلة للتطبيق", "icon": "ri-route-line" },
                    { "label": "متابعة شهر كامل", "icon": "ri-calendar-check-line" }
                ],
                faqs=[
                    { "q": "ما الذي يحدث في جلسة التقييم العميق؟", "a": "جلسة 120 دقيقة مع استشاري أول يستمع فيها لتاريخك الصحي الكامل، يحلل التحاليل، يقرأ المخاطر الحالية والمستقبلية، ويضع خطة شخصية مبنية على بيولوجيتك الخاصة." },
                    { "q": "هل أحتاج للصيام قبل الجلسة؟", "a": "نعم، الصيام 8 ساعات مطلوب للتحاليل الوظيفية والأيضية. شرب الماء مسموح." }
                ]
            ),
            CMSPackage(
                package_id="deep-premium",
                name="التقييم العميق المتكامل",
                category="التقييم العميق",
                price=2200,
                original_price=2800,
                badge="مميز",
                icon="ri-award-line",
                accent_color="teal",
                features=["جلسة تقييم 120 دقيقة", "تحاليل وظيفية شاملة (30+ تحليل)", "تقييم العمر البيولوجي", "قراءة المخاطر المستقبلية", "استشارة 2 استشاري", "خطة شخصية مفصلة", "متابعة 3 أشهر"]
            ),
            # الطب الدقيق
            CMSPackage(
                package_id="precision-standard",
                name="منصة الطب الدقيق الشاملة",
                category="الطب الدقيق",
                price=2800,
                original_price=3500,
                badge="الأكثر طلباً",
                icon="ri-radar-line",
                accent_color="violet",
                features=["تقييم عميق 120 دقيقة", "DNA Risk Score شامل (50+ مرض)", "تقييم العمر البيولوجي", "تحاليل أيضية ووظيفية", "خطة وقائية شخصية", "متابعة 6 أشهر"],
                description="منصة الطب الدقيق الشاملة تجمع بين التقييم العميق وDNA Risk Score الشامل وتقييم العمر البيولوجي — لبناء صورة كاملة عن مسارك الصحي المستقبلي.",
                duration="يوم كامل + متابعة 6 أشهر",
                target_audience="مناسب لمن يريد فهمًا حقيقيًا لمخاطره الصحية المستقبلية وخطة وقائية مبنية على بيولوجيته الخاصة",
                preparation=["إحضار جميع التقارير الطبية السابقة", "الصيام 10 ساعات", "قائمة الأدوية والمكملات الحالية"],
                includes=[
                    { "label": "تقييم عميق 120 دقيقة", "icon": "ri-time-line" },
                    { "label": "DNA Risk Score شامل (50+ مرض)", "icon": "ri-dna-line" },
                    { "label": "تقييم العمر البيولوجي", "icon": "ri-heart-pulse-line" },
                    { "label": "تحاليل أيضية ووظيفية متقدمة", "icon": "ri-flask-line" },
                    { "label": "خطة وقائية شخصية مفصلة", "icon": "ri-route-line" },
                    { "label": "متابعة 6 أشهر", "icon": "ri-calendar-check-line" }
                ],
                faqs=[
                    { "q": "ما الفرق بين DNA Risk Score الأساسي والشامل؟", "a": "الأساسي يغطي 20 مرضًا رئيسيًا، بينما الشامل يغطي أكثر من 50 مرضًا ومخاطره صحية مستقبلية." },
                    { "q": "كم يستغرق الحصول على نتائج DNA؟", "a": "من 10 إلى 14 يومًا من تاريخ أخذ العينة." }
                ]
            ),
            # الخلل الأيضي
            CMSPackage(
                package_id="metabolic-standard",
                name="باقة السمنة والخلل الأيضي",
                category="الخلل الأيضي",
                price=2200,
                original_price=2800,
                badge="الأكثر طلباً",
                icon="ri-flask-line",
                accent_color="orange",
                features=["تقييم أيضي عميق 120 دقيقة", "تحاليل MASLD المتخصصة", "Fibroscan الكبد", "التقييم الجيني الأيضي", "خطة علاجية شخصية", "متابعة 3 أشهر"]
            ),
            # Second Opinion
            CMSPackage(
                package_id="2op-standard",
                name="Second Opinion — استشارة مرئية",
                category="Second Opinion",
                price=2500,
                original_price=3200,
                badge="الأكثر طلباً",
                icon="ri-video-line",
                accent_color="teal",
                features=["إعداد الملف السريري", "ترجمة طبية متخصصة", "إرسال لمركز دولي", "استشارة مرئية مع الطبيب الدولي", "رأي طبي مكتوب", "جلسة شرح + خطة عمل"],
                description="Second Opinion مع استشارة مرئية مباشرة مع الطبيب الدولي — لأن بعض الحالات تحتاج حوارًا حقيقيًا لا مجرد رأي مكتوب.",
                duration="7–14 يوم",
                target_audience="مناسب للحالات المعقدة التي تحتاج حوارًا مباشرًا مع الطبيب الدولي",
                includes=[
                    { "label": "إعداد الملف السريري الكامل", "icon": "ri-file-text-line" },
                    { "label": "ترجمة طبية متخصصة", "icon": "ri-translate-2" },
                    { "label": "إرسال لمركز دولي متخصص", "icon": "ri-global-line" },
                    { "label": "استشارة مرئية مع الطبيب الدولي", "icon": "ri-video-line" },
                    { "label": "رأي طبي مكتوب مفصل", "icon": "ri-file-chart-line" },
                    { "label": "جلسة شرح النتائج + خطة عمل", "icon": "ri-chat-3-line" }
                ],
                faqs=[
                    { "q": "ما المراكز الدولية التي تتعاملون معها؟", "a": "نتعامل مع مراكز متخصصة في الولايات المتحدة وجنوب كوريا وألمانيا وغيرها، حسب طبيعة الحالة والتخصص المطلوب." }
                ]
            ),
            # العلاجات الوريدية
            CMSPackage(
                package_id="iv-energy",
                name="باقة الطاقة الخلوية",
                category="العلاجات الوريدية",
                price=3200,
                original_price=4000,
                badge="الأكثر طلباً",
                icon="ri-flashlight-line",
                accent_color="cyan",
                features=["تحاليل وظيفية قبل البدء", "5 جلسات بروتوكول الطاقة الخلوية", "دعم الميتوكوندريا", "مضادات الأكسدة العالية", "متابعة شهر"]
            ),
            # الرعاية الدولية
            CMSPackage(
                package_id="global-standard",
                name="الرعاية الدولية المتكاملة",
                category="الرعاية الدولية",
                price=5500,
                original_price=7000,
                badge="الأكثر طلباً",
                icon="ri-route-line",
                accent_color="teal",
                features=["تقييم عميق متعدد التخصصات", "DNA Risk Score + DNA نفسي", "Second Opinion من مراكز USA وKorea", "استشارة مرئية دولية", "خطة علاجية شاملة", "متابعة سنة كاملة", "ربط مستمر بمؤشرات الحالة"],
                description="الرعاية الدولية المتكاملة هي أعلى مستويات الرعاية في ذا مديكال أفينيو — تجمع بين العمق السريري المحلي والخبرة الدولية في USA وKorea.",
                duration="شهر + متابعة سنة كاملة",
                target_audience="مناسب للحالات المعقدة التي تحتاج منظورًا دوليًا أوسع من الإطار المحلي",
                includes=[
                    { "label": "تقييم عميق متعدد التخصصات", "icon": "ri-stack-line" },
                    { "label": "DNA Risk Score + DNA نفسي", "icon": "ri-dna-line" },
                    { "label": "Second Opinion من USA وKorea", "icon": "ri-global-line" },
                    { "label": "استشارة مرئية مع الطبيب الدولي", "icon": "ri-video-line" },
                    { "label": "خطة علاجية شاملة ومتكاملة", "icon": "ri-route-line" },
                    { "label": "متابعة سنة كاملة", "icon": "ri-calendar-check-line" },
                    { "label": "تطبيق مراقبة صحية شخصي", "icon": "ri-smartphone-line" }
                ],
                faqs=[
                    { "q": "ما المراكز الدولية المشمولة؟", "a": "نتعامل مع مراكز متخصصة في الولايات المتحدة وجنوب كوريا وألمانيا، حسب طبيعة الحالة والتخصص المطلوب." },
                    { "q": "هل يمكن السفر للعلاج في الخارج؟", "a": "نعم، نوفر دعمًا لوجستيًا كاملًا لمن يحتاج السفر للعلاج في الخارج." }
                ]
            ),
            # VIP
            CMSPackage(
                package_id="vip-executive",
                name="باقة VIP التنفيذية",
                category="VIP",
                price=12000,
                original_price=16000,
                badge="الأرقى",
                icon="ri-vip-diamond-line",
                accent_color="amber",
                features=["تقييم عميق متعدد التخصصات", "DNA كامل + عمر بيولوجي + ميتوكوندريا", "Second Opinion من مراكز دولية متعددة", "استشارات مرئية دولية", "خطة علاجية شاملة", "متابعة سنتين", "غرفة VIP خاصة", "خدمة منزلية"],
                description="باقة VIP التنفيذية هي تجربة الطب الدقيق الأرقى — رعاية شخصية كاملة من نخبة الاستشاريين مع امتداد دولي حقيقي وخصوصية تامة.",
                duration="شهر + متابعة سنتين",
                target_audience="مخصصة لكبار المسؤولين والشخصيات البارزة الراغبين في أعلى مستويات الطب الدقيق",
                includes=[
                    { "label": "تقييم عميق من كبار الاستشاريين", "icon": "ri-user-star-line" },
                    { "label": "DNA كامل + عمر بيولوجي + ميتوكوندريا", "icon": "ri-dna-line" },
                    { "label": "Second Opinion من مراكز دولية", "icon": "ri-global-line" },
                    { "label": "استشارات مرئية دولية متعددة", "icon": "ri-video-line" },
                    { "label": "غرفة VIP خاصة", "icon": "ri-hotel-line" },
                    { "label": "متابعة سنتين كاملتين", "icon": "ri-calendar-check-line" },
                    { "label": "خدمة منزلية عند الحاجة", "icon": "ri-home-heart-line" }
                ],
                faqs=[
                    { "q": "هل تشمل الخدمة المنزلية أخذ التحاليل في المنزل؟", "a": "نعم، يمكن إرسال فريق طبي متخصص لأخذ التحاليل في منزلك أو مكتبك." },
                    { "q": "هل يمكن تحديد موعد خارج أوقات الدوام الرسمي؟", "a": "نعم، نوفر مواعيد مرنة تناسب جدولك بما في ذلك المساء وعطل نهاية الأسبوع." }
                ]
            )
        ]
        db.add_all(packages)
        db.commit()
        print(f"Seeded {len(packages)} CMSPackages.")

        # 7. Seed BlogCategory
        print("Seeding BlogCategories...")
        categories = [
            BlogCategory(category_id="all", label="الكل"),
            BlogCategory(category_id="risk-stratification", label="الطب الدقيق"),
            BlogCategory(category_id="obesity-metabolic", label="الخلل الأيضي"),
            BlogCategory(category_id="second-opinion", label="Second Opinion"),
            BlogCategory(category_id="dna-risk", label="الجينات"),
            BlogCategory(category_id="psychiatry", label="الطب النفسي")
        ]
        db.add_all(categories)
        db.commit()
        print(f"Seeded {len(categories)} BlogCategories.")

        # 8. Seed BlogPost
        print("Seeding BlogPosts...")
        posts = [
            BlogPost(
                post_id="precision-medicine-future",
                title="الطب الدقيق: لماذا لم تعد الحلول العامة كافية؟",
                excerpt="كل مريض يملك بيولوجيا ومسارًا صحيًا مختلفًا. نفهم قبل أن نقرر، ونحلل قبل أن نتدخل، ونستبق قبل أن نطارد.",
                content="الطب الدقيق ليس مجرد مصطلح علمي، بل نموذج رعاية متكامل يقوم على فهم الفروق البيولوجية بين الأفراد. نجمع بين التحليل الجيني المتقدم، وفهم العمر البيولوجي، والتحاليل الوظيفية والأيضية لبناء صورة كاملة وشخصية لكل مريض.",
                category="الطب الدقيق",
                category_id="risk-stratification",
                author="د. فيصل الأحمد",
                author_role="استشاري الطب الدقيق وتقييم المخاطر",
                author_image="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=100&height=100&seq=doc-ma1&orientation=squarish",
                date="15 أبريل 2026",
                read_time="6 دقائق",
                image="https://readdy.ai/api/search-image?query=precision%20medicine%20DNA%20genomics%20advanced%20medical%20technology%20laboratory%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare%20concept&width=800&height=500&seq=blog-pm1&orientation=landscape",
                tags=["الطب الدقيق", "DNA", "المخاطر الصحية"],
                featured=True,
                views=3240,
                status="published"
            ),
            BlogPost(
                post_id="masld-metabolic",
                title="MASLD والخلل الأيضي: أكثر من مجرد مشكلة وزن",
                excerpt="لا نختزل الحالة في الوزن، بل نتعامل معها كمسار أيضي ووظيفي معقد يحتاج قراءة أعمق وتدخلًا أكثر تخصيصًا.",
                content="MASLD أو مرض الكبد الدهني المرتبط بالخلل الأيضي يمثل أحد أكثر الحالات تعقيدًا في الطب الحديث. لا يجب اختزال علاجه في وصفة تخفيف الوزن العادية. يتطلب بروتوكولًا متكاملًا يتعامل مع مقاومة الأنسولين، الالتهاب المزمن، والتوازن الأيضي والهرموني.",
                category="الخلل الأيضي",
                category_id="obesity-metabolic",
                author="د. سارة المنصور",
                author_role="استشارية الخلل الأيضي وMASLD",
                author_image="https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=100&height=100&seq=doc-ma2&orientation=squarish",
                date="10 أبريل 2026",
                read_time="8 دقائق",
                image="https://readdy.ai/api/search-image?query=metabolic%20syndrome%20liver%20disease%20MASLD%20medical%20concept%20advanced%20clinical%20assessment%20laboratory%20modern%20healthcare%20professional%20environment&width=800&height=500&seq=blog-meta1&orientation=landscape",
                tags=["MASLD", "الخلل الأيضي", "السمنة"],
                featured=True,
                views=2180,
                status="published"
            ),
            BlogPost(
                post_id="second-opinion-value",
                title="Second Opinion: متى يكون القرار الطبي الإضافي ضرورة لا رفاهية؟",
                excerpt="الرأي الطبي الإضافي عندنا ليس خدمة شكلية، بل أداة لاتخاذ قرار أكثر اطمئنانًا واتساعًا في الحالات الحساسة.",
                content="في الحالات المعقدة أو الحساسة كالجراحات الكبرى أو الأمراض النادرة، الحصول على رأي طبي ثانٍ من مراكز دولية متخصصة في الولايات المتحدة وجنوب كوريا يمكن أن يغير اتجاه الخطة العلاجية بالكامل ويمنح المريض الطمأنينة الكاملة.",
                category="Second Opinion",
                category_id="second-opinion",
                author="د. فيصل الأحمد",
                author_role="استشاري الطب الدقيق",
                author_image="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=100&height=100&seq=doc-ma1&orientation=squarish",
                date="5 أبريل 2026",
                read_time="5 دقائق",
                image="https://readdy.ai/api/search-image?query=international%20medical%20consultation%20second%20opinion%20global%20healthcare%20network%20professional%20doctors%20collaboration%20modern%20clinic%20sophisticated%20environment&width=800&height=500&seq=blog-2op1&orientation=landscape",
                tags=["Second Opinion", "القرار الطبي", "الخبرة الدولية"],
                featured=False,
                views=1920,
                status="published"
            ),
            BlogPost(
                post_id="dna-risk-score",
                title="DNA Risk Score: قراءة مستقبلك الصحي قبل أن يحدث",
                excerpt="نستخدم تحليل الـ DNA لفهم الاستعدادات والمخاطر المستقبلية، لا لمجرد الانبهار العلمي أو الاستعراض التقني.",
                content="تحليل DNA Risk Score يكشف الاستعدادات الجينية للأمراض قبل ظهورها بسنوات. الفائدة الحقيقية ليست الانبهار بالجينات، بل استخدام هذه المعرفة لبناء بروتوكول وقائي يمنع أو يؤخر ظهور المرض.",
                category="الجينات والطب الدقيق",
                category_id="dna-risk",
                author="د. نورة الزهراني",
                author_role="استشارية الجينات والطب الدقيق",
                author_image="https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=100&height=100&seq=doc-ma4&orientation=squarish",
                date="1 أبريل 2026",
                read_time="7 دقائق",
                image="https://readdy.ai/api/search-image?query=DNA%20genetic%20testing%20risk%20score%20precision%20medicine%20laboratory%20advanced%20genomics%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare&width=800&height=500&seq=blog-dna1&orientation=landscape",
                tags=["DNA", "الجينات", "الوقاية المبكرة"],
                featured=False,
                views=2650,
                status="published"
            ),
            BlogPost(
                post_id="biological-aging",
                title="العمر البيولوجي: أنت أصغر أو أكبر مما تظن",
                excerpt="العمر الزمني لا يحكي القصة كاملة. العمر البيولوجي يكشف الحقيقة الفعلية لحالة جسمك على المستوى الخلوي.",
                content="العمر الزمني هو عدد السنوات التي عشتها، بينما العمر البيولوجي هو مدى تقدم شيخوخة خلاياك وأعضائك الفعلي. قياسه بدقة يتيح لنا معرفة ما إذا كانت التدخلات الصحية والوقائية تحقق تأثيرها المرجو لإبطاء الشيخوخة الخلوية.",
                category="الطب الدقيق",
                category_id="risk-stratification",
                author="د. نورة الزهراني",
                author_role="استشارية الجينات والطب الدقيق",
                author_image="https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=100&height=100&seq=doc-ma4&orientation=squarish",
                date="28 مارس 2026",
                read_time="6 دقائق",
                image="https://readdy.ai/api/search-image?query=biological%20aging%20cellular%20health%20precision%20medicine%20advanced%20diagnostics%20modern%20laboratory%20sophisticated%20medical%20technology%20professional%20healthcare%20concept&width=800&height=500&seq=blog-age1&orientation=landscape",
                tags=["العمر البيولوجي", "الشيخوخة", "الطب الدقيق"],
                featured=False,
                views=1840,
                status="published"
            ),
            BlogPost(
                post_id="psychiatry-depth",
                title="الطب النفسي العميق: ما وراء الأعراض",
                excerpt="التقييم النفسي الحقيقي لا يكتفي بالأعراض، بل يقرأ البنية الكاملة للحالة ويربطها بالعوامل البيولوجية والنفسية.",
                content="الطب النفسي للبالغين في ذا مديكال أفينيو يقوم على تقييم عميق متعدد الطبقات. نقوم بربط الأعراض النفسية بالعوامل البيولوجية والهرمونية والجينية (باستخدام DNA النفسي) لنضع خطة علاجية مخصصة وعميقة.",
                category="الطب النفسي",
                category_id="psychiatry",
                author="د. خالد العمر",
                author_role="استشاري الطب النفسي للبالغين",
                author_image="https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20glasses%20clean%20white%20background%20confident%20smile%20portrait%20psychiatrist%20specialist%20senior&width=100&height=100&seq=doc-ma3&orientation=squarish",
                date="24 مارس 2026",
                read_time="5 دقائق",
                image="https://readdy.ai/api/search-image?query=adult%20psychiatry%20mental%20health%20deep%20assessment%20modern%20clinical%20environment%20calm%20professional%20therapeutic%20setting%20sophisticated%20healthcare%20concept&width=800&height=500&seq=blog-psych1&orientation=landscape",
                tags=["الطب النفسي", "التقييم العميق", "الصحة النفسية"],
                featured=False,
                views=2120,
                status="published"
            )
        ]
        db.add_all(posts)
        db.commit()
        print(f"Seeded {len(posts)} BlogPosts.")

        # 9. Seed Booking
        print("Seeding Sample Bookings...")
        bookings = [
            Booking(
                booking_ref="BK-2026-001",
                full_name="أحمد محمد",
                phone="+966 50 123 4567",
                email="ahmed@example.com",
                age=35,
                gender="male",
                complaint="أرغب في تقييم شامل للمخاطر الصحية بسبب تاريخ عائلي لأمراض القلب.",
                service_id="risk-stratification",
                doctor_id="dr-faisal",
                package_id="deep-standard",
                visit_type="first",
                selected_date="2026-05-30",
                selected_time="10:00 ص",
                status="confirmed"
            ),
            Booking(
                booking_ref="BK-2026-002",
                full_name="فاطمة الزهراء",
                phone="+966 55 987 6543",
                email="fatima@example.com",
                age=29,
                gender="female",
                complaint="أعاني من زيادة في الوزن ومشاكل في الكبد (مقاومة الأنسولين).",
                service_id="obesity-metabolic",
                doctor_id="dr-sara",
                package_id="metabolic-standard",
                visit_type="first",
                selected_date="2026-05-31",
                selected_time="11:30 ص",
                status="pending"
            ),
            Booking(
                booking_ref="BK-2026-003",
                full_name="محمد عبدالله",
                phone="+966 54 456 7890",
                email="mohammed.abd@example.com",
                age=45,
                gender="male",
                complaint="طلب استشارة نفسية بخصوص القلق المزمن وتأثيره على النوم.",
                service_id="psychiatry",
                doctor_id="dr-khalid",
                package_id="psych-standard",
                visit_type="first",
                selected_date="2026-06-01",
                selected_time="14:00 م",
                status="confirmed"
            ),
            Booking(
                booking_ref="BK-2026-004",
                full_name="نورة السعيد",
                phone="+966 56 789 0123",
                email="nora.saeed@example.com",
                age=50,
                gender="female",
                complaint="متابعة لنتائج تحليل DNA Risk Score لبناء الخطة الوقائية.",
                service_id="dna-risk",
                doctor_id="dr-nora",
                package_id="precision-standard",
                visit_type="followup",
                selected_date="2026-06-02",
                selected_time="09:00 ص",
                status="pending"
            )
        ]
        db.add_all(bookings)
        db.commit()
        print(f"Seeded {len(bookings)} Sample Bookings.")

        # 10. Seed ContactMessage
        print("Seeding Sample ContactMessages...")
        messages = [
            ContactMessage(
                full_name="ليلى أحمد",
                phone="+966 50 222 3333",
                email="laila@example.com",
                subject="استفسار عن باقة العائلة",
                message="أريد معرفة تفاصيل باقة العائلة الشاملة وهل تشمل الأطفال تحت سن 12 سنة؟",
                status="new"
            ),
            ContactMessage(
                full_name="خالد العمر",
                phone="+966 55 111 2222",
                email="khaled.o@example.com",
                subject="موعد طارئ",
                message="هل يمكن الحصول على موعد طارئ اليوم؟ أعاني من ألم شديد ومفاجئ.",
                status="new"
            ),
            ContactMessage(
                full_name="سارة محمد",
                phone="+966 54 333 4444",
                email="sara.m@example.com",
                subject="شكر وتقدير",
                message="شكراً لفريقكم الرائع على الخدمة المتميزة والترحيب الحار في زيارتي الأخيرة للعيادة.",
                status="read"
            )
        ]
        db.add_all(messages)
        db.commit()
        print(f"Seeded {len(messages)} Sample ContactMessages.")

        print("Seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}", file=sys.stderr)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
