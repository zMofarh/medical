def test_get_blog_posts(client):
    response = client.get("/api/blog/posts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_blog_categories(client):
    response = client.get("/api/blog/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
