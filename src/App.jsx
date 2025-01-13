import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";
import { ToastProvider } from "./context/Toast";
import { ToastContainer } from "react-toastify";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </ToastProvider>
    );
  }
}

export default App;
