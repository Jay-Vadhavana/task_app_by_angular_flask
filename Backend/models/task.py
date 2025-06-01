from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.sql import func
from .enums import StatusEnum, TypeEnum

db = SQLAlchemy()

class TaskModel(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    entityName = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Integer, nullable=False)
    contactPerson = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.String(500), nullable=True)
    status = db.Column(db.Integer, nullable=False)
    dueDateTime = db.Column(db.DateTime, nullable=False)
    isDeleted = db.Column(db.Boolean, default=False, nullable=False)  # Soft delete
    createdDateTime = db.Column(db.DateTime, default=func.now(), nullable=False)
    modifiedDateTime = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return (
            f"<Task(id={self.id}, entityName='{self.entityName}', type={self.type}, "
            f"contactPerson='{self.contactPerson}', notes='{self.notes}', status={self.status}, "
            f"dueDateTime={self.dueDateTime}, isDeleted={self.isDeleted}, "
            f"createdDateTime={self.createdDateTime}, modifiedDateTime={self.modifiedDateTime})>"
        )