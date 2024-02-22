import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  dockets: [],
  docket: null,
  searchedDockets: [],
};

const docketSlice = createSlice({
  name: "docketsReducer",
  initialState,
  reducers: {
    getDocketsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDocketsSuccess: (state, { payload: dockets }) => {
      state.loading = false;
      state.error = null;
      state.dockets = dockets;
    },
    getDocketsFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
      state.dockets = null;
    },
    getDocketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDocketSuccess: (state, { payload: docket }) => {
      state.loading = false;
      state.error = null;
      state.docket = docket;
    },
    getDocketFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    createDocketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDocketSuccess: (state, { payload: docket }) => {
      state.loading = false;
      state.error = null;
      state.docket = docket;
      state.dockets.unshift(docket);
    },
    createDocketFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    updateDocketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDocketSuccess: (state, { payload: docket }) => {
      state.loading = false;
      state.error = null;
      state.docket = docket;
      let index = state.dockets.findIndex(listDocket => listDocket._id === docket._id);
      if (index !== -1) {
        state.dockets[index] = docket;
      } else state.dockets.unshift(docket)

    },
    updateDocketFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    deleteDocketSuccess: (state, { payload: docket }) => {
      state.dockets = state.dockets.filter((listDocket) => {
        return listDocket._id !== docket._id
      })
    },
    searchDocketsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchDocketsSuccess: (state, { payload: dockets }) => {
      state.loading = false;
      state.error = null;
      state.searchedDockets = dockets;
    },
    searchDocketsFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
      state.searchedDockets = [];
    },
  },
});

export const {
  getDocketsFailure,
  getDocketsSuccess,
  getDocketsStart,
  getDocketFailure,
  getDocketSuccess,
  getDocketStart,
  createDocketFailure,
  createDocketSuccess,
  createDocketStart,
  updateDocketFailure,
  updateDocketSuccess,
  updateDocketStart,
  deleteDocketSuccess,
  searchDocketsStart,
  searchDocketsSuccess,
  searchDocketsFailure,
} = docketSlice.actions;

export default docketSlice.reducer;

export const docketReducerSelector = (state) => state[docketSlice.name];

export const docketsSelector = createSelector(
  docketReducerSelector,
  ({ dockets, loading, error }) => ({ dockets, loading, error })
);
export const docketSelector = createSelector(
  docketReducerSelector,
  ({ docket, loading, error }) => ({ docket, loading, error })
);

export const searchDocketsSelector = createSelector(
  docketReducerSelector,
  ({ searchedDockets, loading, error }) => ({ searchedDockets, loading, error })
);