/**
 * @fileoverview User services
 * Global User objet
 * @typedef {import("../models/UserModel").User} User
 */

const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

const userServices = {
  /**
   * Validates the password for a user.
   * @param {String} password
   * @return {Boolean|Error}
   */
  async validatePassword(password) {
    const passwordValidator =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`_=^:();<>+-.@$!%*#?&])[A-Za-z0-9@$_=!%:*#?&.]/;
    if (!passwordValidator.test(password)) {
      return new Error("Password is not valid.");
    }
    return 0;
  },

  /**
   * Creates a new user in database.
   * @param {String} email
   * @param {String} password
   * @param {String} username
   * @return {User} user object
   */
  async create(email, password, username, firstName, lastName) {
    let responseUser = null;
    responseUser = bcrypt.hash(password, 10).then(
      (hashedPassword) =>
        UserModel.create({
          email,
          hashedPassword,
          username,
          firstName,
          lastName,
        }).then(
          (user) => user,
          (error) => {
            throw error;
          }
        ),
      (error) => {
        throw error;
      }
    );

    return responseUser;
  },
};

module.exports = userServices;
