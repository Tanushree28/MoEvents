from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import schemas, crud

router = APIRouter()

@router.post("/update-role")
def update_user_role(user_id: int, role: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    db.commit()
    db.refresh(user)
    return {"message": "Role updated successfully"}