import { Component } from "react";
import { BsTrash } from "react-icons/bs";


class Card extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-lg">{this.props.title}</h1>
                    <BsTrash color="red" cursor={"pointer"} onClick={() => this.props.deleteTodo(this.props.id)} />
                </div>
                <p className="text-sm">{this.props.task}</p>
            </>
        )
    }
}

export default Card;