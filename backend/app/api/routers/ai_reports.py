from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List
from uuid import UUID
import os
import httpx
import json
import re

from app.api import deps
from app.core.database import get_db
from app.crud.crud_ai_report import ai_report
from app.schemas.ai_report import AIReportCreate, AIReportResponse, AIReportGenerateRequest, AIReportGenerateResponse
from app.models.user import User
from app.models.settings import SystemSettings
from app.crud.crud_dna_config import create_dna_evaluation

router = APIRouter()

def build_prompt(overall_score: int, risk_level: str, risk_categories: list, answers: dict, primary_package: str, secondary_package: str = None) -> str:
    categories_text = "\n".join([f"- {c['label']}: {c['score']}%" for c in risk_categories])
    
    label_map = {
        "age": "العمر",
        "family_history": "التاريخ العائلي",
        "lifestyle": "نمط الحياة",
        "diet": "النظام الغذائي",
        "stress": "مستوى الضغط النفسي",
        "sleep": "جودة النوم",
        "symptoms": "الأعراض الحالية",
        "checkups": "الفحوصات الدورية",
        "smoking": "التدخين",
        "goal": "الهدف من التقييم",
    }
    
    answers_text = "\n".join([
        f"- {label_map.get(key, key)}: {', '.join(values)}"
        for key, values in answers.items()
    ])
    
    secondary_text = f"**الباقة الثانوية:** {secondary_package}" if secondary_package else ""
    
    return f"""أنت استشاري طبي متخصص في الطب الدقيق والطب الوقائي. قم بتحليل تقييم DNA Risk Score التالي واكتب تقريرًا طبيًا شخصيًا باللغة العربية الفصحى.

## بيانات المريض:

**مستوى المخاطر الإجمالي:** {overall_score}% ({risk_level})

**تفصيل المخاطر حسب المجال:**
{categories_text}

**إجابات المستخدم:**
{answers_text}

**الباقة الموصى بها:** {primary_package}
{secondary_text}

## المطلوب:

اكتب تقريرًا طبيًا شخصيًا يتكون من:

1. **ملخص تنفيذي** (فقرة واحدة): وصف عام لحالة المستخدم وما يعنيه مستوى المخاطر
2. **تحليل المخاطر الرئيسية**: شرح 2-3 مخاطر الأكثر إلحاحًا مع تفسير سببها
3. **التوصيات الطبية**: 4-6 توصيات عملية وقابلة للتنفيذ
4. **الخطوات التالية**: ما يجب على المستخدم فعله فورًا وفي المدى القصير
5. **مستوى الإلحاح**: قيّم مدى ضرورة التدخل السريع

اكتب بأسلوب:
- طبي دقيق لكن مفهوم للمريض العادي
- داعم ومحفز (لا تخويفي)
- يؤكد أن الجينات ليست مصيرًا وأن التدخل المبكر يغير المسار
- استخدم "أنت" للمخاطبة المباشرة

أرجع النتيجة بصيغة JSON فقط بهذا الهيكل:
{{
  "report": "النص الكامل للتقرير مع فقرات منفصلة",
  "recommendations": ["توصية 1", "توصية 2", ...],
  "urgencyLevel": "low|medium|high|critical",
  "followUpActions": ["خطوة 1", "خطوة 2", ...]
}}"""


@router.post("/generate", response_model=AIReportGenerateResponse)
def generate_ai_report(
    *,
    db: Session = Depends(get_db),
    obj_in: AIReportGenerateRequest
) -> Any:
    """
    Securely generate an AI report using OpenAI API key stored on the server.
    """
    # 1. Fetch OpenAI key
    settings_record = db.query(SystemSettings).first()
    openai_key = None
    if settings_record and settings_record.ai:
        openai_key = settings_record.ai.get("openaiKey")
        if openai_key and openai_key.startswith("sk-mock"):
            openai_key = None

    if not openai_key:
        openai_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")

    if not openai_key:
        raise HTTPException(
            status_code=400,
            detail="مفتاح OpenAI API غير مهيأ في إعدادات العيادة."
        )

    # 2. Build prompt and payload
    prompt = build_prompt(
        overall_score=obj_in.overallScore,
        risk_level=obj_in.riskLevel,
        risk_categories=[c.model_dump() for c in obj_in.riskCategories],
        answers=obj_in.answers,
        primary_package=obj_in.primaryPackage,
        secondary_package=obj_in.secondaryPackage
    )

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_key}"
    }

    body = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "أنت استشاري طبي متخصص في الطب الدقيق والطب الوقائي. تكتب تقارير طبية شخصية بالعربية الفصحى. دقيق، داعم، ومحفز."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 2000
    }

    # 3. Request OpenAI
    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=body)
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail=f"خطأ من OpenAI: {response.text}")
            
            res_data = response.json()
            completion_text = res_data["choices"][0]["message"]["content"]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"فشل الاتصال بـ OpenAI: {str(e)}")

    # 4. Parse JSON result
    parsed = None
    try:
        json_match = re.search(r"\{[\s\S]*\}", completion_text)
        if json_match:
            parsed = json.loads(json_match.group(0))
        else:
            raise ValueError("No JSON found")
    except Exception:
        # Fallback
        parsed = {
            "report": completion_text,
            "recommendations": [
                "احجز جلسة تقييم عميق مع استشاري متخصص",
                "ابدأ بتغيير نمط الحياة تدريجياً",
                "تابع الفحوصات الدورية بانتظام"
            ],
            "urgencyLevel": "critical" if obj_in.overallScore >= 75 else "high" if obj_in.overallScore >= 55 else "medium" if obj_in.overallScore >= 30 else "low",
            "followUpActions": [
                "مراجعة التقرير مع طبيبك",
                "تحديد موعد للتقييم العميق"
            ]
        }

    # 5. Save DNA Evaluation in DB
    report_content_dict = {
        "report": parsed.get("report", ""),
        "recommendations": parsed.get("recommendations", []),
        "urgencyLevel": parsed.get("urgencyLevel", "medium"),
        "followUpActions": parsed.get("followUpActions", []),
        "overallScore": obj_in.overallScore,
        "riskLevel": obj_in.riskLevel,
        "riskCategories": [c.model_dump() for c in obj_in.riskCategories],
        "primaryPackage": obj_in.primaryPackage,
        "secondaryPackage": obj_in.secondaryPackage
    }

    try:
        create_dna_evaluation(
            db,
            patient_name=obj_in.patientName,
            patient_age=obj_in.patientAge,
            patient_email=obj_in.patientEmail,
            patient_phone=obj_in.patientPhone,
            overall_score=obj_in.overallScore,
            risk_level=obj_in.riskLevel,
            answers=obj_in.answers,
            report_content=report_content_dict
        )
    except Exception as e:
        # Don't fail the whole request if saving in DB fails, but log it
        print("Failed to save DNA evaluation in database:", e)

    return parsed


@router.post("/", response_model=AIReportResponse)
def create_report(
    *,
    db: Session = Depends(deps.get_db),
    obj_in: AIReportCreate,
) -> Any:
    """
    Create new AI report.
    """
    return ai_report.create(db=db, obj_in=obj_in)

@router.get("/", response_model=List[AIReportResponse])
def read_reports(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Retrieve AI reports (Admin only).
    """
    return ai_report.get_multi(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=AIReportResponse)
def read_report(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get AI report by ID.
    """
    report = ai_report.get(db=db, id=id)
    if not report:
        raise HTTPException(status_code=404, detail="AI Report not found")
    return report

@router.delete("/{id}", response_model=AIReportResponse)
def delete_report(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Delete an AI report.
    """
    report = ai_report.get(db=db, id=id)
    if not report:
        raise HTTPException(status_code=404, detail="AI Report not found")
    return ai_report.remove(db=db, id=id)
