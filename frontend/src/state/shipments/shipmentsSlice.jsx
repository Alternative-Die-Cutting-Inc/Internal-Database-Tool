import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export const initialState = {
  loading: false,
  error: null,
  docketShipments: [],
  shipment: {},
};

const shipmentsSlice = createSlice({
  name: "shipmentsReducer",
  initialState,
  reducers: {
    getDocketShipmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDocketShipmentsSuccess: (state, { payload: shipments }) => {
      state.loading = false;
      state.error = null;
      state.docketShipments = shipments;
    },
    getDocketShipmentsFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    getShipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getShipmentSuccess: (state, { payload: shipment }) => {
      state.loading = false;
      state.error = null;
      state.shipment = shipment;
    },
    getShipmentFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    createShipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createShipmentSuccess: (state, { payload: shipment }) => {
      state.loading = false;
      state.error = null;
      state.shipment = shipment;
    },
    createShipmentFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
    updateShipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateShipmentSuccess: (state, { payload: shipment }) => {
      state.loading = false;
      state.error = null;
      state.shipment = shipment;
    },
    updateShipmentFailure: (state, { payload: error }) => {
      state.loading = false;
      state.error = error;
    },
  },
});

export const {
  getDocketShipmentsStart,
  getDocketShipmentsSuccess,
  getDocketShipmentsFailure,
  getShipmentStart,
  getShipmentSuccess,
  getShipmentFailure,
  createShipmentStart,
  createShipmentSuccess,
  createShipmentFailure,
  updateShipmentStart,
  updateShipmentSuccess,
  updateShipmentFailure,
} = shipmentsSlice.actions;

export default shipmentsSlice.reducer;

export const shipmentsReducerSelector = (state) => state[shipmentsSlice.name];

export const shipmentsSelector = createSelector(
  shipmentsReducerSelector,
  ({ docketShipments, error, loading }) => ({ docketShipments, error, loading })
);

export const shipmentSelector = createSelector(
  shipmentsReducerSelector,
  ({ shipment, error, loading }) => ({ shipment, error, loading })
);
