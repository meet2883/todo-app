import { Component } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/Input";
import { makeReq } from "../Utils/makeReq";
import { ToastConsumer } from "../context/Toast";
import { toast } from "react-toastify";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      task: "",
      tag: "",
      tags: [],
      isTitleEmpty: false,
      isTaskEmpty: false,
      status: "To-do",
      isLoading: false,
      isError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    this.handleCheckFieldValue = this.handleCheckFieldValue.bind(this);
  }

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

  handleChange = (e) => {
    this.handleCheckFieldValue(e)
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, task } = this.state;
    let isTitleEmpty = false;
    let isTaskEmpty = false;

    if (title === "") {
      isTitleEmpty = true;
    }

    if (task === "") {
      isTaskEmpty = true;
    }

    this.setState({
      isTitleEmpty,
      isTaskEmpty,
    });

    if (isTitleEmpty == false && isTaskEmpty == false) {
      this.createTodo();
    } else {
      let sentence = "";

      if (isTitleEmpty) {
        sentence = "Please add your todo title";
      }

      if (isTaskEmpty) {
        sentence = "Please add your todo task";
      }

      if (isTitleEmpty && isTaskEmpty) {
        sentence = "Please add your todo title and task";
      }

      console.log(sentence);
      // let utterance = new SpeechSynthesisUtterance(sentence);
      // speechSynthesis.speak(utterance);
      console.log(`${sentence}`);
      toast.info(`${sentence}`, { autoClose: 2000 });
      return;
    }
  };

  createTodo = async () => {
    const { title, task, status, tags } = this.state;
    const date = new Date();

    const createdAt = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    let data = { title, task, createdAt, status, tags };

    makeReq({ method: "POST", endpoint: "todos", data })
      .then(() => {
        this.setState((prevState) => ({
          title: "",
          task: "",
          tags: [],
        }));
        toast.success("To-do Created", { autoClose: 2000 });
      })
      .catch(() => {
        this.setState({ isError: true });
        toast.error("Failed to create To-do", { autoClose: 2000 });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  addTag = (e) => {
    e.preventDefault();
    if (this.state.tag !== "") {
      this.state.tags.push(this.state.tag);
      this.setState((prevState) => ({ tag: "" }));
    }
  };

  removeTag = (i, todoTag) => {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((tag, index) => tag !== todoTag),
    }));
  };

  handleKeyboardShortcuts = (e) => {
    let focusedEvent = document.activeElement;

    if (
      focusedEvent.tagName === "INPUT" ||
      focusedEvent.tagName === "TEXTAREA"
    ) {
      return;
    }

    e.preventDefault();
    if (e.ctrlKey && e.key === "l") {
      window.location.replace("http://localhost:5173/list");
    }
  };

  componentDidMount = () => {
    // let utterance = new SpeechSynthesisUtterance(`to keise he app log`);
    // utterance.lang = "hi-IN"
    // speechSynthesis.speak(utterance)
    document.addEventListener("keydown", this.handleKeyboardShortcuts);

    // console.log(data);
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyboardShortcuts);
  }

  render() {
    const {
      task,
      title,
      isTaskEmpty,
      isTitleEmpty,
      status,
      isError,
      tags,
      tag,
    } = this.state;
    return (
      <ToastConsumer>
        {(context) => (
          <div className="flex flex-col gap-6 max-w-screen-sm mx-auto py-5">
            <Link to={"/list"} className="underline-offset-4">
              Lists
            </Link>
            <h1 className="text-2xl font-bold text-center">
              Add your tasks here
            </h1>

            {/* todo input part */}
            <form
              onSubmit={this.handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <Input
                title="Title"
                type="text"
                name="title"
                id="title"
                value={title}
                className={`${
                  isTitleEmpty && "border-red-700"
                } border-2 rounded-md  py-2 px-4`}
                onChange={(e) => this.handleChange(e)}
                onBlur={this.handleCheckFieldValue}
                isempty={this.state.isTitleEmpty ? 1 : 0}
                errmsg="please add the title"
              />

              <Input
                title="Task"
                type="text"
                name="task"
                id="task"
                value={task}
                className={`${
                  isTitleEmpty && "border-red-700"
                } border-2 rounded-md  py-2 px-4`}
                onChange={(e) => this.handleChange(e)}
                onBlur={this.handleCheckFieldValue}
                isempty={this.state.isTaskEmpty ? 1 : 0}
                errmsg="please add the task"
              />

              <div className="w-full">
                <div className="flex flex-row w-full  gap-4">
                  {/* <span>Add tag</span> */}
                  <input
                    type="text"
                    name="tag"
                    value={tag}
                    className="border-2 rounded-md  w-[560px] py-2 px-4 "
                    onChange={this.handleChange}
                    placeholder="Enter your tags here"
                    isempty={0}
                  />
                  <button
                    type="submit"
                    className="border border-none bg-blue-800 w-24 h-11 rounded-sm font-bold text-white"
                    onClick={this.addTag}
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex gap-1 justify-start max-w-[200px]">
                  {tags.length > 0 &&
                    tags?.map((tag, index) => {
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
                          {/* <BsXLg className="cursor-pointer" onClick={() => this.removeTag(tag, index)} />{" "} */}
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
                {this.state.isLoading ? "Submitting..." : "Add"}
              </button>
            </form>

            {isError && (
              <small className="text-red-600">
                Error while submitting the data
              </small>
            )}
          </div>
        )}
      </ToastConsumer>
    );
  }
}

export default Home;
