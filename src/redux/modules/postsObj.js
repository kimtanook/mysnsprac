// src/redux/modules/counter.js
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {dbService} from "../../firebase";

export const getPost = createAsyncThunk(
  "getPostFromFireStore", // action value (아무거나 적어도 되지만, 이름표처럼 생각.)
  async (payload, thunkAPI) => {
    // 콜백함수.
    try {
      const q = query(
        collection(dbService, "post"),
        orderBy("createAt", "desc")
      );
      let postsArr = [];
      const docs = await getDocs(q);
      docs.forEach((doc) => {
        const post = {
          id: doc.id,
          ...doc.data(),
        };
        postsArr.push(post);
      });

      // payload 부분 없이 return만 해도 상관없음
      return (payload = thunkAPI.fulfillWithValue(postsArr));
    } catch (error) {
      //thunkAPI 없이 error를 보내도 되지만, 그렇게 하면 에러메세지 뒤에 또 다른 에러메세지가 계속 붙는다.
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Initial State
const initialState = {
  posts: [],
  status: "",
};

// Reducer
const postsObj = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder callback 표기법

    builder.addCase(getPost.pending, (state, action) => {
      // pending : 실행중 (임의로 이름 바꾸기 x)
      state.status = "Loading";
    });
    builder.addCase(getPost.fulfilled, (state, action) => {
      // fulfilled : 성공 (임의로 이름 바꾸기 x)
      state.posts = action.payload;
      state.status = "complete";
    });
    builder.addCase(getPost.rejected, (state, action) => {
      // rejected : 실패 (임의로 이름 바꾸기 x)
      state.error = action.payload.message;
      console.log("action.payload : ", action.payload);
    });
  },
});

// export default reducer
export const postActions = postsObj.actions;
export default postsObj.reducer;
