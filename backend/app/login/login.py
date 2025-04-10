import os
from uuid import uuid4
from fastapi import HTTPException, status
import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from sqlalchemy.orm import Session

from backend.app import crud
from backend.app import schemas
from backend.app.schemas import TokenData


# Secret key and algorithm for JWT
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = os.getenv("SECRET_KEY", "")


# Define the exception that should be raised for invalid or expired tokens
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def authenticate_user(user_data: schemas.UserLogin, db: Session) -> str:
    user = crud.get_user_by_username(db, user_data.username)

    if not user or not crud.verify_password(user_data.password, user.password):
        raise credentials_exception

    access_token = create_access_token(
        data={
            "sub": user.name,
            "user_id": user.user_id,
        }
    )
    return access_token


def create_access_token(
    data: dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    to_encode.setdefault("iat", now.timestamp())
    to_encode.setdefault("jti", str(uuid4()))
    to_encode["exp"] = expire.timestamp()

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

        # Check if the token is blacklisted
        if is_token_blacklisted(db, token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been invalidated.",
            )

        token_data = TokenData(username=username)
    except jwt.PyJWKError:
        raise credentials_exception

    return token_data
