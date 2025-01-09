import { Component } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";

class Card extends Component{
    constructor(props){
        super(props);
        this.state = {
            bg : "",
        }
        
    }
    render(){
        const { 
            deleteTodo, 
            fetchTodo, 
            title, 
            task, 
            id, 
            createdAt,
            status,
            updatedDate 
        } = this.props;
        
        return(
            <div
                className={`flex flex-col border-2 cursor-pointer border-white 
                    rounded-xl w-80 h-32 p-2 drop-shadow-lg ${this.state.bg !== "" 
                    ? `${this.state.bg} text-white` : "bg-white text-black"}`}

                onMouseOver={() => {
                    let number;
                    let index = this.props.index + 1;

                    if(index > 7) {
                        let diff = index - 7;
                        number = diff;
                    } else {
                        number = index;
                    }

                    let obj = {
                        1 : "bg-red-400",
                        2 : "bg-orange-400",
                        3 : "bg-yellow-400",
                        4 : "bg-green-400",
                        5 : "bg-blue-400",
                        6 : "bg-indigo-400",
                        7 : "bg-violet-400",
                    }

                    let bg = obj[number];
                    this.setState({
                        bg
                    })
                }}
                onMouseLeave={() => {
                    this.setState({
                        bg : ""
                    })
                }}
            >
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-lg">{title}</h1>
                    <div className="flex gap-2 items-center">
                        <BsPencilSquare 
                            color="green"
                            cursor={"pointer"}
                            onClick={() => fetchTodo(id)}
                        />

                        <BsTrash 
                            color="red" 
                            cursor={"pointer"} 
                            onClick={() => deleteTodo(id)} 
                        />
                    </div>
                </div>
                <p className="text-sm">{task}</p>
                <p className="text-sm">Status : {status}</p>
                <small>created at : {createdAt}</small>
                { updatedDate && ( <small>updated at : {updatedDate}</small>)}
               
            </div>
        )
    }
}

export default Card;