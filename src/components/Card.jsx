import { Component } from "react";
import { connect } from "react-redux";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteTodo, fetchTodo } from "../features/todoSlice";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bg: "",
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.todo !== this.props.todo && this.props.isUpdate){
      this.props.openModel();
    }
  }

  render() {
    const {
      title,
      task,
      id,
      createdAt,
      status,
      updatedDate,
      startColor,
      tags,
      handleclick,
    } = this.props;

    const obj = {
      1: "bg-red-400",
      2: "bg-orange-400",
      3: "bg-yellow-400",
      4: "bg-green-400",
      5: "bg-blue-400",
      6: "bg-indigo-400",
      7: "bg-violet-400",
    };

    return (
      <div
        className={`flex flex-col border-2 cursor-pointer border-white 
                    rounded-xl w-[400px] h-auto p-2 drop-shadow-lg ${
                      startColor && this.state.bg !== ""
                        ? `${this.state.bg} text-white`
                        : "bg-white text-black"
                    }`}
        onMouseOver={() => {
          // solution 2
          let number = Math.floor(Math.random() * (1, 7) + 1);
          let bg = obj[number];
          this.setState({
            bg,
          });
        }}
        onMouseLeave={() => {
          this.setState({
            bg: "",
          });
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg">{title}</h1>
          <div className="flex gap-2 items-center">
            <BsPencilSquare
              color="green"
              cursor={"pointer"}
              onClick={() => this.props.fetchTodo(id)}
            />

            <BsTrash
              color="red"
              cursor={"pointer"}
              onClick={() => this.props.deleteTodo(id)}
            />
          </div>
        </div>
        <p className="text-sm">{task}</p>
        <p
          className={`text-sm ${status === "To-do" && "text-red-600"} ${
            status === "In Progress" && "text-yellow-600"
          } ${
            status === "Completed" && "text-green-600"
          }`}
        >
          Status : {status}
        </p>


        <small>created at : {createdAt}</small>
        {updatedDate && <small>updated at : {updatedDate}</small>}
        <div className="flex gap-1 justify-start max-w-[200px]">
          {tags?.map((tag, index) => {
            let number = Math.floor(Math.random() * (1, 7) + 1);
            let bg = obj[number];
            return (
              <div
                key={index}
                className={`${bg} flex items-center gap-1 rounded-full px-6 py-2 text-white`}
                onClick={(e) => handleclick(e, tag)}
              >
                {tag}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isError, error, isLoading, todo, isUpdate } = state.todo;
  return { isError, error, isLoading, todo, isUpdate}
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTodo : (id) => dispatch(fetchTodo(id)),
    deleteTodo : (id) => dispatch(deleteTodo(id))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Card);
