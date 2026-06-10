def test_login_admin_success(client):
    login_data = {
        "username": "admin@clinic.com",
        "password": "admin123"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure(client):
    login_data = {
        "username": "wrong@clinic.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401

def test_get_current_user(client):
    login_data = {
        "username": "admin@clinic.com",
        "password": "admin123"
    }
    res = client.post("/api/auth/login", data=login_data)
    token = res.json()["access_token"]

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "admin@clinic.com"
