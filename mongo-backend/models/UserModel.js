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

UserSchema.path("email").validate(function (value, done) {
  this.model("User").count({ email: value }, function (error, count) {
    if (error) {
      return done(error);
    }
    // If `count` is greater than zero, "invalidate"
    done(!count);
  });
}, "Email already exists");

const UserModel = mongoose.model("User", UserSchema);

/**
 * Global User objet
 * @typedef {typeof UserModel.schema.obj} User
 */
module.exports = UserModel;
