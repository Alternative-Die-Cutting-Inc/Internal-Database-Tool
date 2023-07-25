import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getDocketsFailure,
  getDocketsStart,
  getDocketsSuccess,
  getDocketFailure,
  getDocketStart,
  getDocketSuccess,
} from "./docketSlice";

export const getDockets = createAction("getDocketsSaga");

export function* getDocketsSaga() {
  const { axios } = useAxios();

  try {
    yield put(getDocketsStart());
    const response = yield call(axios.get, "/dockets");
    yield put(getDocketsSuccess(response.data?.dockets));
  } catch (e) {
    yield put(getDocketsFailure(e));
  }
}

export const getDocket = createAction("getDocketSaga");

export function* getDocketSaga({ payload: { id } }) {
  const { axios } = useAxios();

  try {
    yield put(getDocketStart());
    const response = yield call(axios.get, `/dockets/number/${id}`); // change URL
    yield put(getDocketSuccess(response.data?.docket));
  } catch (e) {
    yield put(getDocketFailure(e));
  }
}

export default function* docketsSaga() {
  yield takeLeading(getDockets.type, getDocketsSaga);
  yield takeLeading(getDocket.type, getDocketSaga);
}
