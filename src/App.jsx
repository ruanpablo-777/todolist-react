import './App.css'
import { SpellCheck, Pencil, Delete, } from "lucide-react"
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  const [inputValue, setInputValue] = useState("")
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState("all")

console.log(tasks)
useEffect(() => {
  async function fetchTasks(){
    try {
      const response = await axios.get("https://todolist7.vercel.app/tasks")
      console.log("Fetched tasks:", response.data); 
      setTasks(response.data)
    } catch (error) {
      console.error("error fetching tasks: ", error)
    }
  }
  fetchTasks()
}, [])

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleAddTask = async () => {
    if(inputValue.trim() !== "") {
      try{
        const newTask = {text: inputValue, done: false}
       const response = await axios.post("https://todolist7.vercel.app/tasks", newTask)
        console.log("Added task:", response.data);
      setTasks([...tasks, response.data])
      setInputValue("")
      }
      catch (error) {
        console.log("error adding text:", error)
      }
    }
  }

  const handleDeleteTask = async (id) => {
    console.log("Deleting task with id:", id);
    try {
     await axios.delete(`https://todolist7.vercel.app/tasks/${id}`) 
     setTasks(tasks.filter(task => task.id !== id))
    }
   catch (error) {
    console.error("error deleting task:", error)
   }
  }

  const handleTaskDone = async (id) => {
    try{
      const task = tasks.find(task => task.id === id)
      if(!task) {
        throw new Error("task not found")
      }
      const updatedTask = { ...task, done: !task.done }
      await axios.put(`https://todolist7.vercel.app/tasks/${id}`, updatedTask)
      const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t)
      
      setTasks(updatedTasks)

    }
    catch (error) {
      console.error("error updating task: ", error)
    }
  }

  const handleEditTask = async (id) => {
    const newText = prompt("Edite a tarefa: ", tasks.find(task => task.id === id).text);
    if (newText !== null && newText.trim() !== "") {
      const updatedTask = { ...tasks.find(task => task.id === id), text: newText };
      try {
        await axios.put(`https://todolist7.vercel.app/tasks/${id}`, updatedTask);
        const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  }


  function filteredTasks() {
    if(filter === "active") {
      return tasks.filter(task => !task.done)
    }
    if(filter === "completed") {
      return tasks.filter(task => task.done)
    }
    return tasks
  }

  /*  useEffect(() => {
      function applyStylesBasedOnHeight() {
        const listas = document.querySelector(".listas")
        const section = document.querySelector(".listas section")

        if(listas && section){
          if(listas.offsetHeight > 100) {
            section.style.display = "flex"
            section.style.flexDirection = "column"
            
          } else {
            section.style.display = ""
            section.style.flexDirection = ""
          }
        }
      }
      applyStylesBasedOnHeight()

      window.addEventListener("resize", applyStylesBasedOnHeight)

      return () => {
        window.removeEventListener("resize", applyStylesBasedOnHeight)
      }
    }, [])
 */

  return (
    <div className='all'>
      <div className="semiall">
        <h1>Lista de Tarefas</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="inputs">
            <input
              type="text"
              id="text"
              placeholder='Escreva Sua Lista Aqui...'
              value={inputValue}
              onChange={handleInputChange}
            />
            <input
              type="button"
              value="ADD"
              id="button"
              onClick={handleAddTask}
            />
          </div>
        
        </form>
            <div className="filter">
              <button onClick={() => setFilter("all")} >Todas</button>
              <button onClick={() => setFilter("active")}>Ativas</button>
              <button onClick={() => setFilter("completed")} >Concluídas</button>
            </div>
        
        {filteredTasks().map((task) => {
         console.log("Rendering task:", task); 
        return (
          <div className='listas'  key={task.id || task.text}  style={{textDecoration: task.done ? "line-through" : "none"}}>
           
              <div className="parag">
                <p>{task.text}</p>
              </div>
           
            <div className="button-left">
              <section>
                <button onClick={() => handleTaskDone(task.id)}><SpellCheck /></button>
                <button onClick={() => handleEditTask(task.id)}><Pencil /></button>
                <button onClick={() => handleDeleteTask(task.id)}><Delete /></button>
              </section>
            </div>
            </div>
          
)})}

             
        
        
      </div>
    </div >
  )
}

export default App
