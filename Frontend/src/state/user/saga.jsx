import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  loginFail,
  loginStart,
  loginSuccess,
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

export function* createUserSaga({
  payload: { setSnackbar, setIsLoading, user },
}) {
  const { axios } = useAxios();
  try {
    yield put(signupStart());
    const result = yield call(axios.post, "/user/signup", user);
    yield put(signupSuccess(result.data.user));
  } catch (error) {
    setSnackbar(
      error.response?.data?.message
        ? error.response?.data?.message.toString()
        : error.response?.data
        ? error.response?.data.toString()
        : error.toString(),
      true
    );
    setIsLoading(false);
    yield put(signupFail(error.response.data));
  }
}

export const login = createAction("loginSaga");

export function* loginSaga({
  payload: { setSnackbar, setIsLoading, email, password },
}) {
  const { axios } = useAxios();
  try {
    yield put(loginStart());
    const result = yield call(axios.post, "/user/login", { email, password });
    yield put(loginSuccess(result.data.user));
  } catch (error) {
    setSnackbar(
      error.response?.data?.message
        ? error.response?.data?.message.toString()
        : error.response?.data
        ? error.response?.data.toString()
        : error.toString(),
      true
    );
    setIsLoading(false);
    yield put(loginFail(error.response.data));
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
  yield takeLeading(login.type, loginSaga);
  yield takeLeading(signUp.type, createUserSaga);
  yield takeLeading(logout.type, logoutSaga);
}
