from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from database.models.tasks import DB_Task
from database.config.database import collection_name
from database.schemas.schemas import list_serial
from bson import ObjectId

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"], # This MUST include "OPTIONS"
    allow_headers=["*"],
)

class Task(BaseModel):
    id: str
    content: str
    column: str

@app.get("/")
def root():
    return list_serial(collection_name.find())

@app.put("/tasks/{source_column_id}/{dest_column_id}/{task_id}")
def update_task_col(dest_column_id: str, task_id: str) -> str:
    print("in put")
    collection_name.find_one_and_update({"id": task_id}, {"$set": {"column": dest_column_id}})
    return "moved task"

@app.post("/tasks/{column_id}")
def create_task(task: Task) -> str:
    print("in post")
    collection_name.insert_one(dict(task))
    return "created task"

@app.delete("/tasks/{column_id}/{task_id}")
def delete_task(task_id: str) -> str:
    print("in delete")
    collection_name.find_one_and_delete({"id": task_id})
    return "deleted task"