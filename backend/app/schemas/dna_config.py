from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

# DNA Question
class DNAQuestionBase(BaseModel):
    question_id: str
    category: str
    question_text: str
    options: List[Dict[str, Any]] = []
    order_index: Optional[str] = None

class DNAQuestionCreate(DNAQuestionBase):
    pass

class DNAQuestionUpdate(BaseModel):
    category: Optional[str] = None
    question_text: Optional[str] = None
    options: Optional[List[Dict[str, Any]]] = None
    order_index: Optional[str] = None

class DNAQuestion(DNAQuestionBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

# DNA Result Template
class DNAResultTemplateBase(BaseModel):
    template_id: str
    risk_level: str
    recommended_package: Optional[str] = None
    content: Optional[str] = None

class DNAResultTemplateCreate(DNAResultTemplateBase):
    pass

class DNAResultTemplateUpdate(BaseModel):
    risk_level: Optional[str] = None
    recommended_package: Optional[str] = None
    content: Optional[str] = None

class DNAResultTemplate(DNAResultTemplateBase):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# DNA Evaluation
class DNAEvaluationResponse(BaseModel):
    id: UUID
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_email: Optional[str] = None
    patient_phone: Optional[str] = None
    overall_score: int
    risk_level: str
    answers: Dict[str, Any]
    report_content: Dict[str, Any]
    status: str
    notes: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DNAEvaluationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

