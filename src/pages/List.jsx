import { toast } from "react-toastify";
import { Component } from "react";
import { Link } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";
import { Input } from "../components/Input";
import { connect } from "react-redux";
import { fetchTodo, fetchTodos } from "../features/todoSlice";
import TableView from "../components/TableView";
import ListView from "../components/ListView";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "list",
      todos: [],
      isOpenModel: false,
      updateId: "",
      searchResults: [],
      searchQuery: "",
      title: "",
      task: "",
      tag: "",
      tags: [],
      status: "",
      isTagFilter: false,
      tagQuery: "",
      filterValues: [],
      filterQuery: "",
      startColor: false,
      isTaskEmpty: false,
      isTitleEmpty: false,
      isNoData: false,
    };
    this.searchTodos = this.searchTodos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    this.getfilterValues = this.getfilterValues.bind(this);
    this.openModel = this.openModel.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.setFilterTagQuery = this.setFilterTagQuery.bind(this);
  }

  openModel = () => {
    this.setState({ isOpenModel: true });
  };

  closeModel = () => {
    this.setState({ isOpenModel: false });
  };

  // set values while element change
  handleChange = (e) => {
    e.preventDefault();
    // this.handleCheckFieldValue(e);
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  setFilterTagQuery = (e, query) => {
    e.preventDefault();
    let searchQuery = query;
    this.setState({ searchQuery });
    this.searchTodos(e);
  };

  // search tasks based on input string
  searchTodos = () => {
    const { searchQuery, todos, filterValues } = this.state;

    let data = filterValues.length > 0 ? filterValues : this.props.todos;

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
            .includes(searchQuery.toLowerCase()) ||
          tags?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

      if (filterResults.length > 0) {
        this.setState({
          searchResults: filterResults,
          isNoData: false,
        });
      } else {
        this.setState({
          searchResults: [],
          isNoData: true,
        });
      }
    }
  };

  //   filter tasks based on status
  getfilterValues = () => {
    const { searchResults, filterQuery } = this.state;

    let filterData =
      searchResults.length > 0 ? searchResults : this.props.todos;

    if (filterQuery === "All") {
      this.setState({
        filterValues: [],
      });
    } else {
      const filterResults = filterData?.filter((todo) => {
        return todo?.status === filterQuery;
      });

      if (filterResults.length > 0) {
        this.setState({
          filterValues: filterResults,
          isNoData: false,
        });
      } else {
        this.setState({
          filterValues: [],
          isNoData: true,
        });
      }
    }
  };

  //   cancel search
  cancelSearch = (e) => {
    e.preventDefault();
    this.setState({
      searchQuery: "",
      searchResults: [],
      isNoData: false,
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

  handleColor = () => {
    this.setState({ startColor: !this.state.startColor });
  };

  componentDidMount = (prevProps, prevState) => {
    this.props.fetchTodos();
    document.addEventListener("keypress", this.handleKeyboardShortcuts);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.isUpdate !== this.props.isUpdate) {
      this.props.fetchTodos();
    }
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.searchTodos();
    }

    if (prevState.filterQuery !== this.state.filterQuery) {
      this.getfilterValues();
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keypress", this.handleKeyboardShortcuts);
  };

  render() {
    // state destructuring
    const { searchResults, searchQuery, filterQuery, filterValues, isNoData } =
      this.state;

    const data =
      searchResults.length > 0
        ? searchResults
        : filterValues.length > 0
        ? filterValues
        : this.props.todos;

    return (
      <div>
        <div
          className={`${this.state.isOpenModel ? "opacity-20" : "opacity-100"}`}
        >
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
                type="reset"
                className="border border-none bg-red-800 w-24 h-11 rounded-sm font-bold text-white"
              >
                Cancel
              </button>
            </form>

            <div className="flex gap-3 items-center">
              <span>Select your list view :</span>
              <select
                name="view"
                value={this.state.view}
                className="w-28 h-10 p-1 border-2 rounded-sm cursor-pointer"
                onChange={(e) => {
                  this.setState((prevState) => ({
                    view: e.target.value,
                  }));
                }}
              >
                <option value="list">List</option>
                <option value="table">Table</option>
              </select>
            </div>

            {/* form for filter the value */}
            <form className="flex gap-5 items-center font-bold">
              <div className="flex gap-1 items-center">
                <span>Status :</span>
                <select
                  name="filterQuery"
                  value={filterQuery}
                  onChange={(e) => {
                    this.setState({ filterQuery: e.target.value });
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
            {data.length === 0 || isNoData ? (
              <h1>No Record Found</h1>
            ) : this.state.view === "list" ? (
              <ListView
                data={data}
                openModel={this.openModel}
                startColor={this.state.startColor}
                handleclick={this.setFilterTagQuery}
              />
            ) : (
              <TableView data={data} openModel={this.openModel} />
            )}
          </div>
        </div>

        {this.state.isOpenModel && <UpdateForm closeModel={this.closeModel} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log(state)
  const { isError, error, isLoading, todos, isUpdate } = state.todo;
  return { isError, error, isLoading, todos, isUpdate };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
    fetchTodo: (id) => dispatch(fetchTodo(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
