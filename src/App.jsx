import { Component, createContext } from "react";
import axios from "axios";
import Card from "./components/Card";
import DisplayTodo from "./components/DisplayTodo";


class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      title : "",
      task : "",
      todos : []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTodoList = this.fetchTodoList.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name] : value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.createTodo();
  }

  fetchTodoList = async () => {
    try {
      await axios.get("http://localhost:3000/todos")
                  .then(res => {
                      this.setState({ todos : res.data });
                      // console.log(res)
                    })
                  .catch(err => console.log(err))
    } catch (error) {
      console.log(error);
    }
  }

  createTodo = async () => {
    try {
      const response = await axios.post("http://localhost:3000/todos", { title : this.state.title, task : this.state.task })
      let newTodo = response.data;
      
      this.setState((prevState) => ({
        todos : [...prevState.todos, newTodo],
        title : "",
        task : ""
      }))
    } catch (error) {
      console.log(error);
    }
  }

  deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`)

      this.setState((prevState) => ({
        todos : prevState.todos.filter(todo => todo?.id !== id)
      }))
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount = () => {
    this.fetchTodoList();
  }

  componentDidUpdate = (prevProps, prevState) => {
   
  }

  render(){
    return(
      <div className="flex flex-col gap-6 max-w-screen-sm mx-auto py-5">
        <h1 className="text-2xl font-bold text-center">Todo List</h1>

        {/* todo input part */}
        <form 
          onSubmit={this.handleSubmit} 
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col w-full gap-1">
            <span>Title</span>
            <input 
              type="text" 
              name="title" 
              id="" 
              value={this.state.title} 
              className="border-2 rounded-md  py-2 px-4" 
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <span>Task</span>
            <input 
              type="text" 
              name="task" 
              value={this.state.task} 
              className="border-2 rounded-md  py-2 px-4" 
              onChange={(e) => this.handleChange(e)} 
            />
          </div>
          <button 
            type="submit" 
            className="border border-none bg-blue-800 w-24 h-11 rounded-sm font-bold text-white"
          >
            Add
          </button>
        </form>

        {/* todo's card list */}
        <DisplayTodo 
          todos={this.state.todos} 
          deleteTodo={this.deleteTodo}
        />
      </div>
    )
  }
}

export default App;