import axios from "axios";
import { Component, createRef } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";

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
  }

  closeModel = () => {
    this.setState({ isUpdate : false })
  }

  // fetch all tasks list while component loaded
  fetchTodoList = async () => {
    try {
      await axios
        .get("http://localhost:3000/todos")
        .then((res) => {
          this.setState({ todos: res.data });
          // console.log(res)
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  // update task based on id
  updateTodo = async () => {
    let date = new Date();

    // save the task updated date while updating
    const updatedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    try {
      const response = await axios.patch(
        `http://localhost:3000/todos/${this.state.updateTodoId}`,
        {
          title: this.state.title,
          task: this.state.task,
          status: this.state.status,
          updatedDate,
        }
      );
      this.fetchTodoList();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        isUpdate: true,
        task: "",
        title: "",
      });
    }
  };

  // delete task based on id
  deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`);

      this.setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo?.id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // fetch task based on id
  fetchTodo = async (id) => {
    try {
      await axios
        .get(`http://localhost:3000/todos/${id}`)
        .then((res) => {
          this.setState({
            title: res?.data?.title,
            task: res?.data?.task,
            isUpdate: true,
            updateTodoId: res?.data?.id,
            status: res?.data?.status,
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
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
    const { searchQuery } = this.state;
    if (searchQuery !== "") {
      const filterResults = this.state.todos?.filter((todo) => {
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
    e.preventDefault();
    const { filterQuery, searchResults, todos } = this.state;

    let filterData = searchResults.length > 0 ? searchResults : todos;

    if (filterQuery === "All") {
      this.setState({
        filterValues: filterData,
      });
    } else {
      const filterResults = filterData?.filter((todo) => {
        return todo?.status === filterQuery;
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
    } = this.state;

    const data =
      filterValues.length > 0
        ? filterValues
        : searchResults.length > 0
        ? searchResults
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
              <input
                type="text"
                name="searchQuery"
                value={searchQuery}
                className="border-2 rounded-md  py-2 px-4 w-full"
                onChange={(e) => this.handleChange(e)}
                placeholder="Enter keyword you want search"
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
            <form onSubmit={this.getfilterValues}>
              <select
                name="filterQuery"
                value={filterQuery}
                onChange={this.handleChange}
                className="w-28 h-10 p-1 border-2 rounded-sm cursor-pointer"
              >
                <option value="All">All</option>
                <option value="To-do">To-do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                type="submit"
                className="border border-none bg-orange-500 w-24 h-11 rounded-sm font-bold text-white"
              >
                Filter
              </button>
            </form>

            {/* display todo's list */}
            <div className="grid grid-cols-2 gap-3">
              {data?.map((todo, index) => {
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
                  />
                );
              })}
            </div>
          </div>
        </div>

        {isUpdate && (
          <UpdateForm
            title={title}
            task={task}
            status={status}
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
