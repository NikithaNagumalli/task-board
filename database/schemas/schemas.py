def individual_serial(task) -> dict:
    print(f"DEBUG: Task keys found: {task.keys()}")
    return {
        "id": str(task["_id"]),
        "task_id": task["id"],
        "content": task["content"],
        "column": task["column"]
    }

def list_serial(tasks) -> list:
    return[individual_serial(task) for task in tasks]