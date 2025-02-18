from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, users, transactions, transfer
from .database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartSpend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(transfer.router, prefix="/api", tags=["transfer"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
