import { Component } from "react";
import PropTypes from "prop-types";

export class Input extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount = () => {
  //   console.log(`Input component loaded >>>`);
  // };

  // componentDidUpdate = () => {
  //   console.log(`Input component updated >>>`);
  // };

  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps.value !== this.props.value;
  };

  render() {
    const { title, isempty, errmsg } = this.props;

    return (
      <div className="flex flex-col w-full gap-1">
        <span>{title}</span>
        <input {...this.props} />
        {Boolean(isempty) && <small className="text-red-600">{errmsg}</small>}
      </div>
    );
  }
}

Input.prototypes = {
  isempty: PropTypes.bool,
  title: PropTypes.string.isRequired,
  errmsg: PropTypes.string,
};
