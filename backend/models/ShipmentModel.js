const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
  },
  numberOfSkids: {
    type: Number,
    required: true,
  },
  formNotes: {
    type: String,
    required: false,
  },
  packageType: {
    type: String,
    required: true,
    enum: ["cartons", "sheets", "pieces"],
  },
  packageQuantity: {
    // Number of cartons, sheets, or pieces
    type: Number,
    required: true,
  },
  perCartonQuantity: {
    type: Number,
    required: false,
  },
  partialCartonQuantity: {
    type: Number,
    required: false,
  },
});

const ShipmentSchema = new mongoose.Schema({
  docketNumber: {
    type: Number,
    required: true,
  },
  quoteNumber: {
    type: Number,
    required: true,
  },
  jobName: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPO: {
    type: String,
    required: false,
  },
  labelDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  shipDate: {
    type: Date,
    required: false,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
  label1: {
    type: String,
    required: false,
  },
  label2: {
    type: String,
    required: false,
  },
  shipmentForms: { type: [formSchema], required: true },
});

const ShipmentModel = mongoose.model("Shipment", ShipmentSchema);

/**
 * Global Shipment objet
 * @typedef {typeof ShipmentModel.schema.obj} Shipment
 */
module.exports = ShipmentModel;
