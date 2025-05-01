import os
import jwt

from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from backend.app.schemas import TokenData

SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = os.getenv("ALGORITHM", "")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id:  int | None = payload.get("user_id")
        role:     str | None = payload.get("role")
        
        if username is None:
            raise credentials_exception
        
        token_data = TokenData(
            username=username,
            user_id=user_id,  # Add user_id to TokenData
           role=role,)  # Add role to TokenData
    
    except jwt.PyJWTError:
        raise credentials_exception

    return token_data


# ========Added
def require_role(required_role: str):
    def checker(current: TokenData = Depends(get_current_user)):
        if current.role != required_role:
            raise HTTPException(
              status_code=status.HTTP_403_FORBIDDEN,
              detail="Operation not permitted"
            )
        return current
    return checker
