import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getCustomerNamesFailure,
  getCustomerNamesSuccess,
  getCustomerNamesStart,
  getCustomerFailure,
  getCustomerSuccess,
  getCustomerStart,
  createCustomerFailure,
  createCustomerSuccess,
  createCustomerStart,
  updateCustomerFailure,
  updateCustomerSuccess,
  updateCustomerStart,
} from "./customerSlice";

export const getCustomerNames = createAction("getCustomerNamesSaga");

export function* getCustomerNamesSaga() {
  const { axios } = useAxios();

  try {
    yield put(getCustomerNamesStart());
    const response = yield call(axios.get, "/customers/names");
    yield put(getCustomerNamesSuccess(response.data?.customers));
  } catch (error) {
    yield put(getCustomerNamesFailure(error));
  }
}

export const getCustomer = createAction("getCustomerSaga");

export function* getCustomerSaga({ payload: { id } }) {
  const { axios } = useAxios();

  try {
    yield put(getCustomerStart());
    const response = yield call(axios.get, `/customers/${id}`);
    yield put(getCustomerSuccess(response.data?.customer));
  } catch (error) {
    yield put(getCustomerFailure(error));
  }
}

export const createCustomer = createAction("createCustomerSaga");

export function* createCustomerSaga({ payload: { customer } }) {
  const { axios } = useAxios();
  try {
    yield put(createCustomerStart());
    const response = yield call(axios.post, `/customers/`, { customer });
    yield put(createCustomerSuccess(response.data?.customer));
  } catch (error) {
    yield put(createCustomerFailure(error));
  }
}

export const updateCustomer = createAction("updateCustomerSaga");

export function* updateCustomerSaga({ payload: { id, fields } }) {
  const { axios } = useAxios();
  try {
    yield put(updateCustomerStart());
    const response = yield call(axios.put, `/customers/${id}`, {
      fields,
    });
    yield put(updateCustomerSuccess(response.data?.customer));
  } catch (error) {
    yield put(updateCustomerFailure(error));
  }
}

export default function* customerSaga() {
  yield takeLeading(getCustomer, getCustomerSaga);
  yield takeLeading(createCustomer, createCustomerSaga);
  yield takeLeading(updateCustomer, updateCustomerSaga);
  yield takeLeading(getCustomerNames, getCustomerNamesSaga);
}
