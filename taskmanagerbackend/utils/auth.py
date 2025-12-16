from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext

from database import get_db
from models.user import User

# ---------------------- JWT CONFIG ------------------------
SECRET_KEY = "myjwtsecret123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------------------- PASSWORD HASHING ------------------------
pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12,
    deprecated="auto"
)


def hash_password(password: str) -> str:
    # bcrypt limit fix
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    password_safe = password_bytes.decode('utf-8', 'ignore')

    return pwd_context.hash(password_safe)


def verify_password(plain: str, hashed: str) -> bool:
    plain_bytes = plain.encode('utf-8')
    if len(plain_bytes) > 72:
        plain_bytes = plain_bytes[:72]
    plain_safe = plain_bytes.decode('utf-8', 'ignore')

    return pwd_context.verify(plain_safe, hashed)


# ---------------------- JWT TOKEN CREATION ------------------------
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ---------------------- GET CURRENT USER ------------------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Load full user from DB
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user  # <-- returns User model, not string
