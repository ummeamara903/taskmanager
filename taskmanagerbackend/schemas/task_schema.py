from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool
    created_at: datetime

    class Config:
        orm_mode = True

