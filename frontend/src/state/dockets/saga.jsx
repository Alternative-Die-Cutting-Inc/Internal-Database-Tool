/* eslint-disable react-hooks/rules-of-hooks */
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
} from "./docketSlice";

export const getDockets = createAction("getDocketsSaga");

export function* getDocketsSaga() {
  const { axios } = useAxios();

  try {
    yield put(getDocketsStart());
    const response = yield call(axios.get, "/dockets");
    yield put(getDocketsSuccess(response.data?.dockets));
  } catch (error) {
    yield put(getDocketsFailure(error));
  }
}

export const getDocket = createAction("getDocketSaga");

export function* getDocketSaga({ payload: { id } }) {
  const { axios } = useAxios();

  try {
    yield put(getDocketStart());
    const response = yield call(axios.get, `/dockets/number/${id}`); // change URL
    yield put(getDocketSuccess(response.data?.docket));
  } catch (error) {
    yield put(getDocketFailure(error));
  }
}

export const createDocket = createAction("createDocketSaga");

export function* createDocketSaga({ payload: { docket, navigate } }) {
  const { axios } = useAxios();
  try {
    yield put(createDocketStart());
    const response = yield call(axios.post, `/dockets/`, { docket });
    yield put(createDocketSuccess(response.data?.docket));
    navigate(`/dockettool?docketNumber=${response.data?.docket?.docketNumber}`);
  } catch (error) {
    yield put(createDocketFailure(error));
  }
}

export const updateDocket = createAction("updateDocketSaga");

export function* updateDocketSaga({ payload: { id, fields } }) {
  const { axios } = useAxios();
  try {
    yield put(updateDocketStart());
    const response = yield call(axios.put, `/dockets/${id}`, { fields });
    yield put(updateDocketSuccess(response.data?.docket));
  } catch (error) {
    yield put(updateDocketFailure(error));
  }
}

export const searchDockets = createAction("searchDocketsSaga");

export function* searchDocketsSaga({ payload: { query, filters } }) {
  const { axios } = useAxios();
  try {
    yield put(searchDocketsStart());
    const response = yield call(axios.post, `/dockets/search`, {
      query,
      filters,
    });
    yield put(searchDocketsSuccess(response.data?.dockets));
  } catch (error) {
    yield put(searchDocketsFailure(error));
  }
}

export const deleteDocket = createAction("deleteDocketSaga");

export function* deleteDocketSaga({ payload: { id } }) {
  const { axios } = useAxios();
  try {
    const response = yield call(axios.delete, `/dockets/${id}`);
    yield put(deleteDocketSuccess(response.data?.docket));
  } catch (error) {
    yield put(updateDocketFailure(error));
  }
}

export default function* docketsSaga() {
  yield takeLeading(createDocket.type, createDocketSaga);
  yield takeLeading(updateDocket.type, updateDocketSaga);
  yield takeLeading(getDockets.type, getDocketsSaga);
  yield takeLeading(getDocket.type, getDocketSaga);
  yield takeLeading(searchDockets.type, searchDocketsSaga);
  yield takeLeading(deleteDocket.type, deleteDocketSaga);
}
