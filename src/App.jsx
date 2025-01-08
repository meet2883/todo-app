import { Component } from "react";
import axios from "axios";
import DisplayTodo from "./components/DisplayTodo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";


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
    return(
      <BrowserRouter>
        <Routes>
          <Route 
            path="/"
            element={<Home />} 
          />

          <Route 
            path="/list"
            element={<List />}
          />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;