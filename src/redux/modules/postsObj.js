// src/redux/modules/counter.js
import {createSlice} from "@reduxjs/toolkit";

// Initial State
const initialState = {
  posts: [],
};

// Reducer
const postsObj = createSlice({
  name: "counter",
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

// export default reducer
export const postActions = postsObj.actions;
export default postsObj.reducer;
