const mongoose = require('mongoose');

const uniqueValidator = async function (value) {
  const query = { name: value };
  if (this.isNew || this.isModified('name')) {
    query._id = { $ne: this._id };
  }
  const count = await this.constructor.countDocuments(query);
  return count === 0;
};

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
    default: [],
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
  premium: {
    type: Number,
    required: true,
    default: 1,
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

CustomerSchema.path('name').validate({
  validator: uniqueValidator,
  message: 'This value already exists.',
});

const CustomerModel = mongoose.model('Customer', CustomerSchema);

/**
 * Global Customer objet
 * @typedef {typeof CustomerModel.schema.obj} Customer
 */
module.exports = CustomerModel;
