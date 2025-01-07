import { BsTrash } from "react-icons/bs";

const Card = ({ title, task, id, deleteTodo }) => {
    return(
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-lg">{title}</h1>
                <BsTrash color="red" cursor={"pointer"} onClick={() => deleteTodo(id)} />
            </div>
            <p className="text-sm">{task}</p>
        </div>
    )
}

export default Card;