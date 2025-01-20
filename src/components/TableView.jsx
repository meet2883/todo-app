import { Component } from "react";
import { connect } from "react-redux";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteTodo, fetchTodo } from "../features/todoSlice";

class TableView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.todo !== this.props.todo && this.props.isUpdate) {
      this.props.openModel();
    }
  };

  render() {
    return (
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
          {this.props.data.map((todo) => (
            <tr key={todo.id}>
              <td className="border border-slate-600 p-2">{todo.title}</td>
              <td className="border border-slate-600 p-2">{todo.task}</td>
              <td className="border border-slate-600 p-2">{todo.status}</td>
              <td className="border border-slate-600 p-2">{todo.createdAt}</td>
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
