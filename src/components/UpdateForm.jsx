import { Component, createRef } from "react";
import { BsXLg } from "react-icons/bs";
import { Input } from "./Input";

class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.modelRef = createRef();
  }

  componentDidMount = () => {
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
      isTitleEmpty,
      isTaskEmpty,
      tag,
      tags,
      addTag,
      removeTag
    } = this.props;
    return (
      <form
        className="fixed inset-0 bg-white drop-shadow-2xl ease-in-out rounded-sm bg-opacity-100 flex flex-col w-[450px] h-[530px] p-5 m-auto justify-center items-center gap-3"
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
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => handleChange(e)}
            isempty={isTitleEmpty}
            errmsg="please enter todo title"
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <span>Task</span>
          <Input
            type="text"
            name="task"
            value={task}
            className="border-2 rounded-md  py-2 px-4"
            onChange={(e) => handleChange(e)}
            isempty={isTaskEmpty}
            errmsg="please enter todo task"
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row w-full  gap-4">
            {/* <span>Add tag</span> */}
            <input
              type="text"
              name="tag"
              value={tag}
              className="border-2 rounded-md  w-[560px] py-2 px-4 "
              onChange={(e) => handleChange(e)}
              placeholder="Enter your tags here"
            />
            <button
              type="submit"
              className="border border-none bg-blue-800 w-32 h-11 rounded-sm font-bold text-white"
              onClick={addTag}
            >
              Add Tag
            </button>
          </div>

          <div className="flex gap-1 justify-start max-w-[200px]">
            {tags?.map((tag, index) => {
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
                  <BsXLg cursor={"pointer"} onClick={(e) => removeTag(e,index,tag)} />
                </div>
              );
            })}
          </div>
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
