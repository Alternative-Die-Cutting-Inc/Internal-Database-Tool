/**
 * @fileoverview User services
 * Global User objet
 * @typedef {import("../models/UserModel").User} User
 */

const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

const userServices = {
  /**
   * Validates the password for a user.
   * @param {String} password
   * @return {Boolean|Error}
   */
  async validateUser(username, password) {
    const passwordValidator =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`_=^:();<>+-.@$!%*#?&])[A-Za-z0-9@$_=!%:*#?&.]/;
    if (!passwordValidator.test(password)) {
      throw new Error('INVALID_PASSWORD');
    }
    await UserModel.findOne({ username }).then((user) => {
      if (user) {
        throw new Error('DUPLICATE_USERNAME');
      }
    });
    return 0;
  },

  /**
   * Creates a new user in database.
   * @param {String} email
   * @param {String} password
   * @param {String} username
   * @return {User} user object
   */
  async create({ username, password, email, firstName, lastName }) {
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
            throw new Error('UNABLE_TO_CREATE_USER', { cause: error });
          },
        ),
      (error) => {
        throw new Error('UNABLE_TO_PROCESS_PASSWORD', { cause: error });
      },
    );

    return responseUser;
  },

  /**
   * Get all users.
   * @return {User[]} user object
   */
  async getAll() {
    const users = await UserModel.find({});
    return users;
  },
};

module.exports = userServices;
