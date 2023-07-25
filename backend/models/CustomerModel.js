const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: {
    type: [
      {
        type: {
          type: String,
          enum: ['phone', 'email', 'fax'],
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        info: {
          type: String,
          set: (value) => value.toLowerCase(),
          required: true,
        },
      },
    ],
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
  memo: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['customer', 'supplier', 'perspective', 'client'],
    set: (value) => value.toLowerCase(),
    required: true,
  },
});

const CustomerModel = mongoose.model('Customer', CustomerSchema);

/**
 * Global Customer objet
 * @typedef {typeof CustomerModel.schema.obj} Customer
 */
module.exports = CustomerModel;
