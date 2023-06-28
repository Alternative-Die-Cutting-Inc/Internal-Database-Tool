import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  getUserFailure,
  getUserStart,
  getUserSuccess,
} from "./userSlice";

export const getUsers = createAction("getUsersSaga");

export function* getUsersSaga() {
  const { axios } = useAxios();

  try {
    yield put(getUsersStart());
    const response = yield call(axios.get, "/user/unapproved-users"); // change URL
    yield put(getUsersSuccess(response.data?.users));
  } catch (e) {
    yield put(getUsersFailure(e));
  }
}

export const getUser = createAction("getUserSaga");

export function* getUserSaga() {
  const { axios } = useAxios();

  try {
    yield put(getUserStart());
    const response = yield call(axios.get, "/user/unapproved-users"); // change URL
    yield put(getUserSuccess(response.data?.users));
  } catch (e) {
    yield put(getUserFailure(e));
  }
}

export default function* usersSaga() {
  yield takeLeading(getUsers.type, getUsersSaga);
  yield takeLeading(getUser.type, getUserSaga);
}
