const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./CounterModel');

const extraChargeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  perM: {
    type: Number,
    required: false,
  },
  cost: {
    type: Number,
    required: false,
  },
});

const quoteRatesSchema = new mongoose.Schema({
  press: {},
  gluer: {},
  strip: {},
  die: {},
  customer_premium: {},
  global_premium: {},
});

const RatesModel = mongoose.model('Rates', quoteRatesSchema);

/**
 * @description Add database rates to quote
 * @param {Object} doc document to increment
 * @param {Function} next callback function
 */
const getRates = function (doc, next) {
  RatesModel.findOneAndUpdate({}, {},).then(
    (counter) => {
      doc[counterName] = counter.seq;
      next();
    },
    (error) => {
      next(error);
    },
  );
};

const quoteJobSchema = new mongoose.Schema({
  units: {
    type: Number,
    required: false,
    default: 0,
  },
  perSheet: {
    type: Number,
    required: false,
    default: 0,
  },
  clientNotes: {
    type: String,
    required: false,
  },
  internalNotes: {
    type: String,
    required: false,
  },
  extraCharges: {
    type: [extraChargeSchema],
    required: true,
    default: [],
  },
  dieHours: {
    type: Number,
    required: false,
    default: 0,
  },
  dieSetup: {
    type: Number,
    required: false,
    default: 0,
  },
  dieRunSpeed: {
    type: Number,
    required: false,
    default: 0,
  },
  dieRunM: {
    type: Number,
    required: false,
    default: 0,
  },
  gluerSetupHours: {
    type: Number,
    required: false,
    default: 0,
  },
  gluerRunSpeed: {
    type: Number,
    required: false,
    default: 0,
  },
  gluerRunM: {
    type: Number,
    required: false,
    default: 0,
  },
  stripRunSpeed: {
    type: Number,
    required: false,
    default: 0,
  },
  stripRunM: {
    type: Number,
    required: false,
    default: 0,
  },
  rates: { type: quoteRatesSchema, required: true },
  total: {
    type: Number,
    required: false,
    default: 0,
  },
});

const QuoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: Number,
    required: true,
    unique: true,
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
  status: {
    type: [
      {
        value: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
      },
    ],
    required: false,
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

QuoteSchema.pre('validate', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('quoteNumber', this, next);
});

const QuoteModel = mongoose.model('Quote', QuoteSchema);

/**
 * Global Quote objet
 * @typedef {typeof QuoteModel.schema.obj} Quote
 */
module.exports = QuoteModel;
