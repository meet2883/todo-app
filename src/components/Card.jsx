import { Component } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";

class Card extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const { deleteTodo, fetchTodo, title, task, id } = this.props;
        return(
            <div
                className="border-2 border-white bg-white rounded-xl w-80 h-32 p-2 drop-shadow-lg"
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
            </div>
        )
    }
}

export default Card;