import { Component } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";

class Card extends Component{
    constructor(props){
        super(props);
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
                className="flex flex-col border-2 border-white bg-white rounded-xl w-80 h-32 p-2 drop-shadow-lg"
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