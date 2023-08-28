/* eslint-disable react-hooks/rules-of-hooks */
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
  changeRatesEditorFailure,
  changeRatesEditorSuccess,
  changeRatesEditorStart,
  getRatesFailure,
  getRatesSuccess,
  getRatesStart,
} from "./quoteSlice";

export const getQuotes = createAction("getQuotesSaga");

export function* getQuotesSaga() {
  const { axios } = useAxios();

  try {
    yield put(getQuotesStart());
    const response = yield call(axios.get, "/quotes");
    yield put(getQuotesSuccess(response.data?.quotes));
  } catch (error) {
    yield put(getQuotesFailure(error.response.data?.errorMessage));
  }
}

export const getQuote = createAction("getQuoteSaga");

export function* getQuoteSaga({ payload: { id } }) {
  const { axios } = useAxios();

  try {
    yield put(getQuoteStart());
    const response = yield call(axios.get, `/quotes/number/${id}`);
    yield put(getQuoteSuccess(response.data?.quote));
  } catch (error) {
    console.log(error);
    yield put(getQuoteFailure(error.response.data?.errorMessage));
  }
}

export const getRates = createAction("getRatesSaga");

export function* getRatesSaga() {
  const { axios } = useAxios();

  try {
    yield put(getRatesStart());
    const response = yield call(axios.get, `/quotes/rates`);
    yield put(getRatesSuccess(response.data?.rates));
  } catch (error) {
    yield put(getRatesFailure(error.response.data?.errorMessage));
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
    yield put(createQuoteFailure(error.response.data?.errorMessage));
  }
}

export const createJob = createAction("createJobSaga");

export function* createJobSaga({ payload: { quoteID, fields } }) {
  const { axios } = useAxios();
  try {
    yield put(updateQuoteStart());
    const response = yield call(axios.post, `/quotes/${quoteID}/job`, {
      fields,
    });
    yield put(updateQuoteSuccess(response.data?.quote));
  } catch (error) {
    yield put(updateQuoteFailure(error.response.data?.errorMessage));
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
    yield put(updateQuoteFailure(error.response.data?.errorMessage));
  }
}

export const updateJob = createAction("updateJobSaga");

export function* updateJobSaga({ payload: { quoteID, jobID, fields } }) {
  const { axios } = useAxios();
  try {
    yield put(updateQuoteStart());
    const response = yield call(axios.put, `/quotes/${quoteID}/${jobID}`, {
      fields,
    });
    yield put(updateQuoteSuccess(response.data?.quote));
  } catch (error) {
    yield put(updateQuoteFailure(error.response.data?.errorMessage));
  }
}

export const changeRates = createAction("changeRatesSaga");

export function* changeRatesSaga({ payload: { rates } }) {
  const { axios } = useAxios();
  try {
    yield put(changeRatesEditorStart());
    if (rates !== undefined) {
      const response = yield call(axios.put, `/quotes/rates`, { rates });
      yield put(changeRatesEditorSuccess(response.data?.rates));
    } else {
      yield put(changeRatesEditorSuccess());
    }
  } catch (error) {
    yield put(changeRatesEditorFailure(error.response.data?.errorMessage));
  }
}

export const searchQuotes = createAction("searchQuotesSaga");

export function* searchQuotesSaga({ payload: { query, filters } }) {
  const { axios } = useAxios();
  try {
    yield put(getQuotesStart());
    const response = yield call(axios.post, `/quotes/search`, {
      query,
      filters,
    });
    yield put(getQuotesSuccess(response.data?.quotes));
  } catch (error) {
    yield put(getQuotesFailure(error.response.data?.errorMessage));
  }
}

export default function* quotesSaga() {
  yield takeLeading(createQuote.type, createQuoteSaga);
  yield takeLeading(createJob.type, createJobSaga);
  yield takeLeading(updateQuote.type, updateQuoteSaga);
  yield takeLeading(updateJob.type, updateJobSaga);
  yield takeLeading(getQuotes.type, getQuotesSaga);
  yield takeLeading(getQuote.type, getQuoteSaga);
  yield takeLeading(getRates.type, getRatesSaga);
  yield takeLeading(changeRates.type, changeRatesSaga);
  yield takeLeading(searchQuotes.type, searchQuotesSaga);
}
