const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./CounterModel');

const extraChargeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
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

const rateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  // press: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // gluer: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // strip: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // die: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // customer_premium: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // global_premium: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
});

const RatesModel = mongoose.model('Rates', rateSchema);

/**
 * @description Add database rates to job
 * @param {Object} doc document to increment
 * @param {Function} next callback function
 */
const getRates = function (job, next) {
  RatesModel.find({}).then(
    (rates) => {
      if (!rates) throw new Error('NO_RATES_FOUND');
      job.rates = rates;
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
  rates: {
    type: [rateSchema],
    required: true,
    default: {},
  },
  total: {
    type: Number,
    required: false,
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
module.exports = { QuoteModel, RatesModel };
