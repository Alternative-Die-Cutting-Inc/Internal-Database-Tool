const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./CounterModel');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  notes: {
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
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  notes: {
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
    enum: ['commercial', 'packaging', 'nflute', 'other'],
    required: false,
  },
  soldFor: {
    type: Number,
    required: false,
  },
  die: {
    type: {
      standing: {
        type: Boolean,
        required: true,
      },
      dieID: {
        type: String,
        required: false,
      },
      dieType: {
        type: String,
        enum: ['H-die', 'B-die', 'other'],
        required: true,
      },
    },
    default: {
      standing: false,
      dieType: 'other',
      dieID: '',
    },
    required: false,
  },
  finishing: {
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
    default: Date.now(),
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
