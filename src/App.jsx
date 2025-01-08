import { Component } from "react";
import axios from "axios";
import DisplayTodo from "./components/DisplayTodo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";


class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <BrowserRouter>
        <Routes >
          <Route 
            path="/"
            element={<Home />} 
          />

          <Route 
            path="/list"
            element={<List />}
          />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;