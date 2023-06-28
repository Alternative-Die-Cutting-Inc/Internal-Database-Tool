import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  quotes: [],
  quote: {},
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
  },
});

export const {
  getQuotesFailure,
  getQuotesSuccess,
  getQuotesStart,
  getQuoteFailure,
  getQuoteSuccess,
  getQuoteStart,
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
