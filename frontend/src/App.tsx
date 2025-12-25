import { useState } from 'react'

const API_BASE = "http://localhost:8000"

const api = {
  updateBoard: (sourceColumnId: string, destColumnId: string, taskId: string) => 
    fetch(`${API_BASE}/tasks/${sourceColumnId}/${destColumnId}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }),
  addTask: (columnId: string, task: Task) => 
    fetch(`${API_BASE}/tasks/${columnId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    }),
  deleteTask: (columnId: string, taskId: string) => 
    fetch(`${API_BASE}/tasks/${columnId}/${taskId}`, { method: 'DELETE' })
};

type ColumnKey = "todo" | "inProgress" | "done";

type Task = {
  id: string;
  content: string;
  column: ColumnKey;
};

type Column = {
  name: string;
  items: Task[];
};

type Columns = {
  [key in ColumnKey]: Column;
};

type DraggedItem = {
  columnId: ColumnKey
  item: Task
}

function App() {
  const [columns, setColumns] = useState<Columns>({
    todo: {
      name: "To Do",
      items:[
      ]
    },
    inProgress:{
      name: "In Progress",
      items:[
      ]
    },
    done: {
      name: "Done",
      items:[
      ]
    }
  })

  const [newTask, setNewTask] = useState("")
  const [activeColumn, setActiveColumn] = useState<ColumnKey>("todo")
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)

  const addNewTask = () => {
    if(newTask.trim() === "") return;

    const updatedColumns = {...columns};
    const taskToAdd = {
      id: Date.now().toString(),
      content: newTask,
      column: activeColumn
    }
    updatedColumns[activeColumn].items.push(taskToAdd)

    setColumns(updatedColumns)
    setNewTask("")
    api.addTask(activeColumn, taskToAdd)
  }

  const removeTask = (columnId: ColumnKey, taskId: string) => {
    const updatedColumns = {...columns}
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId)

    setColumns(updatedColumns)

    api.deleteTask(columnId, taskId)
  }

  const handleDragStart = (columnId: ColumnKey, item: Task) => {
    setDraggedItem({columnId, item})
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: ColumnKey) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: ColumnKey) => {
    e.preventDefault()

    if (!draggedItem) return;

    const {columnId: sourceColumnId, item: movingItem} = draggedItem

    if (sourceColumnId === columnId) return;

    const updatedColumns = {...columns}
    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter((item) => item.id !== movingItem.id)
    updatedColumns[columnId].items.push(movingItem)

    setColumns(updatedColumns)
    setDraggedItem(null)

    api.updateBoard(sourceColumnId, columnId, movingItem.id)
  }

  const columnStyles = {
    todo: {
      header:"bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400"
    },
    inProgress: {
      header:"bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400"
    },
    done: {
      header:"bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400"
    }
  }

  return ( 
    <>
      <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold' }}>React Trello Board</h1>
      <div style={{ marginBottom: '2rem', display: 'flex', width: '100%', overflow: 'hidden' }}>
        <input type="text" value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
        onKeyDown={(e) => e.key === "Enter" && addNewTask()}
        />

        <select value={activeColumn}
        onChange={(e) => setActiveColumn(e.target.value as ColumnKey)}
        >
          {Object.keys(columns).map((columnId) => (
            <option key={columnId} value={columnId}>
              {columns[columnId as ColumnKey].name}
            </option>
          ))}
        </select>

        <button onClick={addNewTask}>Create Task</button>
      </div>

      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', width: '100%' }}>
          {Object.keys(columns).map((columnId) => (
            <div key={columnId} 
              onDragOver={(e) => handleDragOver(e, columnId as ColumnKey)}
              onDrop={(e) => handleDrop(e, columnId as ColumnKey)}
            >
              <div>{columns[columnId as ColumnKey].name}</div>
              <div style={{ padding: '12px', minHeight: '256px'}}>
                {columns[columnId as ColumnKey].items.length === 0 ? (<div>Drop tasks here </div>) : (
                  columns[columnId as ColumnKey].items.map((item) => (
                    <div key={item.id} draggable  onDragStart={() => handleDragStart(columnId as ColumnKey, item)}>
                      {item.content}
                      <button onClick={() => removeTask(columnId as ColumnKey, item.id)}>x</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default App
