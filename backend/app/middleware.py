import os
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from fastapi import Depends
from .schemas import TokenData
from backend.app.login.login import ALGORITHM


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")
SECRET_KEY = os.getenv("SECRET_KEY", "")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception

    return token_data
