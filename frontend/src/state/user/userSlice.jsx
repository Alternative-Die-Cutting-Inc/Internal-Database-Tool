import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  users: [],
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
    signinStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signinFail: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    signinSuccess: (state, { payload: user }) => {
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
    signupSuccess: (state, { payload: users }) => {
      state.loading = false;
      state.error = null;
      state.users = users;
    },
    signupFail: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    setLoading: (state, { payload: loading }) => {
      state.loading = loading;
    },
    setUserInfo: (state, { payload: user }) => {
      state.user = user;
      state.loggedIn = true;
    },
  },
});

export const {
  getUsersFailure,
  getUsersSuccess,
  getUsersStart,
  signinFail,
  signinStart,
  signinSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
  signupStart,
  signupSuccess,
  signupFail,
  setUserInfo,
  setLoading,
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
