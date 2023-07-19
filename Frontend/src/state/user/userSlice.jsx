import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  users: null,
  user: null,
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
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginFail: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    loginSuccess: (state, { payload: user }) => {
      state.loading = false;
      state.error = null;
      state.user = user;
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    logoutFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    signupFail: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
  },
});

export const {
  getUsersFailure,
  getUsersSuccess,
  getUsersStart,
  loginFail,
  loginStart,
  loginSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
  signupStart,
  signupSuccess,
  signupFail,
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
