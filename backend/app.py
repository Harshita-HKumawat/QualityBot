from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
from jwt import PyJWTError
import datetime
import hashlib
from typing import Optional, List
import io
import pandas as pd
import google.generativeai as genai
import uuid
import os
from dotenv import load_dotenv
import json

load_dotenv() # Load environment variables from .env file

# Import config and DB
from config import GEMINI_API_KEY, REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRE_MINUTES
from database import SessionLocal, engine
import models
from sqlalchemy.orm import Session

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QualityBot AI Backend")

# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-deployed-frontend.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Config
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-default-key") # Load from environment, with a default fallback
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

security = HTTPBearer()

# ----------------------------
# Pydantic Models
# ----------------------------
class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class RefreshTokenData(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    access_token: str
    refresh_token: str

class QualityData(BaseModel):
    timestamp: str
    metric_name: str
    value: float
    target: float
    unit: str
    process: str
    operator: str
    notes: str

class ExcelImportResponse(BaseModel):
    success: bool
    message: str
    imported_rows: int
    sample_data: List[dict]

class ChatRequest(BaseModel):
    prompt: str
    user_role: Optional[str] = None # Added user_role for context
    language: Optional[str] = None # Added language for context
    history: Optional[List[dict]] = None # Added chat history

class ChatResponse(BaseModel):
    response: str
    success: bool

# ----------------------------
# Helper Functions
# ----------------------------

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT Verification
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})
        return TokenData(user_id=user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired", headers={"WWW-Authenticate": "Bearer"})
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})

def verify_refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token", headers={"WWW-Authenticate": "Bearer"})
        return TokenData(user_id=user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired", headers={"WWW-Authenticate": "Bearer"})
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token", headers={"WWW-Authenticate": "Bearer"})

# ----------------------------
# Routes
# ----------------------------

@app.get("/")
async def root():
    return {"message": "QualityBot AI Backend is running!"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Optionally, handle incoming WebSocket messages if needed
            # await manager.send_personal_message(f"You sent: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected from WebSocket")

@app.post("/refresh", response_model=UserResponse)
async def refresh_token(refresh_token_data: RefreshTokenData, db: Session = Depends(get_db)):
    try:
        token_data = verify_refresh_token(HTTPAuthorizationCredentials(scheme="Bearer", credentials=refresh_token_data.refresh_token))
        user_id = token_data.user_id

        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        new_access_token = create_access_token(data={"sub": user.id})
        
        return UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            access_token=new_access_token,
            refresh_token=refresh_token_data.refresh_token
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid refresh token: {e}")

# ✅ Signup
@app.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)

    new_user = models.User(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.id})
    refresh_token = create_refresh_token(data={"sub": new_user.id})

    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        access_token=access_token,
        refresh_token=refresh_token
    )

# ✅ Login
@app.post("/login", response_model=UserResponse)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        access_token=access_token,
        refresh_token=refresh_token
    )

# ✅ Verify Token
@app.get("/verify-token")
async def verify_token_endpoint(token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == token_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }

# ✅ Excel/CSV Import
@app.post("/import-excel", response_model=ExcelImportResponse)
async def import_excel_data(file: UploadFile = File(...)):
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
        raise HTTPException(status_code=400, detail="Only .csv and .xlsx files are supported")

    content = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File parse error: {str(e)}")

    imported_data = []
    for _, row in df.iterrows():
        try:
            quality_data = QualityData(
                timestamp=str(row.get('timestamp', datetime.datetime.now().isoformat())),
                metric_name=str(row.get('metric_name', 'Unknown')),
                value=float(row.get('value', 0)),
                target=float(row.get('target', 0)),
                unit=str(row.get('unit', '')),
                process=str(row.get('process', '')),
                operator=str(row.get('operator', '')),
                notes=str(row.get('notes', ''))
            )
            imported_data.append(quality_data.dict())
        except Exception:
            continue

    if not imported_data:
        raise HTTPException(status_code=400, detail="No valid data found in file")

    return ExcelImportResponse(
        success=True,
        message=f"Successfully imported {len(imported_data)} quality data records",
        imported_rows=len(imported_data),
        sample_data=imported_data[:5]
    )

    # Broadcast update to WebSocket clients
    await manager.broadcast(json.dumps({
        "type": "import_status_update",
        "success": True,
        "message": f"Successfully imported {len(imported_data)} quality data records",
        "imported_rows": len(imported_data),
        "sample_data": imported_data[:5]
    }))

# ✅ Gemini Chat
@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    if not GEMINI_API_KEY:
        return ChatResponse(
            response="❌ Gemini API key is not configured. Please add your API key to backend/config.py and restart the server.",
            success=False
        )
    try:
        print(f"DEBUG: GEMINI_API_KEY loaded: {GEMINI_API_KEY[:5]}...{GEMINI_API_KEY[-5:]}") # Print partial key for security
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Construct prompt with history
        full_prompt = ""
        if request.history:
            for msg in request.history:
                if msg["type"] == "user":
                    full_prompt += f"User: {msg["content"]}\n"
                elif msg["type"] == "bot":
                    full_prompt += f"AI: {msg["content"]}\n"
        
        full_prompt += f"As QualityBot AI (user role: {request.user_role}, language: {request.language}), clearly answer: {request.prompt}"
        
        response = model.generate_content(full_prompt)

        if hasattr(response, "text"):
            return ChatResponse(response=response.text, success=True)
        else:
            print(f"DEBUG: No response text from Gemini. Full response object: {response}")
            return ChatResponse(response="❌ No response text received from Gemini.", success=False)
    except Exception as e:
        print(f"DEBUG: Error in Gemini API call: {e}") # This will print the actual error
        return ChatResponse(response=f"❌ Error: {str(e)}", success=False)

# ✅ Run with: uvicorn app:app --reload
