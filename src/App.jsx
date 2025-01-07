import { Component } from "react";
import axios from "axios";
import DisplayTodo from "./components/DisplayTodo";


class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      title : "",
      task : "",
      isUpdate : false,
      updateTodoId : "",
      todos : []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTodoList = this.fetchTodoList.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.fetchTodo = this.fetchTodo.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name] : value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    (this.state.isUpdate) ? this.updateTodo() : this.createTodo();
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
      const response = await axios.post("http://localhost:3000/todos", { 
        title : this.state.title, task : this.state.task 
      })
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

  updateTodo = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/todos/${this.state.updateTodoId}`, { 
        title : this.state.title, task : this.state.task 
      })
      // console.log(response.data);
      
      this.fetchTodoList();

    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ 
        isUpdate : false ,
        task : "",
        title : ""
      })
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

  fetchTodo = async (id) => {
    try {
      await axios.get(`http://localhost:3000/todos/${id}`)
                  .then(res => {
                      this.setState({ 
                          title : res?.data?.title,
                          task : res?.data?.task,
                          isUpdate : true,
                          updateTodoId : res?.data?.id
                      });
                    })
                  .catch(err => console.log(err))
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
    const { isUpdate, task, title ,todos} = this.state;
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
              value={title} 
              className="border-2 rounded-md  py-2 px-4" 
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <span>Task</span>
            <input 
              type="text" 
              name="task" 
              value={task} 
              className="border-2 rounded-md  py-2 px-4" 
              onChange={(e) => this.handleChange(e)} 
            />
          </div>
          <button 
            type="submit" 
            className="border border-none bg-blue-800 w-24 h-11 rounded-sm font-bold text-white"
          >
            { isUpdate ? "Update" : "Add" }
          </button>
        </form>

        {/* todo's card list */}
        <DisplayTodo 
          todos={todos} 
          deleteTodo={this.deleteTodo}
          fetchTodo={this.fetchTodo}
        />
      </div>
    )
  }
}

export default App;