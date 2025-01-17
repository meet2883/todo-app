import { Component, createRef } from "react";
import { BsXLg } from "react-icons/bs";
import { Input } from "./Input";
import { connect } from "react-redux";
import { updateTodo } from "../features/todoSlice";

class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.modelRef = createRef();
    this.state = {
      title: "",
      task: "",
      tags: [],
      tag: "",
      status: "",
      isTitleEmpty: false,
      isTaskEmpty: false,
    };
    this.addTag = this.addTag.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckFieldValue = this.handleCheckFieldValue.bind(this);
  }

  updateTodo = async (e) => {
    e.preventDefault();

    const { title, task, updateId, tags } = this.state;
    let isTitleEmpty = false;
    let isTaskEmpty = false;

    if (title === "") isTitleEmpty = true;
    if (task === "") isTaskEmpty = true;

    this.setState({ isTaskEmpty, isTitleEmpty });

    if (isTaskEmpty == false && isTitleEmpty == false) {
      let date = new Date();

      // save the task updated date while updating
      const updatedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;

      let obj = {
        title: this.state.title,
        task: this.state.task,
        status: this.state.status,
        updatedDate,
        tags,
      };
      console.log(this.props)
      let updateId = this.props.updateId;
      let data = { updateId, obj} 
      this.props.updateTodo(data);
      this.props.closeModel();
    }
  };

  addTag = (e) => {
    e.preventDefault();
    if (this.state.tag !== "") {
      // this.state.tags.push(this.state.tag);
      this.setState((prevState) => ({
        tags: [...this.state.tags, this.state.tag],
      }));
      this.setState((prevState) => ({ tag: "" }));
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    this.handleCheckFieldValue(e);
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleCheckFieldValue = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value === "") {
      this.setState({ isTitleEmpty: true });
    } else if (name === "title" && value !== "") {
      this.setState({ isTitleEmpty: false });
    }

    if (name === "task" && value === "") {
      this.setState({ isTaskEmpty: true });
    } else if (name === "task" && value !== "") {
      this.setState({ isTaskEmpty: false });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.todo !== this.props.todo){
      this.props.fetchTodos();
    }
  }

  componentDidMount = () => {
    console.log("update todo >>>>", this.props.todo);
    this.setState((prevState) => ({
      title: this.props.todo.title,
      task: this.props.todo.task,
      status: this.props.todo.status,
      tags: this.props.todo.tags,
    }));

    document.addEventListener("click", (event) => {
      if (
        this.modelRef.current &&
        !this.modelRef.current.contains(event.target)
      ) {
        this.props.closeModel();
      }
    });
  };

  componentWillUnmount = () => {
    document.removeEventListener("click", (event) => {
      if (
        this.modelRef.current &&
        !this.modelRef.current.contains(event.target)
      ) {
        this.props.closeModel();
      }
    });
  };

  render() {
    const {
      updateTodo,
      changeIsUpdate,
      handleChange,
      title,
      task,
      status,
      closeModel,
      removeTag,
    } = this.props;
    return (
      <form
        className="fixed inset-0 bg-white drop-shadow-2xl ease-in-out rounded-sm bg-opacity-100 flex flex-col w-[450px] h-[530px] p-5 m-auto justify-center items-center gap-3"
        onSubmit={this.updateTodo}
        ref={this.modelRef}
      >
        <BsXLg
          cursor="pointer"
          className="relative left-44"
          onClick={closeModel}
        />
        <div className="flex flex-col w-full gap-1">
          <span>Title</span>
          <Input
            type="text"
            name="title"
            id="title"
            value={this.state.title}
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => this.handleChange(e)}
            isempty={this.state.isTitleEmpty ? 1 : 0}
            errmsg="please enter todo title"
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <span>Task</span>
          <Input
            type="text"
            name="task"
            value={this.state.task}
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => this.handleChange(e)}
            isempty={this.state.isTaskEmpty ? 1 : 0}
            errmsg="please enter todo task"
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row w-full  gap-4">
            {/* <span>Add tag</span> */}
            <input
              type="text"
              name="tag"
              value={this.state.tag}
              className="border-2 rounded-md  w-[560px] py-2 px-4 "
              onChange={(e) => this.handleChange(e)}
              placeholder="Enter your tags here"
              isempty={0}
            />
            <button
              type="submit"
              className="border border-none bg-blue-800 w-32 h-11 rounded-sm font-bold text-white"
              onClick={this.addTag}
            >
              Add Tag
            </button>
          </div>

          <div className="flex gap-1 justify-start max-w-[200px]">
            {this.state.tags.map((tag, index) => {
              let obj = {
                1: "bg-red-400",
                2: "bg-orange-400",
                3: "bg-yellow-400",
                4: "bg-green-400",
                5: "bg-blue-400",
                6: "bg-indigo-400",
                7: "bg-violet-400",
              };

              let number = Math.floor(Math.random() * (1, 7) + 1);
              let bg = obj[number];
              return (
                <div
                  key={index}
                  className={`${bg} flex items-center gap-1 rounded-full px-6 py-2 text-white`}
                >
                  {tag}
                  <BsXLg
                    cursor={"pointer"}
                    onClick={(e) => removeTag(e, index, tag)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col w-full gap-1">
          <span>Status</span>
          <select
            name="status"
            value={this.state.status}
            id=""
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => this.handleChange(e)}
          >
            <option value="To-do">To-do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="border border-none bg-blue-800 w-24 h-11 rounded-sm font-bold text-white"
        >
          update
        </button>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isError, error, isLoading, todo, updateId } = state.todo;
  return { isError, error, isLoading, todo, updateId };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
    updateTodo: (data) => dispatch(updateTodo(data)),
    // fetchTodo : (id) => dispatch(fetchTodo(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateForm);
