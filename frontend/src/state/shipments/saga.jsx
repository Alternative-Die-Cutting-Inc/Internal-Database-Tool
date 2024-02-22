/* eslint-disable react-hooks/rules-of-hooks */
import { createAction } from "@reduxjs/toolkit";
import { put, call, takeLeading } from "redux-saga/effects";
import useAxios from "../../hooks/useAxios";
import {
  getShipmentsStart,
  getShipmentsSuccess,
  getShipmentsFailure,
  getShipmentStart,
  getShipmentSuccess,
  getShipmentFailure,
  createShipmentStart,
  createShipmentSuccess,
  createShipmentFailure,
  updateShipmentStart,
  updateShipmentSuccess,
  updateShipmentFailure,
} from "./shipmentsSlice";

export const getShipments = createAction("getShipmentsSaga");

export function* getShipmentsSaga() {
  const { axios } = useAxios();

  try {
    yield put(getShipmentsStart());
    const response = yield call(axios.get, "/shipments");
    yield put(getShipmentsSuccess(response?.data?.shipments));
  } catch (error) {
    yield put(getShipmentsFailure(error.response?.data?.errorMessage));
  }
}

export const getShipment = createAction("getShipmentSaga");

export function* getShipmentSaga({ payload: { id } }) {
  const { axios } = useAxios();

  try {
    yield put(getShipmentStart());
    const response = yield call(axios.get, `/shipments/${id}`);
    yield put(getShipmentSuccess(response?.data?.shipment));
  } catch (error) {
    yield put(getShipmentFailure(error.response?.data?.errorMessage));
  }
}

export const createShipment = createAction("createShipmentSaga");

export function* createShipmentSaga({ payload: shipment }) {
  const { axios } = useAxios();

  try {
    yield put(createShipmentStart());
    const response = yield call(axios.post, "/shipments", { shipment });
    yield put(createShipmentSuccess(response?.data?.shipment));
  } catch (error) {
    yield put(createShipmentFailure(error.response?.data?.errorMessage));
  }
}

export const updateShipment = createAction("updateShipmentSaga");

export function* updateShipmentSaga({ payload: { shipment } }) {

  try {
    yield put(updateShipmentStart());
    yield put(updateShipmentSuccess(shipment));
  } catch (error) {
    yield put(updateShipmentFailure(error.response?.data?.errorMessage));
  }
}

export default function* shipmentsSaga() {
  yield takeLeading(getShipments.type, getShipmentsSaga);
  yield takeLeading(getShipment.type, getShipmentSaga);
  yield takeLeading(createShipment.type, createShipmentSaga);
  yield takeLeading(updateShipment.type, updateShipmentSaga);
}
