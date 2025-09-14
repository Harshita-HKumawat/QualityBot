import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

# Configuration file for QualityBot Backend

# ✅ Updated Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db") # Default for local development

# Backend configuration
BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))

# For JWT token management
REFRESH_TOKEN_SECRET_KEY = os.getenv("REFRESH_TOKEN_SECRET_KEY", "super-secret-refresh-key")
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 43200)) # Default to 30 days
