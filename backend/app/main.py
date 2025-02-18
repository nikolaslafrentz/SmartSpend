from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import auth, users, transactions

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartSpend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
