import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  quotes: null,
  quote: null,
};

const quoteSlice = createSlice({
  name: "quotesReducer",
  initialState,
  reducers: {
    getQuotesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getQuotesSuccess: (state, { payload: quotes }) => {
      state.loading = false;
      state.error = null;
      state.quotes = quotes;
    },
    getQuotesFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    getQuoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getQuoteSuccess: (state, { payload: quote }) => {
      state.loading = false;
      state.error = null;
      state.quote = quote;
    },
    getQuoteFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    createQuoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createQuoteSuccess: (state, { payload: quote }) => {
      state.loading = false;
      state.error = null;
      state.quote = quote;
    },
    createQuoteFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    updateQuoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateQuoteSuccess: (state, { payload: quote }) => {
      state.loading = false;
      state.error = null;
      state.quote = quote;
    },
    updateQuoteFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
  },
});

export const {
  getQuotesFailure,
  getQuotesSuccess,
  getQuotesStart,
  getQuoteFailure,
  getQuoteSuccess,
  getQuoteStart,
  createQuoteFailure,
  createQuoteSuccess,
  createQuoteStart,
  updateQuoteFailure,
  updateQuoteSuccess,
  updateQuoteStart,
} = quoteSlice.actions;

export default quoteSlice.reducer;

export const quoteReducerSelector = (state) => state[quoteSlice.name];

export const quotesSelector = createSelector(
  quoteReducerSelector,
  ({ quotes, loading, error }) => ({ quotes, loading, error })
);
export const quoteSelector = createSelector(
  quoteReducerSelector,
  ({ quote, loading, error }) => ({ quote, loading, error })
);
