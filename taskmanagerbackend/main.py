from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers.task_routes import router as task_router
from routers.auth_router import router as auth_router
from utils.logging_config import logger

app = FastAPI(title="Task Manager API")

# ------------------ CORS ------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Database ------------------
Base.metadata.create_all(bind=engine)

# ------------------ Routers ------------------
app.include_router(task_router)
app.include_router(auth_router)

# ------------------ Root Endpoint ------------------
@app.get("/")
def home():
    logger.info("Home endpoint called")
    return {"message": "Task Manager API Running!"}
