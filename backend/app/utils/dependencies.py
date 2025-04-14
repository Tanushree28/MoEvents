from fastapi import Depends, HTTPException, status
from backend.app.services.token_service import TokenService
from backend.app.database import get_db
from backend.app.middleware import oauth2_scheme

def get_current_user_role(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    token_data = TokenService.verify_token(token, db)
    return token_data.role

def admin_required(role: str = Depends(get_current_user_role)):
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
