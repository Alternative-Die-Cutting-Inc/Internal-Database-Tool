const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./CounterModel');
const CustomerModel = require('./CustomerModel');

const formatFloat = (value) => parseFloat(value || 0).toFixed(2);
const formatInteger = (value) => parseInt(value || 0, 10);
const extraChargeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  perM: {
    type: Number,
    required: false,
    set: formatFloat,
    default: 0,
  },
  cost: {
    type: Number,
    required: false,
    set: formatFloat,
    default: 0,
  },
});

const rateSchema = new mongoose.Schema({
  die: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  press: {
    type: Number,
    required: false,
    set: formatFloat,
  },
  gluer: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  strip: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  global: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  customer: {
    type: Number,
    required: false,
    set: formatFloat,
  },
  bobst: {
    type: Number,
    required: true,
    set: formatFloat,
  },
  ijima: {
    type: Number,
    required: true,
    set: formatFloat,
  },
  heidelberg: {
    type: Number,
    required: true,
    set: formatFloat,
  },
});

const RatesModel = mongoose.model('Rates', rateSchema);

/**
 * @description Add database rates to job
 * @param {Object} doc document to increment
 * @param {Function} next callback function
 */
const getRates = function (job, next) {
  RatesModel.findOne({}).then(
    (globalRates) => {
      if (!globalRates) throw new Error('NO_RATES_FOUND');
      job.rates = globalRates;
      job.rates.press = job.rates.bobst;
      CustomerModel.findOne({ _id: job.parent().customer.customerID }).then(
        (customer) => {
          if (!customer) throw new Error('NO_CUSTOMER_FOUND');
          job.rates.customer = customer.premium;
          next();
        },
        (error) => {
          next(error);
        },
      );
    },
    (error) => {
      next(error);
    },
  );
};

const quoteJobSchema = new mongoose.Schema({
  units: {
    type: Number,
    required: true,
    default: 0,
    set: formatInteger,
  },
  perSheet: {
    type: Number,
    required: true,
    default: 0,
    set: formatInteger,
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
    required: true,
    set: formatFloat,
    default: 0,
  },
  dieSetup: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  dieRunSpeed: {
    type: Number,
    required: true,
    set: formatInteger,
    default: 0,
  },
  dieRunM: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  gluerSetupHours: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  gluerRunSpeed: {
    type: Number,
    required: true,
    set: formatInteger,
    default: 0,
  },
  gluerRunM: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  stripRunSpeed: {
    type: Number,
    required: true,
    set: formatInteger,
    default: 0,
  },
  stripRunM: {
    type: Number,
    required: true,
    set: formatFloat,
    default: 0,
  },
  pressMachine: {
    type: String,
    required: true,
    enum: ['bobst', 'ijima', 'heidelberg'],
    default: 'bobst',
  },
  rates: {
    type: rateSchema,
    required: true,
  },
  total: {
    type: Number,
    required: false,
    set: formatFloat,
    default: 0,
  },
});

quoteJobSchema.pre('validate', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  getRates(this, next);
});

const QuoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  customer: {
    type: {
      name: {
        type: String,
        required: true,
      },
      customerID: {
        type: String,
        required: true,
      },
    },
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
module.exports = { QuoteModel, RatesModel };
