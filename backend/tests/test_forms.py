def test_submit_booking(client):
    booking_data = {
        "full_name": "Test User",
        "phone": "+966500000000",
        "email": "test@user.com",
        "service_id": "risk-stratification",
        "visit_type": "first",
        "selected_date": "2024-12-01",
        "selected_time": "morning",
        "complaint": "Testing pytest"
    }
    response = client.post("/api/bookings", json=booking_data)
    assert response.status_code == 201
    assert "booking_ref" in response.json()

def test_submit_contact(client):
    contact_data = {
        "full_name": "Contact User",
        "phone": "+966500000000",
        "email": "contact@user.com",
        "subject": "Inquiry",
        "message": "Testing pytest contact"
    }
    response = client.post("/api/contact", json=contact_data)
    assert response.status_code == 201
    assert "message" in response.json()
