from database import engine, Base
from models import User  # import your User model

print("📦 Creating tables in Railway PostgreSQL...")
Base.metadata.create_all(bind=engine)
print("✅ Done! Tables created.")
