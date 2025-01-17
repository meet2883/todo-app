import { Component } from "react";

class TableView extends Component {
  constructor(props) {
    super(props);
  }

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
          </tr>
        </thead>

        <tbody>
          {this.props.data.map((todo) => (
            <tr key={todo.id}>
              <td className="border border-slate-600 p-2">{todo.title}</td>
              <td className="border border-slate-600 p-2">{todo.task}</td>
              <td className="border border-slate-600 p-2">{todo.status}</td>
              <td className="border border-slate-600 p-2">{todo.createdAt}</td>
              <td className="border border-slate-600 p-2">{todo.updatedDate === "" ? "-" : todo.updatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default TableView;
