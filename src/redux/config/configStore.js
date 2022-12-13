import {configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
// import thunk from "redux-thunk";

import userObj from "../modules/userObj";
import postsObj from "../modules/postsObj";

const persistConfig = {
  key: "root",
  storage,
};

const postPersistedReducer = persistReducer(persistConfig, postsObj);

const store = configureStore({
  reducer: {
    userObj,
    postsObj: postPersistedReducer,
  },
  // devTools: process.env.NODE_ENV !== "production", // devTools 사용할 때
  // middleware: [thunk], // middleware thunk 사용할 때
});

export default store;
