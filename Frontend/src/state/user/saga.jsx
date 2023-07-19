import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  signinFail,
  signinStart,
  signinSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
  signupStart,
  signupSuccess,
  signupFail,
} from "./userSlice";

export const getUsers = createAction("getUsersSaga");

export function* getUsersSaga() {
  const { axios } = useAxios();
  try {
    yield put(getUsersStart());
    const response = yield call(axios.get, "/user");
    yield put(getUsersSuccess(response.data?.users));
  } catch (e) {
    yield put(getUsersFailure(e));
  }
}

export const signUp = createAction("createUserSaga");

export function* createUserSaga({ payload: { user } }) {
  const { axios } = useAxios();
  try {
    yield put(signupStart());
    const result = yield call(axios.post, "/user/signup", user);
    yield put(signupSuccess(result.data.user));
  } catch (error) {
    yield put(signupFail(error.response.data));
  }
}

export const signin = createAction("signinSaga");

export function* signinSaga({ payload: { username, password } }) {
  const { axios } = useAxios();
  try {
    yield put(signinStart());
    const result = yield call(axios.post, "/user/signin", {
      username,
      password,
    });
    yield put(signinSuccess(result.data.user));
  } catch (error) {
    console.error(error);
    yield put(signinFail(error.response));
  }
}

export const logout = createAction("logoutSaga");

export function* logoutSaga({ payload: { navigate } }) {
  const { axios } = useAxios();

  try {
    yield put(logoutStart());
    yield call(axios.post, "/user/logout");
    yield put(logoutSuccess());
    yield call(navigate, "/");
  } catch (err) {
    console.error(err);
    yield put(logoutFailure(err.response.data));
  }
}

export default function* usersSaga() {
  yield takeLeading(signin.type, signinSaga);
  yield takeLeading(signUp.type, createUserSaga);
  yield takeLeading(logout.type, logoutSaga);
}
