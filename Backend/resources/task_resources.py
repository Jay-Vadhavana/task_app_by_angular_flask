from flask import Blueprint
from flask_restful import Api, Resource, fields, marshal_with, reqparse, abort
from datetime import datetime
from dateutil import parser
from models.task import TaskModel, db
from models.enums import TypeEnum, StatusEnum 
from flask import request
from sqlalchemy import and_, or_

# Blueprint and API setup
api_bp = Blueprint('api', __name__, url_prefix='/api')
api = Api(api_bp)

def parse_datetime(value):
    if isinstance(value, datetime):
        return value
    elif isinstance(value, str):
        try:
            return parser.parse(value)
        except Exception:
            raise ValueError("Invalid datetime format. Use YYYY-MM-DD HH:MM:SS or ISO 8601.")
    else:
        raise ValueError("Invalid datetime format")

def parse_enum(enum_class):
    def parser_func(value):
        try:
            if isinstance(value, int):
                return enum_class(value)
            elif isinstance(value, str):
                try:
                    return enum_class[value.upper()]
                except KeyError:
                    return enum_class(int(value))
            else:
                raise ValueError()
        except Exception:
            raise ValueError(f"Invalid value for {enum_class.__name__}")
    return parser_func

task_args = reqparse.RequestParser()
task_args.add_argument('entityName', type=str, required=True, help="Entity name can not be blank")
task_args.add_argument('type', type=int, required=True, help="Type can not be blank")
task_args.add_argument('contactPerson', type=str, required=True, help="Contact person can not be blank")
task_args.add_argument('notes', type=str, required=False, help="")
task_args.add_argument('status', type=int, required=True, help="Status can not be blank")
task_args.add_argument('dueDateTime', type=parse_datetime, required=True, help="Date & time can not be blank")

taskFields = {
    'id': fields.Integer,
    'entityName': fields.String,
    'type': fields.Integer,
    'contactPerson': fields.String,
    'notes': fields.String,
    'status': fields.Integer,
    'dueDateTime': fields.DateTime,
    'isDeleted': fields.Boolean,
    'createdDateTime': fields.DateTime,
    'modifiedDateTime': fields.DateTime
}

class Tasks(Resource):
    @marshal_with(taskFields)
    def get(self):
        query = TaskModel.query.filter_by(isDeleted=False)

        entity_names = request.args.getlist('entityName')
        types = request.args.getlist('type')
        contact_persons = request.args.getlist('contactPerson')
        statuses = request.args.getlist('status')
        due_date_from = request.args.get('dueDateFrom')
        due_date_to = request.args.get('dueDateTo')
        search = request.args.get('search')

        if entity_names:
            query = query.filter(TaskModel.entityName.in_(entity_names))
        if types:
            query = query.filter(TaskModel.type.in_(types))
        if contact_persons:
            query = query.filter(TaskModel.contactPerson.in_(contact_persons))
        if statuses:
            query = query.filter(TaskModel.status.in_(statuses))
        if due_date_from and due_date_to:
            query = query.filter(
                and_(
                    TaskModel.dueDateTime >= parser.parse(due_date_from),
                    TaskModel.dueDateTime <= parser.parse(due_date_to)
                )
            )
        elif due_date_from:
            query = query.filter(TaskModel.dueDateTime >= parser.parse(due_date_from))
        elif due_date_to:
            query = query.filter(TaskModel.dueDateTime <= parser.parse(due_date_to))

        
        if search:
            like_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    TaskModel.entityName.ilike(like_pattern),
                    TaskModel.contactPerson.ilike(like_pattern),
                    TaskModel.notes.ilike(like_pattern)
                )
            )

        sort_by = request.args.get('sortBy', 'entityName')
        sort_order = request.args.get('sortOrder', 'asc')

        sort_fields = {
            'entityName': TaskModel.entityName,
            'dueDateTime': TaskModel.dueDateTime,
            'contactPerson': TaskModel.contactPerson,
            'status': TaskModel.status,
            'type': TaskModel.type,
        }

        sort_column = sort_fields.get(sort_by, TaskModel.entityName)
        if sort_order == 'desc':
            sort_column = sort_column.desc()
        else:
            sort_column = sort_column.asc()

        query = query.order_by(sort_column)

        tasks = query.all()
        return tasks

    @marshal_with(taskFields)
    def post(self):
        args = task_args.parse_args()
        task = TaskModel(
            entityName=args["entityName"],
            type=args["type"],
            contactPerson=args["contactPerson"],
            status=args["status"],
            dueDateTime=args["dueDateTime"],
            notes=args.get("notes")
        )
        db.session.add(task)
        db.session.commit()
        return task, 201

class Task(Resource):
    @marshal_with(taskFields)
    def get(self, task_id):
        task = TaskModel.query.filter_by(id=task_id, isDeleted=False).first()
        if not task:
            abort(404, message="Task not found or has been deleted")
        return task

    @marshal_with(taskFields)
    def put(self, task_id):
        args = task_args.parse_args()
        task = TaskModel.query.get_or_404(task_id)
        task.entityName = args["entityName"]
        task.type = args["type"]
        task.contactPerson = args["contactPerson"]
        task.notes = args.get("notes")
        task.status = args["status"]
        task.dueDateTime = args["dueDateTime"]
        db.session.commit()
        return task

    def delete(self, task_id):
        task = TaskModel.query.get_or_404(task_id)
        task.isDeleted = True
        db.session.commit()
        return '', 204

# Register resources with the API
api.add_resource(Tasks, '/tasks')
api.add_resource(Task, '/tasks/<int:task_id>')