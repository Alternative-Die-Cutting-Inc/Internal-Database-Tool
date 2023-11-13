import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  customerNames: [],
  customer: null,
  customers: [],
  email: null,
};

const customerSlice = createSlice({
  name: "customerReducer",
  initialState,
  reducers: {
    getCustomerNamesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCustomerNamesSuccess: (state, { payload: customerNames }) => {
      state.loading = false;
      state.error = null;
      state.customerNames = customerNames;
    },
    getCustomerNamesFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    getCustomerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCustomerSuccess: (state, { payload: customer }) => {
      state.loading = false;
      state.error = null;
      state.customer = customer;
    },
    getCustomerFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    getCustomersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCustomersSuccess: (state, { payload: customers }) => {
      state.loading = false;
      state.error = null;
      state.customers = customers;
    },
    getCustomersFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    createCustomerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCustomerSuccess: (state, { payload: customers }) => {
      state.loading = false;
      state.error = null;
      state.customers = customers;
    },
    createCustomerFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    updateCustomerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCustomerSuccess: (state, { payload: customer }) => {
      state.loading = false;
      state.error = null;
      state.customer = customer;
    },
    updateCustomerFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    sendPDFStart: (state) => {
      state.loading = true;
      state.email = null;
    },
    sendPDFSuccess: (state) => {
      state.loading = false;
      state.email = "Email sent successfully";
    },
    sendPDFFailure: (state, { payload: error }) => {
      state.loading = false;
      state.email = null;
      state.error = error;
    },
    clearEmailState: (state) => {
      state.email = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  getCustomerNamesFailure,
  getCustomerNamesSuccess,
  getCustomerNamesStart,
  getCustomerFailure,
  getCustomerSuccess,
  getCustomerStart,
  getCustomersFailure,
  getCustomersSuccess,
  getCustomersStart,
  createCustomerFailure,
  createCustomerSuccess,
  createCustomerStart,
  updateCustomerFailure,
  updateCustomerSuccess,
  updateCustomerStart,
  sendPDFFailure,
  sendPDFSuccess,
  sendPDFStart,
  clearEmailState,
} = customerSlice.actions;

export default customerSlice.reducer;

// Selectors
export const customerReducerSelector = (state) => {
  return state[customerSlice.name];
};

export const customerNamesSelector = createSelector(
  customerReducerSelector,
  ({ customerNames, loading, error }) => ({ customerNames, loading, error })
);

export const customerSelector = createSelector(
  customerReducerSelector,
  ({ customer, loading, error }) => ({ customer, loading, error })
);

export const customersSelector = createSelector(
  customerReducerSelector,
  ({ customers, loading, error }) => ({ customers, loading, error })
);

export const emailSelector = createSelector(
  customerReducerSelector,
  ({ email, error }) => ({ email, error })
);
