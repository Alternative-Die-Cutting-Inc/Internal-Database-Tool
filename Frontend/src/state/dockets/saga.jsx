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
    const response = yield call(axios.get, "/user/unapproved-users"); // change URL
    yield put(getDocketsSuccess(response.data?.dockets));
  } catch (e) {
    yield put(getDocketsFailure(e));
  }
}

export const getDocket = createAction("getDocketSaga");

export function* getDocketSaga() {
  const { axios } = useAxios();
  const docket = {
    docketNumber: 44300,
    quoteNumber: 18500,
    quoteJob: "30000 units, $1235.14 at $41.17/M",
    customerName: "Record Jacket Corp",
    customerPO: 44182,
    productionPerson: "Jessi, Tim, Manny",
    jobName: "Album Gatefold Jacket Test (Fm - 3180)",
    jobType: "commercial",
    soldFor: 1,
    dieID: 43741,
    dieType: "B-die",
    finishing:
      "Standing B-die #43741, die cut, , score, strip, Fold and glue, final fold Manually, Carton in 55s",
    specialInstructions:
      "Die - 1up up Album Jacket. (TEST ) (final fold DTape machine)",
    forms: [
      {
        name: "Total",
        quantity: 2000,
        notes: "Pcs",
        quantityShipped: 1000,
        lastShipmentDate: new Date(),
      },
      {
        name: "Total",
        quantity: 2000,
        notes: "Pcs",
        quantityShipped: 1000,
        lastShipmentDate: new Date(),
      },
      {
        name: "Total",
        quantity: 2000,
        notes: "Pcs",
        quantityShipped: 1000,
        lastShipmentDate: new Date(),
      },
      {
        name: "Total",
        quantity: 2000,
        notes: "Pcs",
        quantityShipped: 1000,
        lastShipmentDate: new Date(),
      },
    ],
    extraCharges: [
      {
        chargeName: "Total",
        chargeCost: 2000,
        chargeNotes: "Pcs",
      },
      {
        chargeName: "Total",
        chargeCost: 2000,
        chargeNotes: "Pcs",
      },
      {
        chargeName: "Total",
        chargeCost: 2000,
        chargeNotes: "Pcs",
      },
      {
        chargeName: "Total",
        chargeCost: 2000,
        chargeNotes: "Pcs",
      },
      {
        chargeName: "Total",
        chargeCost: 2000,
        chargeNotes: "Pcs",
      },
    ],
    requoteMemo:
      "Widen bottom crease on pocket next run please. RD July 2014  setup 35 min. speed 2000 gluer speed 9000",
    creationDate: new Date(),
    closeDate: new Date(),
  };

  try {
    yield put(getDocketStart());
    // const response = yield call(axios.get, "/user/unapproved-users"); // change URL
    // yield put(getDocketSuccess(response.data?.docket));
    yield put(getDocketSuccess(docket));
  } catch (e) {
    yield put(getDocketFailure(e));
  }
}

export default function* docketsSaga() {
  yield takeLeading(getDockets.type, getDocketsSaga);
  yield takeLeading(getDocket.type, getDocketSaga);
}
