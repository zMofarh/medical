import uuid
from sqlalchemy import Column, String, DateTime, func, JSON, Integer
from sqlalchemy import Uuid as UUID

from app.core.database import Base

class DNAQuestion(Base):
    __tablename__ = "dna_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)
    question_text = Column(String, nullable=False)
    options = Column(JSON, nullable=False, default=list) # e.g. [{"id": "a", "text": "...", "score_modifiers": {"cardiac": 5}}]
    order_index = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())


class DNAResultTemplate(Base):
    __tablename__ = "dna_result_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(String, unique=True, index=True, nullable=False)
    risk_level = Column(String, nullable=False) # e.g. 'high', 'low'
    recommended_package = Column(String, nullable=True)
    content = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())


class DNAEvaluation(Base):
    __tablename__ = "dna_evaluations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_name = Column(String, nullable=True)
    patient_age = Column(Integer, nullable=True)
    patient_email = Column(String, nullable=True)
    patient_phone = Column(String, nullable=True)
    overall_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    answers = Column(JSON, nullable=False, default=dict)
    report_content = Column(JSON, nullable=False, default=dict)
    status = Column(String, default="new")
    notes = Column(String, default="")
    created_at = Column(DateTime(timezone=True), default=func.now())

