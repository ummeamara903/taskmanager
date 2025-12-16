from fastapi import APIRouter, Depends, BackgroundTasks, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db, engine
from utils.logging_config import logger
from utils.background_jobs import send_notification
from utils.auth import get_current_user    # <— ADD THIS
from models.task_model import Task, Base
from schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse
import shutil
from typing import List

# create tables
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ---------------- CREATE TASK (Protected) ----------------
@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    logger.info(f"{current_user.username} is creating a new task")

    new_task = Task(
        title=task.title,
        description=task.description,
        user_id=current_user.id   # <---- FIX
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    background_tasks.add_task(send_notification, task.title)

    return new_task


# ---------------- GET TASKS (Public / Optional Protected) ----------------
@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    tasks = db.query(Task).offset(skip).limit(size).all()
    return tasks
# ------------------- Get User's Own Tasks -------------------

@router.get("/my", response_model=list[TaskResponse])
def get_my_tasks(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Task).filter(Task.user_id == current_user.id).all()

# ---------------- GET SINGLE TASK (Public) ----------------
@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    return task


# ---------------- UPDATE TASK (Protected) ----------------
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    update_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)       # <— PROTECTED
):
    logger.info(f"{current_user} is updating task {task_id}")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


# ---------------- DELETE TASK (Protected) ----------------
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)        # <— PROTECTED
):
    logger.info(f"{current_user} is deleting task {task_id}")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}


# ---------------- FILE UPLOAD (Public or Protected) ----------------
@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"message": "File uploaded", "path": file_location}
