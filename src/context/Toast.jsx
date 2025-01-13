import { Component, createContext } from "react";

const ToastContext = createContext();

export class ToastProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowToast: false,
    };
    this.showToast = this.showToast.bind(this);
    this.closeToast = this.closeToast.bind(this);
  }

  showToast = () => {
    this.setState({ isShowToast: true });
  };

  closeToast = () => {
    this.setState({ isShowToast: false });
  };

  render() {
    const { isShowToast } = this.state;
    const { children } = this.props;
    return (
      <ToastContext.Provider
        value={{ 
            state : isShowToast,
            handleShowToast : this.showToast,
            handleCloseToast : this.closeToast  
         }}
      >
        {children}
      </ToastContext.Provider>
    );
  }
}

export const ToastConsumer = ToastContext.Consumer;
