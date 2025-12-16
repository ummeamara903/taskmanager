from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # NEW field for linking task with a specific user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Optional: Relationship back to user
    user = relationship("User", back_populates="tasks")

# index for fast search
Index("idx_title", Task.title)
