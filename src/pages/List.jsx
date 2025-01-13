import { toast } from "react-toastify";
import { Component } from "react";
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
      tag: "",
      tags: [],
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
    this.addTag = this.addTag.bind(this);
    this.handleCheckFieldValue = this.handleCheckFieldValue.bind(this);
  }

  closeModel = () => {
    this.setState({ isUpdate: false });
  };

  // fetch all tasks list while component loaded
  fetchTodoList = () => {
    makeReq({ method: "GET", endpoint: "todos" })
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

      let data = {
        title: this.state.title,
        task: this.state.task,
        status: this.state.status,
        updatedDate,
        tags,
      };

      makeReq({ method: "PATCH", endpoint: `todos/${updateId}`, data })
        .then(() => {
          this.fetchTodoList();
          toast.success("To-do updated.", { autoClose: 2000 });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update To-do.", { autoClose: 2000 });
        })
        .finally(() => {
          this.setState({
            isUpdate: false,
            task: "",
            title: "",
            tag: "",
            tags: [],
          });
        });
    }
  };

  // delete task based on id
  deleteTodo = async (id) => {
    makeReq({ method: "DELETE", endpoint: `todos/${id}` })
      .then(() => {
        this.setState((prevState) => ({
          todos: prevState.todos.filter((todo) => todo?.id !== id),
        }));
        toast.info("To-do deleted.", { autoClose: 2000 });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete To-do.", { autoClose: 2000 });
      });
  };

  // fetch task based on id
  fetchTodo = async (id) => {
    makeReq({ method: "GET", endpoint: `todos/${id}` })
      .then((res) => {
        this.setState({
          title: res?.data?.title,
          task: res?.data?.task,
          isUpdate: true,
          updateId: res?.data?.id,
          status: res?.data?.status,
          tags: res?.data?.tags,
        });
      })
      .catch((err) => console.log(err));
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

  // set values while element change
  handleChange = (e) => {
    e.preventDefault();
    this.handleCheckFieldValue(e);
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  addTag = (e) => {
    e.preventDefault();
    if (this.state.tag !== "") {
      this.state.tags.push(this.state.tag);
      this.setState((prevState) => ({ tag: "" }));
    }
  };

  removeTag = (e, i, str) => {
    e.preventDefault();
    let tags = this.state.tags.filter(
      (tag, index) => tag !== str && index !== i
    );
    this.setState((prevState) => ({
      tags,
    }));
  };

  // search tasks based on input string
  searchTodos = (e) => {
    e.preventDefault();
    const { searchQuery, todos, filterValues } = this.state;

    let data = filterValues.length > 0 ? filterValues : todos;

    if (searchQuery !== "") {
      const filterResults = data?.filter((todo) => {
        const { title, task, createdAt, updatedDate, tags } = todo;
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
      tags,
      tag,
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
                isempty={0}
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
                  onChange={this.handleColor}
                  name="startColor"
                  id="startColor"
                  isempty={0}
                  errmsg=""
                />
              </div>
            </form>

            {/* display todo's list */}
            <div className="grid grid-cols-1 gap-3">
              {data.length === 0 ? (
                <h1>No record found</h1>
              ) : (
                data?.map((todo, index) => {
                  const {
                    id,
                    task,
                    title,
                    createdAt,
                    status,
                    updatedDate,
                    tags,
                  } = todo;

                  return (
                    <Card
                      index={index}
                      key={id}
                      id={id}
                      task={task}
                      title={title}
                      tags={tags}
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
            tags={tags}
            tag={tag}
            isTitleEmpty={isTitleEmpty}
            isTaskEmpty={isTaskEmpty}
            removeTag={this.removeTag}
            addTag={this.addTag}
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
