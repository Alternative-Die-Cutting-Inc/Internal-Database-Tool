const mongoose = require("mongoose");
const { autoIncrementModelID } = require("./CounterModel");

const extraChargeSchema = new mongoose.Schema({
  chargeName: {
    type: String,
    required: true,
  },
  chargePerM: {
    type: Number,
    required: false,
  },
  chargeCost: {
    type: Number,
    required: false,
  },
});

const quoteJobSchema = new mongoose.Schema({
  units: {
    type: Number,
    required: false,
  },
  perSheet: {
    type: Number,
    required: false,
  },
  clientNotes: {
    type: String,
    required: false,
  },
  internalNotes: {
    type: String,
    required: false,
  },
  extraCharges: [extraChargeSchema],
  dieHours: {
    type: Number,
    required: false,
  },
  dieSetup: {
    type: Number,
    required: false,
  },
  dieRunSpeed: {
    type: Number,
    required: false,
  },
  dieRunM: {
    type: Number,
    required: false,
  },
  gluerSetupHours: {
    type: Number,
    required: false,
  },
  gluerRunSpeed: {
    type: Number,
    required: false,
  },
  gluerRunM: {
    type: Number,
    required: false,
  },
  stripRunSpeed: {
    type: Number,
    required: false,
  },
  stripRunM: {
    type: Number,
    required: false,
  },
});

const QuoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  jobName: {
    type: String,
    required: true,
  },
  attention: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  quoteJobs: [quoteJobSchema],
});

QuoteSchema.pre("validate", function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID("quoteNumber", this, next);
});

const QuoteModel = mongoose.model("Quote", QuoteSchema);

/**
 * Global Quote objet
 * @typedef {typeof QuoteModel.schema.obj} Quote
 */
module.exports = QuoteModel;
