import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  dockets: [],
  docket: {
    docketNumber: 44300,
    quoteNumber: 18500,
    quoteJob: "",
    customerName: "",
    customerPO: 44182,
    productionPerson: "",
    jobName: "",
    jobType: "",
    soldFor: 1,
    dieID: 43741,
    dieType: "",
    finishing: "",
    specialInstructions: "",
    forms: [],
    extraCharges: [],
    requoteMemo: "",
    creationDate: null,
    closeDate: null,
  },
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
  },
});

export const {
  getDocketsFailure,
  getDocketsSuccess,
  getDocketsStart,
  getDocketFailure,
  getDocketSuccess,
  getDocketStart,
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
