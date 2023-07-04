const mongoose = require("mongoose");

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

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
