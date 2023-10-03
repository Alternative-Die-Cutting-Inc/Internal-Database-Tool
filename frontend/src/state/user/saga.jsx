/* eslint-disable react-hooks/rules-of-hooks */
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
  setUserInfo,
  setLoading,
} from "./userSlice";

export const getUsers = createAction("getUsersSaga");

export function* getUsersSaga() {
  try {
    const { axios } = useAxios();
    yield put(getUsersStart());
    const response = yield call(axios.get, "/user");
    yield put(getUsersSuccess(response.data?.users));
  } catch (error) {
    yield put(getUsersFailure(error.response.data?.errorMessage));
  }
}

export const signUp = createAction("createUserSaga");

export function* createUserSaga({ payload: { user } }) {
  try {
    const { axios } = useAxios();
    yield put(signupStart());
    const result = yield call(axios.post, "/user/signup", user);
    yield put(signupSuccess(result.data.user));
  } catch (error) {
    yield put(signupFail(error.response.data));
  }
}

export const signin = createAction("signinSaga");

export function* signinSaga({ payload: { username, password } }) {
  try {
    const { axios } = useAxios();
    yield put(signinStart());
    const result = yield call(axios.post, "/user/signin", {
      username,
      password,
    });
    yield put(signinSuccess(result.data.user));
  } catch (error) {
    console.error(error.response.data?.errorMessage);
    yield put(signinFail(error.response.data?.errorMessage));
  }
}

export const logout = createAction("logoutSaga");

export function* logoutSaga() {
  try {
    const { axios } = useAxios();
    yield put(logoutStart());
    yield call(axios.post, "/user/signout");
    yield put(logoutSuccess());
  } catch (error) {
    console.error(error);
    yield put(logoutFailure(error.response.data?.errorMessage));
  }
}

export const getUserInfo = createAction("getUserInfoSaga");

export function* getUserInfoSaga({ payload: navigate }) {
  try {
    yield put(setLoading(true));
    const { axios } = useAxios();

    const result = yield call(axios.get, "/user/info");
    yield put(setUserInfo(result.data.user));
    yield put(setLoading(false));
  } catch (error) {
    navigate && navigate("/");
    yield put(setLoading(false));
  }
}

export default function* usersSaga() {
  yield takeLeading(signin.type, signinSaga);
  yield takeLeading(signUp.type, createUserSaga);
  yield takeLeading(logout.type, logoutSaga);
  yield takeLeading(getUserInfo.type, getUserInfoSaga);
}
