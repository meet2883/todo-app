import axios from "axios";
import { Component } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { BsXLg } from "react-icons/bs";
import DisplayTodo from "../components/DisplayTodo";

class List extends Component{
    constructor(props){
        super(props);
        this.state = {
            todos : [],
            isUpdate : false,
            updateId : "",
            searchResults : [],
            searchQuery : "",
            title : "",
            task : ""
        }
        this.fetchTodoList = this.fetchTodoList.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.fetchTodo = this.fetchTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.searchTodos = this.searchTodos.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this);
        this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
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

    updateTodo = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/todos/${this.state.updateTodoId}`, 
                { 
                    title : this.state.title, task : this.state.task 
                }
            )
            this.fetchTodoList();

        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ 
            isUpdate : true ,
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

    handleChange = (e) => {
        e.preventDefault();
        const { name, value} = e.target;
        this.setState({
            [name] : value
        })
    }

    searchTodos =  (e) => {
        e.preventDefault();
        const { searchQuery } = this.state;
        if(this.state.searchQuery !== "") {
            const filterResults = this.state.todos?.filter((todo) => {
                return todo?.title?.toString().includes(searchQuery) || todo?.task?.toString().includes(searchQuery) 
            })

            this.setState({
               searchResults : filterResults
            })
        }
    }

    cancelSearch = (e) => {
        e.preventDefault();
        this.setState({ 
            searchQuery : "" ,
            searchResults : []
        })
    }

    handleKeyboardShortcuts = (e) => {
        let focusedEvent = document.activeElement;

        if(focusedEvent.tagName === "INPUT" || focusedEvent.tagName === "TEXTAREA"){
            return;
        }

        e.preventDefault()
        if(e.ctrlKey && e.key === "b"){
            window.location.replace("http://localhost:5173/")
        }
    }

    componentDidMount = () => {
        this.fetchTodoList();

        document.addEventListener("keypress", this.handleKeyboardShortcuts)
    }

    componentWillUnmount = () => {
        document.removeEventListener("keypress", this.handleKeyboardShortcuts)
    }

    render(){
        const { todos, searchResults, searchQuery, isUpdate, task, title } =  this.state;
        const data = ( searchResults.length > 0 ) ? searchResults : todos;

        return(
            <div>
                <div
                    className={`${isUpdate ? "opacity-20" : "opacity-100"}`}
                >
                    <Link to={"/"} className="underline-offset-4">Home</Link>
                    <div
                        className="flex flex-col gap-4 items-center py-5"
                    >
                        <h1 className="font-bold text-3xl">Tasks List</h1>
                        <form 
                            onSubmit={this.searchTodos}
                            onReset={this.cancelSearch}
                            className="flex items-center gap-2 w-[650px]"
                        >
                            <input 
                                type="text" 
                                name="searchQuery" 
                                value={searchQuery} 
                                className="border-2 rounded-md  py-2 px-4 w-full" 
                                onChange={(e) => this.handleChange(e)}
                                placeholder="Enter keyword you want search"
                            />

                            <button 
                                type="submit" 
                                className="border border-none bg-blue-800 w-24 h-11 rounded-sm font-bold text-white"
                            >
                                Search
                            </button>

                            <button 
                                type="reset" 
                                className="border border-none bg-red-800 w-24 h-11 rounded-sm font-bold text-white"
                            >
                                Cancel
                            </button>
                        </form>

                        {/* display todo's list */}
                        <div
                            className="grid grid-cols-2 gap-3"
                        >
                            {
                                data?.map((todo) => {
                                    const { id, task, title, createdAt } = todo;

                                    return(
                                        <Card
                                            key={id}
                                            id={id}
                                            task={task}
                                            title={title}
                                            fetchTodo={this.fetchTodo}
                                            deleteTodo={this.deleteTodo}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                {
                    isUpdate && (
                        <form
                            className="fixed inset-0 bg-white bg-opacity-50 flex flex-col w-96 mx-auto justify-center items-center gap-3"
                            onSubmit={this.updateTodo}
                        >
                            <BsXLg 
                                cursor="pointer" 
                                className="relative left-44" 
                                onClick={() => {
                                    this.setState({
                                        isUpdate : false
                                    })
                                }}
                            />
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
                                <textarea 
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
                                update
                            </button>
                        </form>
                    )
                }
            </div>
        )
    }
}

export default List;