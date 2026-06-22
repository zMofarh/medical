from pydantic import BaseModel
from typing import Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class AIReportBase(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    symptoms: str
    report_content: Dict[str, Any]

class AIReportCreate(AIReportBase):
    pass

class AIReportUpdate(AIReportBase):
    symptoms: Optional[str] = None
    report_content: Optional[Dict[str, Any]] = None

class AIReportInDBBase(AIReportBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True

class AIReportResponse(AIReportInDBBase):
    pass


class RiskCategory(BaseModel):
    id: str
    label: str
    score: int


class AIReportGenerateRequest(BaseModel):
    overallScore: int
    riskLevel: str
    riskCategories: list[RiskCategory]
    answers: dict[str, list[str]]
    primaryPackage: str
    secondaryPackage: Optional[str] = None
    patientName: Optional[str] = None
    patientAge: Optional[int] = None
    patientEmail: Optional[str] = None
    patientPhone: Optional[str] = None


class AIReportGenerateResponse(BaseModel):
    report: str
    recommendations: list[str]
    urgencyLevel: str
    followUpActions: list[str]

