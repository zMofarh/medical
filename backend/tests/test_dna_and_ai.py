import pytest
import json
import httpx
from unittest.mock import MagicMock
from app.core.config import settings

def get_auth_headers(client):
    login_data = {
        "username": "admin@clinic.com",
        "password": "admin123"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_docs_hidden_when_disabled():
    # settings.SHOW_DOCS is False by default in test config, docs_url is None
    from app.main import app
    assert app.docs_url is None or app.docs_url == ""

def test_get_evaluations_unauthorized(client):
    response = client.get("/api/dna-config/evaluations")
    assert response.status_code == 401

def test_get_evaluations_authorized(client):
    headers = get_auth_headers(client)
    response = client.get("/api/dna-config/evaluations", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_generate_ai_report_endpoint(client, monkeypatch):
    # Mock OpenAI API call
    class MockResponse:
        def __init__(self, status_code, json_data):
            self.status_code = status_code
            self._json_data = json_data
            self.text = json.dumps(json_data)

        def json(self):
            return self._json_data

    original_post = httpx.Client.post

    def mock_post(self, url, *args, **kwargs):
        if "api.openai.com" in str(url) or "completions" in str(url):
            mock_content = {
                "report": "تقرير تجريبي مبني على الطب الدقيق.",
                "recommendations": ["توصية اختبارية 1", "توصية اختبارية 2"],
                "urgencyLevel": "medium",
                "followUpActions": ["خطوة اختبارية 1"]
            }
            return MockResponse(200, {
                "choices": [
                    {
                        "message": {
                            "content": json.dumps(mock_content)
                        }
                    }
                ]
            })
        return original_post(self, url, *args, **kwargs)

    monkeypatch.setenv("OPENAI_API_KEY", "test-api-key")
    monkeypatch.setattr(httpx.Client, "post", mock_post)

    payload = {
        "overallScore": 65,
        "riskLevel": "مرتفع",
        "riskCategories": [
            {"id": "cardiac", "label": "القلب والأوعية", "score": 70},
            {"id": "metabolic", "label": "الأيض", "score": 60}
        ],
        "answers": {
            "age": ["45 – 50 سنة"],
            "lifestyle": ["خامل"],
            "smoking": ["غير مدخن"]
        },
        "primaryPackage": "منصة الطب الدقيق الشاملة",
        "patientName": "مريض تجريبي",
        "patientAge": 47,
        "patientEmail": "test_patient@example.com",
        "patientPhone": "+966555555555"
    }

    # Execute request
    response = client.post("/api/ai-reports/generate", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert "report" in res_data
    assert res_data["urgencyLevel"] == "medium"
    assert "توصية اختبارية 1" in res_data["recommendations"]

    # Verify that the evaluation was saved in database
    headers = get_auth_headers(client)
    evals_response = client.get("/api/dna-config/evaluations", headers=headers)
    assert evals_response.status_code == 200
    evals = evals_response.json()
    
    # Find the saved evaluation
    saved_eval = next((e for e in evals if e["patient_name"] == "مريض تجريبي"), None)
    assert saved_eval is not None
    assert saved_eval["patient_email"] == "test_patient@example.com"
    assert saved_eval["overall_score"] == 65
    assert saved_eval["status"] == "new"

    # Test modifying the evaluation status and notes
    eval_id = saved_eval["id"]
    update_payload = {
        "status": "contacted",
        "notes": "تم الاتصال بالمريض وتحديد موعد الاستشارة"
    }
    update_response = client.put(f"/api/dna-config/evaluations/{eval_id}", json=update_payload, headers=headers)
    assert update_response.status_code == 200
    updated_eval = update_response.json()
    assert updated_eval["status"] == "contacted"
    assert updated_eval["notes"] == "تم الاتصال بالمريض وتحديد موعد الاستشارة"
