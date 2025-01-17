import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeReq } from "../Utils/makeReq";
import axios from "axios";

let url = `http://localhost:3000`;
export const addTodo = createAsyncThunk(
  "todo/addTodo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/todos`, data);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodos = createAsyncThunk(
  "todo/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/todos`);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (data, { rejectWithValue }) => {
    try {
      // console.log(data)
      const response = await axios.patch(
        `${url}/todos/${data.updateId}`,
        data.obj
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      console.log(id)
      const response = await axios.delete(`${url}/todos/${id}`);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodo = createAsyncThunk(
  "todo/fetchTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/todos/${id}`);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const todo = {
  title: "",
  task: "",
  status: "",
  tags: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    isLoading: false,
    error: "",
    isError: false,
    todos: [],
    updateId: "",
    isUpdate : false,
    todo
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.isError = false;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = [...state.todos, action.payload];
      })
      .addCase(addTodo.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = [...state.todos, action.payload];
        state.todo = todo
        state.isUpdate = false;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.isLoading = false;
        state.todos = state.todos.filter(
          (todo) => todo.id !== action.payload.id
        );
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchTodo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
        state.todo.title = "";
        state.todo.task = "";
        state.todo.tags = [];
        state.todo.status = "";
        state.isUpdate = false;
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        let { title, task, status, tags, id } = action.payload;
        state.todo.title = title;
        state.todo.task = task;
        state.todo.tags = tags;
        state.todo.status = status;
        state.updateId = id;
        state.isUpdate = true;
      })
      .addCase(fetchTodo.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export default todoSlice.reducer;
