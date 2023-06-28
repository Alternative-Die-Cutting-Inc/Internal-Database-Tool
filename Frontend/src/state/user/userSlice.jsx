import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  users: [],
  user: {},
};

const userSlice = createSlice({
  name: "usersReducer",
  initialState,
  reducers: {
    getUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess: (state, { payload: users }) => {
      state.loading = false;
      state.error = null;
      state.users = users;
    },
    getUsersFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    getUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserSuccess: (state, { payload: user }) => {
      state.loading = false;
      state.error = null;
      state.user = user;
    },
    getUserFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
  },
});

export const {
  getUsersFailure,
  getUsersSuccess,
  getUsersStart,
  getUserFailure,
  getUserSuccess,
  getUserStart,
} = userSlice.actions;

export default userSlice.reducer;

export const userReducerSelector = (state) => state[userSlice.name];

export const usersSelector = createSelector(
  userReducerSelector,
  ({ users, loading, error }) => ({ users, loading, error })
);
export const userSelector = createSelector(
  userReducerSelector,
  ({ user, loading, error }) => ({ user, loading, error })
);
