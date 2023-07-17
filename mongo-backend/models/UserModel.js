const mongoose = require("mongoose");

const validateName = function (name) {
  return !(name === "" || name === null || name === undefined);
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: validateName,
      message: "Username cannot be empty",
    },
    required: [true, "Username cannot be empty"],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
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

UserSchema.path("email").validate(function (value) {
  return this.model("User")
    .count({ email: value })
    .then(
      (count) => {
        if (count !== 0) {
          return false;
        }
        return true;
      },
      (error) => {
        return error;
      }
    );
}, "Email already exists");

const UserModel = mongoose.model("User", UserSchema);

/**
 * Global User objet
 * @typedef {typeof UserModel.schema.obj} User
 */
module.exports = UserModel;
