import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  navbarFunctions: [],
};

const navbarSlice = createSlice({
  name: "navbarReducer",
  initialState,
  reducers: {
    setNavbarFunctionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setNavbarFunctionsSuccess: (state, { payload: navbarFunctions }) => {
      state.loading = false;
      state.error = null;
      state.navbarFunctions = navbarFunctions;
    },
    setNavbarFunctionsFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
  },
});

export const {
  setNavbarFunctionsFailure,
  setNavbarFunctionsSuccess,
  setNavbarFunctionsStart,
} = navbarSlice.actions;

export default navbarSlice.reducer;

export const navbarFunctionsReducerSelector = (state) =>
  state[navbarSlice.name];

export const navbarFunctionsSelector = createSelector(
  navbarFunctionsReducerSelector,
  ({ navbarFunctions, loading, error }) => ({ navbarFunctions, loading, error })
);
