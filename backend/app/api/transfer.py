from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.transfer import TransferRequest
from ..core.security import get_current_user

router = APIRouter()

@router.post("/transfer")
async def transfer_money(
    transfer_request: TransferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if recipient exists
    recipient = db.query(User).filter(User.email == transfer_request.recipient_email).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )

    # Check if current user has enough balance
    if current_user.total_balance < transfer_request.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )

    # Transfer money
    current_user.total_balance -= transfer_request.amount
    recipient.total_balance += transfer_request.amount

    db.commit()

    return {"message": "Transfer successful"}
