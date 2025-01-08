import { Component } from "react";
import { Link } from "react-router-dom";

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