import ListItem from '@/components/ListItem'
import { useEffect, useState } from 'react'
import api from '@/services/api'
import {Accordion} from 'flowbite-react'

export default function Home() {
  const [input, setInput] = useState('')
  const [todoList, setTodoList] = useState([])
  const [noMatch, setNoMatch] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditingID, setCurrentEditingID] = useState('')
  const [loading, setLoading] = useState(false)
  
  const filteredTodos = todoList.filter(x => {
    return x.todo.toLowerCase().trim().includes(input.toLowerCase().trim())
  })

  function getData(){
    api.get('api/todo').then(({data}) => {
      setTodoList(data.data)
      setLoading(false)
    })
  }

  function onInputHandler(value){
    setInput(value)
  }

  async function onDeleteHandler(id){
    if(confirm('Are you sure to delete this one?')) {
      setLoading(true)
      try {
        await api.delete(`api/todo/${id}`)
        getData()
      } catch(error) {
        console.log(error)
        setLoading(false)
      }
    }
  }

  function onEditHandler(id, todo){
    setInput(todo)
    setIsEditing(true)
    setCurrentEditingID(id)
  }

  async function onUpdateHandler(){
    if(currentEditingID) {
      setLoading(true)
      try {
        await api.put(`api/todo/${currentEditingID}, {todo: input}`)
        setIsEditing(false)
        setInput('')
        getData()
      } catch({response}) {
        const errorCode = response.data.error.code
        if(errorCode === 11000) alert('The value is unavailable!')
        console.log(errorCode)
        setLoading(false)
      }
    }
  }

  async function onToggleComplete(id, prev){
    try {
      await api.put(`api/todo/${id}`, {isStatusChanged: true, prevStatus: prev})
      getData()
    } catch(error) {
      console.log(error)
    }
  }

  async function add() {
    if(todoList.filter(x => x.todo.toLowerCase().includes(input.toLowerCase())).length > 0) alert('You can\'t add duplicates!')
    else if (input) {
      setLoading(true)
      try {
        const {data} = await api.post('api/todo', {todo: input})
        setTodoList(todoList.concat(data.data))
        setInput('')
        getData()
      } catch(error) {
        console.log(error)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    getData()
  }, [])

  useEffect(() => {
    if(input && !isEditing) {
      // todoList.forEach(x => {
      //   console.log((x.todo).trim().toLowerCase().includes((input.trim()).toLowerCase()))
      // })
      console.log(filteredTodos)
      // if(filteredTodos.filter(x => x.todo.includes(input)).length == 0){
      //   setNoMatch(true)
      // } else 
      setNoMatch(filteredTodos.length == 0)
    } else {
      setNoMatch(false)
    }
  }, [input])
  return (
    <div className="app">
      <div className="bg-white p-6 w-[95%] shadow rounded" style={{ maxWidth: "24rem" }}>
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="mt-4 flex space-x-2">
          <input
            value={input}
            onInput={e => onInputHandler(e.target.value)}
            type="text"
            className="rounded flex-1 border-2 px-4 py-2 focus:outline-none focus:border-violet-500 w-fit min-w-0"
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
        {loading && <p className="mt-4">Loading...</p>}
        {todoList.length != 0 && (
          <>
            <ul className="mt-4 space-y-2">
              {
                !loading && !noMatch && !isEditing && filteredTodos.sort(function(a, b) {
                  return new Date(b.createdAt) - new Date(a.createdAt)
                }).filter(x => !x.isCompleted).map(todo => (
                  <ListItem list={todo} key={todo._id} handleDelete={onDeleteHandler} handleEdit={onEditHandler} handleComplete={onToggleComplete} />
                ))
              }
              {
                noMatch && <p className="text-center">No result. Create a new one instead!</p>
              }
            </ul>
            {!loading && !noMatch && !isEditing &&
              <Accordion alwaysOpen={true} className="mt-4">
                <Accordion.Panel>
                  <Accordion.Title>
                    Completed
                  </Accordion.Title>
                  <Accordion.Content className='space-y-2'>
                  {
                    filteredTodos.sort(function(a, b) {
                      return new Date(b.createdAt) - new Date(a.createdAt)
                    }).filter(x => x.isCompleted).map(todo => (
                      <ListItem list={todo} key={todo._id} handleDelete={onDeleteHandler} handleEdit={onEditHandler} handleComplete={onToggleComplete} />
                    ))
                  }
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            }
          </>
        )}
      </div>
    </div>
  )
}