import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getQuotesFailure,
  getQuotesStart,
  getQuotesSuccess,
  getQuoteFailure,
  getQuoteStart,
  getQuoteSuccess,
} from "./quoteSlice";

export const getQuotes = createAction("getQuotesSaga");

export function* getQuotesSaga() {
  const { axios } = useAxios();

  try {
    yield put(getQuotesStart());
    const response = yield call(axios.get, "/user/unapproved-users"); // change URL
    yield put(getQuotesSuccess(response.data?.quotes));
  } catch (e) {
    yield put(getQuotesFailure(e));
  }
}

export const getQuote = createAction("getQuoteSaga");

export function* getQuoteSaga() {
  const { axios } = useAxios();

  try {
    yield put(getQuoteStart());
    const response = yield call(axios.get, "/user/unapproved-users"); // change URL
    yield put(getQuoteSuccess(response.data?.quotes));
  } catch (e) {
    yield put(getQuoteFailure(e));
  }
}

export default function* quotesSaga() {
  yield takeLeading(getQuotes.type, getQuotesSaga);
  yield takeLeading(getQuote.type, getQuoteSaga);
}
