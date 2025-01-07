import Card from "./Card";
import axios from "axios";
import { Component } from "react";

class DisplayTodo extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchResults : [],
            searchQuery : ""
        }
        this.searchTodos = this.searchTodos.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value} = e.target;
        this.setState({
            searchQuery : value
        })
    }

    searchTodos =  (e) => {
        e.preventDefault();
        const { searchQuery } = this.state;
        if(this.state.searchQuery !== "") {
            const filterResults = this.props.todos?.filter((todo) => {
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

    render(){
        const { searchResults } = this.state;
        const { todos, deleteTodo, fetchTodo } = this.props;
        const data = ( searchResults.length > 0 ) ? searchResults : todos;

        return(
            <div
                className="flex flex-col gap-4"
            >
                <form 
                    onSubmit={this.searchTodos}
                    onReset={this.cancelSearch}
                    className="flex items-center gap-2"
                >
                    <input 
                        type="text" 
                        name="searchQuery" 
                        value={this.state.searchQuery} 
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

                {/* todo cards List */}
                <div className="grid grid-cols-2 mx-auto gap-2">
                    {
                        data?.map((todo) => {
                            const { id, title, task} = todo;
                            return (
                                <Card 
                                    key={id}
                                    title={title}
                                    id={id}
                                    task={task}
                                    deleteTodo={deleteTodo}
                                    fetchTodo={fetchTodo}
                                />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default DisplayTodo;