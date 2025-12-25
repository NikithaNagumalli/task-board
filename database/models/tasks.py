from pydantic import BaseModel

class DB_Task(BaseModel):
    id: str
    content: str
    column: str
