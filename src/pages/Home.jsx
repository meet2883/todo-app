import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/Input";
import { makeReq } from "../Utils/makeReq";
// import { Validation } from "../Utils/Validation";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      task: "",
      isTitleEmpty: false,
      isTaskEmpty: false,
      status: "To-do",
      isLoading: false,
      isError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
  }

  handleChange = (e) => {
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
      console.log(
        `pleaes fill the all the fields. ${isTitleEmpty} ${isTaskEmpty}`
      );
      return;
    }
  };

  createTodo = async () => {
    const { title, task, status } = this.state;
    const date = new Date();

    const createdAt = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    let data = { title, task, createdAt, status };

    makeReq({ method: "POST", data })
      .then(() => {
        this.setState((prevState) => ({
          title: "",
          task: "",
        }));
      })
      .catch(() => this.setState({ isError: true }))
      .finally(() => {
        this.setState({ isLoading: false });
      });
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
    const { task, title, isTaskEmpty, isTitleEmpty, status, isError } =
      this.state;
    return (
      <div className="flex flex-col gap-6 max-w-screen-sm mx-auto py-5">
        <Link to={"/list"} className="underline-offset-4">
          Lists
        </Link>
        <h1 className="text-2xl font-bold text-center">Add your tasks here</h1>

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
            isempty={this.state.isTitleEmpty}
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
            isempty={this.state.isTaskEmpty}
            errmsg="please add the task"
          />

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
    );
  }
}

export default Home;
