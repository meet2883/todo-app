import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
          title : "",
          task : "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createTodo = this.createTodo.bind(this);
        this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
          [name] : value
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.createTodo()
    }
    
    createTodo = async () => {
        const date = new Date();
        const createDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
        try {
            const response = await axios.post("http://localhost:3000/todos", { 
                title : this.state.title, 
                task : this.state.task,
                createdAt : createDate 
            })
            
            this.setState((prevState) => ({
                title : "",
                task : ""
            }))
        } catch (error) {
            console.log(error);
        }
    }

    handleKeyboardShortcuts = (e) => {
        let focusedEvent = document.activeElement;

        if(focusedEvent.tagName === "INPUT" || focusedEvent.tagName === "TEXTAREA"){
            return;
        }

        e.preventDefault()
        if(e.ctrlKey && e.key === "l"){
            window.location.replace("http://localhost:5173/list")
        }
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyboardShortcuts)
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyboardShortcuts)
    }
    
    render(){
        

        const { task, title } = this.state;
        return(
            <div className="flex flex-col gap-6 max-w-screen-sm mx-auto py-5">
                 <Link to={"/list"} className="underline-offset-4">Lists</Link>
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
                        Add
                    </button>
                </form>
            </div>
        )
    }
}

export default Home;