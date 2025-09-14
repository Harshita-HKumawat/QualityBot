import pytest
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend.app import app, get_db, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRE_MINUTES
from backend import models
from datetime import datetime, timedelta
import jwt
import os
import uuid

# Use a SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(name="db_session")
def db_session_fixture():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(name="client")
async def client_fixture(db_session: Session):
    def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()

# Helper to create a test user
def create_test_user(db: Session, email: str = "test@example.com", password: str = "password123", role: str = "msme"):
    hashed_password = models.User.hash_password(password)
    user = models.User(
        id=str(uuid.uuid4()),
        name="Test User",
        email=email,
        password=hashed_password,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Helper to create access token
def create_test_access_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Helper to create refresh token
def create_test_refresh_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Test for signup endpoint
@pytest.mark.asyncio
async def test_signup(client: AsyncClient, db_session: Session):
    response = await client.post(
        "/signup",
        json={"name": "Test User", "email": "test@example.com", "password": "password123", "role": "msme"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "access_token" in data
    assert "refresh_token" in data

    user = db_session.query(models.User).filter(models.User.email == "test@example.com").first()
    assert user is not None
    assert models.User.verify_password("password123", user.password)

@pytest.mark.asyncio
async def test_signup_existing_email(client: AsyncClient, db_session: Session):
    create_test_user(db_session)
    response = await client.post(
        "/signup",
        json={"name": "Test User 2", "email": "test@example.com", "password": "password456", "role": "engineer"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

# Test for login endpoint
@pytest.mark.asyncio
async def test_login(client: AsyncClient, db_session: Session):
    user = create_test_user(db_session, email="login@example.com", password="loginpassword")
    response = await client.post(
        "/login",
        json={"email": "login@example.com", "password": "loginpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "login@example.com"
    assert "access_token" in data
    assert "refresh_token" in data

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient, db_session: Session):
    create_test_user(db_session, email="wrong@example.com", password="wrongpassword")
    response = await client.post(
        "/login",
        json={"email": "wrong@example.com", "password": "incorrect"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

@pytest.mark.asyncio
async def test_login_non_existent_user(client: AsyncClient, db_session: Session):
    response = await client.post(
        "/login",
        json={"email": "nonexistent@example.com", "password": "password123"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

# Test for verify token endpoint
@pytest.mark.asyncio
async def test_verify_token(client: AsyncClient, db_session: Session):
    user = create_test_user(db_session, email="verify@example.com", password="verifypassword")
    access_token = create_test_access_token(user.id)
    response = await client.get(
        "/verify-token",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "verify@example.com"
    assert data["id"] == user.id

@pytest.mark.asyncio
async def test_verify_token_invalid(client: AsyncClient, db_session: Session):
    response = await client.get(
        "/verify-token",
        headers={"Authorization": "Bearer invalidtoken"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid token"

@pytest.mark.asyncio
async def test_verify_token_expired(client: AsyncClient, db_session: Session):
    user = create_test_user(db_session, email="expired@example.com", password="expiredpassword")
    # Create an expired token
    expired_time = datetime.utcnow() - timedelta(minutes=1)
    to_encode = {"sub": user.id, "exp": expired_time}
    expired_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    response = await client.get(
        "/verify-token",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Token expired"

# Test for refresh token endpoint
@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient, db_session: Session):
    user = create_test_user(db_session, email="refresh@example.com", password="refreshpassword")
    refresh_token = create_test_refresh_token(user.id)
    response = await client.post(
        "/refresh",
        json={"refresh_token": refresh_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user.email # Ensure user data is returned
    assert "access_token" in data
    assert data["refresh_token"] == refresh_token # The same refresh token is returned

@pytest.mark.asyncio
async def test_refresh_token_invalid(client: AsyncClient, db_session: Session):
    response = await client.post(
        "/refresh",
        json={"refresh_token": "invalidrefreshtoken"}
    )
    assert response.status_code == 401
    assert "Invalid refresh token" in response.json()["detail"]

@pytest.mark.asyncio
async def test_refresh_token_expired(client: AsyncClient, db_session: Session):
    user = create_test_user(db_session, email="expiredrefresh@example.com", password="expiredrefreshpassword")
    # Create an expired refresh token
    expired_time = datetime.utcnow() - timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES + 1)
    to_encode = {"sub": user.id, "exp": expired_time}
    expired_refresh_token = jwt.encode(to_encode, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)

    response = await client.post(
        "/refresh",
        json={"refresh_token": expired_refresh_token}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Refresh token expired"

# Test for root endpoint
@pytest.mark.asyncio
async def test_root(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "QualityBot AI Backend is running!"}
