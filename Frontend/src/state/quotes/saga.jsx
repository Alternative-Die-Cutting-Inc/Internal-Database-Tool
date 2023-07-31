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
  createQuoteFailure,
  createQuoteSuccess,
  createQuoteStart,
  updateQuoteFailure,
  updateQuoteSuccess,
  updateQuoteStart,
} from "./quoteSlice";

export const getQuotes = createAction("getQuotesSaga");

export function* getQuotesSaga() {
  const { axios } = useAxios();

  try {
    yield put(getQuotesStart());
    const response = yield call(axios.get, "/quotes");
    yield put(getQuotesSuccess(response.data?.quotes));
  } catch (e) {
    yield put(getQuotesFailure(e));
  }
}

export const getQuote = createAction("getQuoteSaga");

export function* getQuoteSaga({ payload: { id } }) {
  const { axios } = useAxios();

  try {
    yield put(getQuoteStart());
    const response = yield call(axios.get, `/quotes/number/${id}`);
    yield put(getQuoteSuccess(response.data?.quote));
  } catch (e) {
    yield put(getQuoteFailure(e));
  }
}

export const createQuote = createAction("createQuoteSaga");

export function* createQuoteSaga({ payload: { quote, navigate } }) {
  const { axios } = useAxios();
  try {
    yield put(createQuoteStart());
    const response = yield call(axios.post, `/quotes/`, { quote });
    yield put(createQuoteSuccess(response.data?.quote));
    navigate(`/quotetool?quoteNumber=${response.data?.quote?.quoteNumber}`);
  } catch (error) {
    yield put(createQuoteFailure(error));
  }
}

export const updateQuote = createAction("updateQuoteSaga");

export function* updateQuoteSaga({ payload: { id, fields } }) {
  const { axios } = useAxios();
  try {
    yield put(updateQuoteStart());
    const response = yield call(axios.put, `/quotes/${id}`, { fields });
    yield put(updateQuoteSuccess(response.data?.quote));
  } catch (error) {
    yield put(updateQuoteFailure(error));
  }
}

export default function* quotesSaga() {
  yield takeLeading(createQuote.type, createQuoteSaga);
  yield takeLeading(updateQuote.type, updateQuoteSaga);
  yield takeLeading(getQuotes.type, getQuotesSaga);
  yield takeLeading(getQuote.type, getQuoteSaga);
}
