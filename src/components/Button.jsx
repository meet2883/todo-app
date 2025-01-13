import { Component } from "react";

class Button extends Component {
    render(){
        const { text } = this.props;
        return(
            <button {...this.props}>{text}</button>
        )
    }
}

export default Button;