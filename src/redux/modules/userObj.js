// src/redux/modules/counter.js
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  users: '',
};
// Reducer

const userObj = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    currentUser: (state, action) => {
      state.users = action.payload;
    },
  },
});
// export default reducer
export const userActions = userObj.actions;
export default userObj.reducer;
