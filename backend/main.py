from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi
from database.models.tasks import Task
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"], # This MUST include "OPTIONS"
    allow_headers=["*"],
)

# uri = "mongodb+srv://nikitha:dbUserPassword@cluster0.mlefytl.mongodb.net/?appName=Cluster0" 
# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))
# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

class Task(BaseModel):
    id: str
    content: str

@app.get("/")
def root():
    return {"Hello": "World"}

@app.put("/tasks/{source_column_id}/{dest_column_id}/{task_id}")
def update_task_col() -> str:
    print("in put")
    return "moved task"

@app.post("/tasks/{column_id}")
def create_task(task: Task) -> str:
    print("in post")
    return "created task"

@app.delete("/tasks/{column_id}/{task_id}")
def delete_task() -> str:
    print("in delete")
    return "deleted task"