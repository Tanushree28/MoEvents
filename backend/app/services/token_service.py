import os
from fastapi import HTTPException, status
import jwt
from uuid import uuid4
from datetime import datetime, timezone, timedelta
from typing import Optional, Any
from sqlalchemy.orm import Session

from backend.app import schemas
from backend.app import crud
from backend.app.crud import is_jti_revoked, revoke_jti
from pydantic import PrivateAttr

# Secret key and algorithm for JWT
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = os.getenv("SECRET_KEY", "")


class TokenService:
    # Define the exception that should be raised for invalid or expired tokens
    __credentials_exception = PrivateAttr(
        default=HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    )

    @classmethod
    def _create_access_token(
        cls, data: dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = data.copy()
        now = datetime.now(timezone.utc)
        expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

        to_encode.setdefault("iat", now.timestamp())
        to_encode.setdefault("jti", str(uuid4()))
        to_encode["exp"] = expire.timestamp()

        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @classmethod
    def authenticate_user(cls, user_data: schemas.UserLogin, db: Session) -> str:
        user = crud.get_user_by_username(db, user_data.username)

        if not user or not crud.verify_password(user_data.password, user.password):
            raise cls.__credentials_exception

        access_token = cls._create_access_token(
            data={
                "sub": user.name,
                "user_id": user.user_id,
            }
        )
        return access_token

    @staticmethod
    def revoke_token(token: str, db: Session):
        try:
            payload = jwt.decode(
                token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False}
            )
        except jwt.PyJWTError:
            return

        jti = payload.get("jti")
        exp_ts = payload.get("exp")
        if jti and exp_ts:
            expires_at = datetime.fromtimestamp(exp_ts, tz=timezone.utc)
            revoke_jti(db, jti, expires_at)

    @classmethod
    def verify_token(cls, token: str, db: Session):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise cls.__credentials_exception

            # Check if the token is blacklisted
            if is_jti_revoked(db, token):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been invalidated.",
                )

            token_data = schemas.TokenData(username=username)
        except jwt.PyJWKError:
            raise cls.__credentials_exception

        return token_data
