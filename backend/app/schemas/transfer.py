from pydantic import BaseModel

class TransferRequest(BaseModel):
    recipient_email: str
    amount: float
