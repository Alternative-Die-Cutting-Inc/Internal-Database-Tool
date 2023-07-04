import { createAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import {
  setNavbarFunctionsFailure,
  setNavbarFunctionsSuccess,
  setNavbarFunctionsStart,
} from "./navbarSlice";

export const setNavbarFunctions = createAction("setNavbarFunctionsSaga");

export function* setNavbarFunctionsSaga({ payload: { navbarFunctions } }) {
  try {
    yield put(setNavbarFunctionsStart());
    yield put(setNavbarFunctionsSuccess(navbarFunctions));
  } catch (e) {
    yield put(setNavbarFunctionsFailure(e));
  }
}

export default function* docketsSaga() {
  yield takeLeading(setNavbarFunctions.type, setNavbarFunctionsSaga);
}
