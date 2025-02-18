from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.transaction import Transaction
from ..models.user import User
from ..schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    # Create new transaction
    db_transaction = Transaction(
        user_id=1,  # Default user ID for testing
        amount=transaction.amount,
        category=transaction.category,
        description=transaction.description,
        is_good_spending=transaction.is_good_spending
    )
    
    # Update user's total balance
    user = db.query(User).filter(User.id == 1).first()
    user.total_balance -= transaction.amount
    
    # Add points if it's good spending
    if transaction.is_good_spending:
        user.points += 10
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == 1
    ).order_by(Transaction.created_at.desc()).all()
    return transactions

@router.get("/categories")
async def get_categories():
    return [
        "Groceries",
        "Transportation",
        "Entertainment",
        "Bills",
        "Shopping",
        "Food & Dining",
        "Health",
        "Education",
        "Other"
    ]
