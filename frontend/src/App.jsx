import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8000/todos")
      .then(res => setTodos(res.data))
  }, [])

  const addTodo = () => {
    axios.post("http://localhost:8000/todos", { title: newTodo })
      .then(res => setTodos([...todos, res.data]))
    setNewTodo("")
  }

  const statuses = ["not_done", "in_progress", "done"];

  const advanceStatus = async (todo) => {
    const nextStatus = getNextStatus(todo.status);

    try {
      const res = await axios.put(`http://localhost:8000/todos/${todo.id}`, {
        status: nextStatus
      });

      setTodos(todos.map(t => (t.id === todo.id ? res.data : t)));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  function getNextStatus(current) {
    const status_num = statuses.indexOf(current);
    return statuses[(status_num + 1) % statuses.length];
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-left-group">
          <div className="header-logo">IMG</div>
          <div className="header-title">ToDo List Tracker</div>
        </div>
        <div className="header-author">By: Nathaniel Balkaran</div>
      </header>

      <div className="content">
        <div className="left">Left Sidebar</div>
        <div className="right">
          <div className="add-new-task">
            <input placeholder="Add a new task" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
            <button onClick={addTodo}>Add</button>
          </div>
          <div className="table">
            <div className="todo"> TODO
              <ul>
                {todos.map(t => <li key={t.id}>{t.title}
                  <button onClick={() => advanceStatus(todo)}>{'->'}</button>
                </li>)}
              </ul>
            </div>
            <div className="in-progress">IN PROGRESS</div>
            <div className="done">DONE</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
