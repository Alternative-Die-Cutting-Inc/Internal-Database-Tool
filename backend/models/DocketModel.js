const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./CounterModel');

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
  },
  formQuantity: {
    type: Number,
    required: true,
  },
  formNotes: {
    type: String,
    required: false,
  },
  quantityShipped: {
    type: Number,
    required: false,
    default: 0,
  },
  lastShipmentDate: {
    type: Date,
    required: false,
  },
});

const extraChargeSchema = new mongoose.Schema({
  chargeName: {
    type: String,
    required: true,
  },
  chargeCost: {
    type: Number,
    required: true,
  },
  chargeNotes: {
    type: String,
    required: false,
  },
});

const DocketSchema = new mongoose.Schema({
  docketNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  quoteNumber: {
    type: Number,
    required: false,
  },
  quoteJob: {
    type: String,
    required: false,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPO: {
    type: String,
    required: false,
  },
  productionPerson: {
    type: String,
    required: false,
  },
  jobName: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: false,
  },
  soldFor: {
    type: Number,
    required: false,
  },
  dieID: {
    type: Number,
    required: false,
  },
  dieType: {
    type: String,
    required: false,
  },
  finishing: {
    type: String,
    required: false,
  },
  specialInstructions: {
    type: String,
    required: false,
  },
  forms: [formSchema],
  extraCharges: [extraChargeSchema],
  requoteMemo: {
    type: String,
    required: false,
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  numOfUnits: {
    type: Number,
    required: false,
  },
  closeDate: {
    type: Date,
    required: false,
  },
  status: {
    type: [String],
    required: false,
  },
});

DocketSchema.pre('validate', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('docketNumber', this, next);
});

const DocketModel = mongoose.model('Docket', DocketSchema);

/**
 * Global Docket objet
 * @typedef {typeof DocketModel.schema.obj} Docket
 */

module.exports = DocketModel;
