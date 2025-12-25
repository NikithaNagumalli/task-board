def individual_serial(task) -> dict:
    return {
        "id": str(task["_id"]),
        "task_id": task["task_id"],
        "content": task["content"],
        "column": task["column"]
    }

def list_serial(tasks) -> list:
    return[individual_serial(task) for task in tasks]