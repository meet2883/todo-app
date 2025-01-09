import { Component, createRef } from "react";
import { BsXLg } from "react-icons/bs";

class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.modelRef = createRef();
  }

  componentDidMount = () => {
    document.addEventListener("click", (event) => {
      if (this.modelRef.current && !this.modelRef.current.contains(event.target)) {
        this.props.closeModel();
      }
    });
  };

  componentWillUnmount = () => {
    document.removeEventListener("click", (event) => {
      if (this.modelRef.current && !this.modelRef.current.contains(event.target)) {
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
    } = this.props;
    return (
      <form
        className="fixed inset-0 bg-white drop-shadow-xl rounded-sm bg-opacity-100 flex flex-col w-96 h-96 p-5 m-auto justify-center items-center gap-3"
        onSubmit={updateTodo}
        ref={this.modelRef}
      >
        <BsXLg
          cursor="pointer"
          className="relative left-44"
          onClick={closeModel}
        />
        <div className="flex flex-col w-full gap-1">
          <span>Title</span>
          <input
            type="text"
            name="title"
            id=""
            value={title}
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <span>Task</span>
          <textarea
            type="text"
            name="task"
            value={task}
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <span>Status</span>
          <select
            name="status"
            value={status}
            id=""
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => handleChange(e)}
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

export default UpdateForm;
