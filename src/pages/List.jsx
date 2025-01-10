import axios from "axios";
import { Component, createRef } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";
import { Input } from "../components/Input";
import { makeReq } from "../Utils/makeReq";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      isUpdate: false,
      updateId: "",
      searchResults: [],
      searchQuery: "",
      title: "",
      task: "",
      status: "",
      filterValues: [],
      filterQuery: "",
      startColor: false,
      isTaskEmpty: false,
      isTitleEmpty: false,
    };
    this.fetchTodoList = this.fetchTodoList.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.fetchTodo = this.fetchTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.searchTodos = this.searchTodos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    this.getfilterValues = this.getfilterValues.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.handleColor = this.handleColor.bind(this);
  }

  closeModel = () => {
    this.setState({ isUpdate: false });
  };

  // fetch all tasks list while component loaded
  fetchTodoList = () => {
    makeReq({ method: "GET" })
      .then((res) => {
        this.setState({ todos: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // update task based on id
  updateTodo = async (e) => {
    e.preventDefault();

    const { title, task, updateId } = this.state;
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

      let data = {
        title: this.state.title,
        task: this.state.task,
        status: this.state.status,
        updatedDate,
      };

      makeReq({ method: "PATCH", endpoint: updateId, data })
        .then(() => {
          this.fetchTodoList();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({
            isUpdate: false,
            task: "",
            title: "",
          });
        });
    }
  };

  // delete task based on id
  deleteTodo = async (id) => {
    makeReq({ method: "DELETE", endpoint: id })
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo?.id !== id)
    }));
  };

  // fetch task based on id
  fetchTodo = async (id) => {
    makeReq({ method: "GET", endpoint: id })
      .then((res) => {
        this.setState({
          title: res?.data?.title,
          task: res?.data?.task,
          isUpdate: true,
          updateId: res?.data?.id,
          status: res?.data?.status,
        });
      })
      .catch((err) => console.log(err));
  };

  // set values while element change
  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  // search tasks based on input string
  searchTodos = (e) => {
    e.preventDefault();
    const { searchQuery, todos, filterValues } = this.state;

    let data = filterValues.length > 0 ? filterValues : todos;

    if (searchQuery !== "") {
      const filterResults = data?.filter((todo) => {
        const { title, task, createdAt, updatedDate } = todo;
        return (
          title?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          task?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          createdAt
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          updatedDate
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });

      this.setState({
        searchResults: filterResults,
      });
    }
  };

  //   filter tasks based on status
  getfilterValues = (e) => {
    // e.preventDefault();
    let query = e.target.value;
    this.setState({ filterQuery: query });
    const { searchResults, todos } = this.state;

    let filterData = searchResults.length > 0 ? searchResults : todos;

    if (query === "All") {
      this.setState({
        filterValues: [],
      });
    } else {
      const filterResults = filterData?.filter((todo) => {
        return todo?.status === query;
      });

      this.setState({
        filterValues: filterResults,
      });
    }
  };

  //   cancel search
  cancelSearch = (e) => {
    e.preventDefault();
    this.setState({
      searchQuery: "",
      searchResults: [],
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
    if (e.ctrlKey && e.key === "b") {
      window.location.replace("http://localhost:5173/");
    }
  };

  changeIsUpdate = () => {
    this.setState({
      isUpdate: false,
    });
  };

  handleColor = () => {
    this.setState({ startColor: !this.state.startColor });
  };

  componentDidMount = () => {
    this.fetchTodoList();
    document.addEventListener("keypress", this.handleKeyboardShortcuts);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keypress", this.handleKeyboardShortcuts);
  };

  render() {
    // state destructuring
    const {
      todos,
      searchResults,
      searchQuery,
      isUpdate,
      task,
      title,
      status,
      filterQuery,
      filterValues,
      isTaskEmpty,
      isTitleEmpty,
    } = this.state;

    const data =
      searchResults.length > 0
        ? searchResults
        : filterValues.length > 0
        ? filterValues
        : todos;

    return (
      <div>
        <div className={`${isUpdate ? "opacity-20" : "opacity-100"}`}>
          <Link to={"/"} className="underline-offset-4">
            Home
          </Link>

          {/* form for the search the values */}
          <div className="flex flex-col gap-4 items-center py-5">
            <h1 className="font-bold text-3xl">Tasks List</h1>
            <form
              onSubmit={this.searchTodos}
              onReset={this.cancelSearch}
              className="flex items-center gap-2 w-[650px]"
            >
              <Input
                type="text"
                name="searchQuery"
                value={searchQuery}
                className="border-2 rounded-md  py-2 px-4 w-full"
                onChange={(e) => this.handleChange(e)}
                placeholder="Enter keyword you want search"
                isempty={false}
              />

              <button
                type="submit"
                className="border border-none bg-blue-800 w-24 h-11 rounded-sm font-bold text-white"
              >
                Search
              </button>

              <button
                type="reset"
                className="border border-none bg-red-800 w-24 h-11 rounded-sm font-bold text-white"
              >
                Cancel
              </button>
            </form>

            {/* form for filter the value */}

            <form className="flex gap-5 items-center font-bold">
              <div className="flex gap-1 items-center">
                <span>Status :</span>
                <select
                  name="filterQuery"
                  value={filterQuery}
                  onChange={(e) => {
                    this.getfilterValues(e);
                  }}
                  className="w-28 h-10 p-1 border-2 rounded-sm cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="To-do">To-do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span>color</span>
                <Input
                  type="checkbox"
                  checked={this.state.startColor}
                  onClick={this.handleColor}
                  name="startColor"
                  id="startColor"
                  isempty={false}
                  errmsg=""
                />
              </div>
            </form>

            {/* display todo's list */}
            <div className="grid grid-cols-2 gap-3">
              {data.length === 0 ? (
                <h1>No record found</h1>
              ) : (
                data?.map((todo, index) => {
                  const { id, task, title, createdAt, status, updatedDate } =
                    todo;

                  return (
                    <Card
                      index={index}
                      key={id}
                      id={id}
                      task={task}
                      title={title}
                      fetchTodo={this.fetchTodo}
                      deleteTodo={this.deleteTodo}
                      createdAt={createdAt}
                      status={status}
                      updatedDate={updatedDate}
                      startColor={this.state.startColor}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {isUpdate && (
          <UpdateForm
            title={title}
            task={task}
            status={status}
            isTitleEmpty={isTitleEmpty}
            isTaskEmpty={isTaskEmpty}
            updateTodo={this.updateTodo}
            closeModel={this.closeModel}
            handleChange={this.handleChange}
            changeIsUpdate={this.changeIsUpdate}
          />
        )}
      </div>
    );
  }
}

export default List;