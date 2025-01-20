import { Component } from "react";
import Card from "./Card";

class ListView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.data?.map((todo, index) => (
      <Card
        key={todo.id}
        id={todo.id}
        index={index}
        task={todo.task}
        tags={todo.tags}
        title={todo.title}
        status={todo.status}
        createdAt={todo.createdAt}
        updatedDate={todo.updatedDate}
        openModel={this.props.openModel}
        startColor={this.props.startColor}
        handleclick={this.props.handleclick}
      />
    ));
  }
}

export default ListView;
