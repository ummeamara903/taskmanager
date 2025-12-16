from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user_schema import UserCreate
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from utils.auth import hash_password, verify_password, create_token, SECRET_KEY, ALGORITHM
import jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

# ------------------------ REGISTER ------------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)   # Same hash used in login
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully!"}


# ------------------------ LOGIN ------------------------
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    # User can login with email OR username
    user = db.query(User).filter(
        (User.email == form_data.username) | (User.username == form_data.username)
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or username")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
