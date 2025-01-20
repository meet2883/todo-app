import { Component } from "react";
import { connect } from "react-redux";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteTodo, fetchTodo } from "../features/todoSlice";
import Pagination from "./Pagination";

class TableView extends Component {
  constructor(props) {
    super(props);
    let dataLength = this.props.data.length;
    this.state = {
      totalPages: 1,
      recPerpage: this.props.data.length,
      pageNo: 1,
      startIndex: 0,
      endIndex: this.props.data.length,
      data: [],
    };
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.handleRecPerPage = this.handleRecPerPage.bind(this);
  }

  handleRecPerPage = (e) => {
    e.preventDefault();
    let recPerpage = parseInt(e.target.value);
    let totalPages = Math.ceil(this.props.data.length / recPerpage);
    let startIndex = 0;
    let pageNo = 1;
    let endIndex = recPerpage;
    this.setState((prevState) => ({
      recPerpage,
      totalPages,
      startIndex,
      endIndex,
      pageNo
    }));
  };

  nextPage = () => {
    if (this.state.pageNo !== this.state.totalPages) {
      this.setState((prevState) => ({
        pageNo: this.state.pageNo + 1,
        startIndex: this.state.endIndex,
        endIndex: this.state.endIndex + this.state.recPerpage,
      }));
    }
  };

  prevPage = () => {
    if (this.state.pageNo !== 1) {
      this.setState((prevState) => ({
        pageNo: this.state.pageNo - 1,
        startIndex: this.state.startIndex - this.state.recPerpage,
        endIndex: this.state.endIndex - this.state.recPerpage,
      }));
    }
  };

  componentDidMount = () => {
    this.setState({ data: this.props.data });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.todo !== this.props.todo && this.props.isUpdate) {
      this.props.openModel();
    }

    // if(prevState.pageNo !== this.state.pageNo || prevState.recPerpage !== this.state.recPerpage){
    //   // this.setState((prevState) => ({
    //   //   data : this.props.data.slice(this.state.startIndex, this.state.endIndex)
    //   // }))
    // }
  };

  render() {
    const { data } = this.props;
    let records = data.slice(this.state.startIndex, this.state.endIndex);
    console.log(records);
    return (
      <div>
        <table className="border-separate border-spacing-0 border-slate-500 table-auto">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="border border-slate-600 p-3">Title</th>
              <th className="border border-slate-600 p-3">Task</th>
              <th className="border border-slate-600 p-3">Status</th>
              <th className="border border-slate-600 p-3">Created At</th>
              <th className="border border-slate-600 p-3">Updated At</th>
              <th className="border border-slate-600 p-3">Update</th>
              <th className="border border-slate-600 p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {records.map((todo) => (
              <tr key={todo.id}>
                <td className="border border-slate-600 p-2">{todo.title}</td>
                <td className="border border-slate-600 p-2">{todo.task}</td>
                <td className="border border-slate-600 p-2">{todo.status}</td>
                <td className="border border-slate-600 p-2">
                  {todo.createdAt}
                </td>
                <td className="border border-slate-600 p-2">
                  {todo.updatedDate === "" ? "-" : todo.updatedDate}
                </td>
                <td className="border border-slate-600 p-2">
                  {" "}
                  <BsPencilSquare
                    color="green"
                    cursor={"pointer"}
                    onClick={() => this.props.fetchTodo(todo.id)}
                  />
                </td>
                <td className="border border-slate-600 p-2">
                  <BsTrash
                    color="red"
                    cursor={"pointer"}
                    onClick={() => this.props.deleteTodo(todo.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          dataLength={this.props.data.length}
          prevPage={this.prevPage}
          nextPage={this.nextPage}
          pageNo={this.state.pageNo}
          endIndex={this.state.endIndex}
          recPerpage={this.state.recPerpage}
          totalPages={this.state.totalPages}
          startIndex={this.state.startIndex}
          handleRecPerPage={this.handleRecPerPage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isError, error, isLoading, todo, isUpdate } = state.todo;
  return { isError, error, isLoading, todo, isUpdate };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTodo: (id) => dispatch(fetchTodo(id)),
    deleteTodo: (id) => dispatch(deleteTodo(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableView);
