import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import userObj from '../modules/userObj';
import postsObj from '../modules/postsObj';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, postsObj);

const store = configureStore({
  reducer: { userObj, postsObj: persistedReducer },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export default store;
