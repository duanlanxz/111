import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

const STORAGE_KEY = 'todos'

function loadTodos(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = () => {
    const text = inputRef.current?.value.trim()
    if (!text) return
    setTodos(prev => [{ id: Date.now(), text, done: false }, ...prev])
    if (inputRef.current) inputRef.current.value = ''
  }

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTodo()
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const doneCount = todos.filter(t => t.done).length

  return (
    <div className="app">
      <div className="tape tape-left" />
      <div className="tape tape-right" />

      <h1>my to-do list</h1>

      <div className="input-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="写下今天要做的事..."
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={addTodo}>+</button>
      </div>

      <div className="filters">
        {(['all', 'active', 'done'] as Filter[]).map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : f === 'active' ? '待完成' : '已完成'}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filtered.length === 0 ? (
          <li className="empty">今天也要元气满满哦 ~</li>
        ) : (
          filtered.map(t => (
            <li key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTodo(t.id)}
              />
              <span>{t.text}</span>
              <button className="delete-btn" onClick={() => deleteTodo(t.id)}>✕</button>
            </li>
          ))
        )}
      </ul>

      <div className="status-bar">
        {todos.length > 0 ? `${doneCount} / ${todos.length} done` : ''}
      </div>

      <div className="footer-deco">~ today is a good day ~</div>
    </div>
  )
}
