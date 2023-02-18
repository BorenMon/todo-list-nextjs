import ListItem from '@/components/ListItem'
import { useEffect, useState } from 'react'
import api from '@/services/api'

export default function Home() {
  const [input, setInput] = useState('')
  const [todoList, setTodoList] = useState([])
  const [noMatch, setNoMatch] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditingID, setCurrentEditingID] = useState('')

  function onInputHandler(value){
    setInput(value)
  }

  async function onDeleteHandler(id){
    try {
      await api.delete(`api/todo/${id}`)
    } catch(error) {
      console.log(error)
    }
  }

  function onEditHandler(id, todo){
    setInput(todo)
    setIsEditing(true)
    setCurrentEditingID(id)
  }

  async function onUpdateHandler(){
    if(currentEditingID) {
      try {
        await api.put(`api/todo/${currentEditingID}`, {todo: input})
        setIsEditing(false)
        setInput('')
      } catch(error) {
        console.log(error)
      }
    }
  }

  async function onToggleComplete(id, prev){
    try {
      await api.put(`api/todo/${id}`, {isStatusChanged: true, prevStatus: prev})
    } catch(error) {
      console.log(error)
    }
  }

  async function add() {
    if(todoList.filter(x => x.todo == input).length > 0) alert('You can\'t add duplicates!')
    else if (input) {
      try {
        const {data} = await api.post('api/todo', {todo: input})
        setTodoList(todoList.concat(data.data))
        setInput('')
      } catch(error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    api.get('api/todo').then(({data}) => {
      setTodoList(data.data)
    })
  }, [todoList])

  useEffect(() => {
    if(input && !isEditing) {
      if(todoList.filter(x => x.todo.includes(input)).length == 0){
        setNoMatch(true)
      } else setNoMatch(false)
    } else {
      setNoMatch(false)
    }
  }, [input])

  return (
    <div className="app">
      <div className="bg-white p-6 w-96 shadow rounded">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="mt-4 flex space-x-2">
          <input
            value={input}
            onInput={e => onInputHandler(e.target.value)}
            type="text"
            className="rounded flex-1 border-2 px-4 py-2 focus:outline-none focus:border-violet-500"
          />
          {isEditing && (
            <button className="rounded w-12 h-12 bg-slate-500 active:scale-95 hover:bg-slate-600 text-white" onClick={() => {setIsEditing(false); setCurrentEditingID(''); setInput('')}}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
          <button
            onClick={isEditing ? onUpdateHandler : add}
            className="rounded w-12 h-12 bg-violet-500 active:scale-95 hover:bg-violet-600 text-white"
          >
            {!isEditing && <i className="fa-solid fa-plus"></i>}
            {isEditing && <i className="fa-solid fa-floppy-disk"></i>}
          </button>
        </div>
        {todoList.length != 0 && (
          <ul className="mt-4 space-y-2">
            {
              !noMatch && !isEditing && todoList.filter(x => x.todo.includes(input)).map(todo => (
                <ListItem list={todo} key={todo._id} handleDelete={onDeleteHandler} handleEdit={onEditHandler} handleComplete={onToggleComplete} />
              ))
            }
            {
              noMatch && <p className="text-center">No result. Create a new one instead!</p>
            }
          </ul>
        )}
      </div>
    </div>
  )
}
