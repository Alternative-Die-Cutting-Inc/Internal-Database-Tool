const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  skids: {
    type: Number,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
    enum: ['cartons', 'sheets', 'pieces'],
    default: 'cartons',
  },
  quantity: {
    // Number of cartons, sheets, or pieces
    type: Number,
    required: true,
    default: 0,
  },
  cartonQuantity: {
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
  labelDate: {
    type: Date,
    required: true,
  },
  shipDate: {
    type: Date,
    required: false,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
  address: {
    type: {
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      notes: {
        type: String,
        required: false,
      },
    },
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
  forms: {
    type: [formSchema],
    required: true,
    default: [],
  },
});

const ShipmentModel = mongoose.model('Shipment', ShipmentSchema);

/**
 * Global Shipment objet
 * @typedef {typeof ShipmentModel.schema.obj} Shipment
 */
module.exports = ShipmentModel;
