const mongoose = require("mongoose");
const getResponseObject = require("../utils/getResponseObject");

const validateName = function (name) {
  return !(name === "" || name === null || name === undefined);
};

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    validate: {
      validator: validateName,
      message: "MISSING_NAME",
    },
    required: [true, "MISSING_NAME"],
  },
  lastName: {
    type: String,
    validate: {
      validator: validateName,
      message: "MISSING_NAME",
    },
    required: [true, "MISSING_NAME"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  authScopes: {
    type: [String],
    required: true,
    default: [],
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  accountCreatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lastUpdatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

/**
 * Removes all fields from the user document which should not be sent in a response from the server.
 * @return {Object}
 */
UserSchema.methods.getResponseObject = getResponseObject;

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
