/**
 * @fileoverview Customer services
 * Global Customer objet
 * @typedef {import("../models/CustomerModel").Customer} Customer
 */

const CustomerModel = require('../models/CustomerModel');

const customerServices = {
  /**
   * @description Get all customers or get customer by id
   * @param {String} id id of the customer
   * @returns {Customer | [Customer]}
   */
  async get(id) {
    if (id) {
      return CustomerModel.findById(id).then(
        (customer) => {
          if (!customer) throw new Error('CUSTOMER_NOT_FOUND');
          return customer;
        },
        (error) => {
          throw new Error('UNABLE_TO_GET_CUSTOMER', { cause: error });
        },
      );
    } else {
      return CustomerModel.find({}).then(
        (customers) => customers,
        (error) => {
          throw new Error('UNABLE_TO_GET_CUSTOMERS', { cause: error });
        },
      );
    }
  },

  /**
   * @description Get all customer names
   * @returns {[{name: String}]}
   */
  async getNames() {
    return CustomerModel.find({}, { name: 1 }).then(
      (customers) => customers,
      (error) => {
        throw new Error('UNABLE_TO_GET_CUSTOMERS', { cause: error });
      },
    );
  },

  /**
   * @description Create customer
   * @param {Customer} customer the customer data to create
   * @returns {Customer}
   */
  async create(customer) {
    return CustomerModel.create(customer).then(
      (customer) => customer,
      (error) => {
        throw new Error('UNABLE_TO_CREATE_CUSTOMER', { cause: error });
      },
    );
  },

  /**
   * @description Update customer
   * @param {String} id customer id
   * @param {Customer} fields fields to update
   * @returns {Customer}
   */
  async update(id, fields) {
    return CustomerModel.findOneAndUpdate({ _id: id }, fields, {
      new: true,
    }).then(
      (customer) => {
        if (!customer) throw new Error('CUSTOMER_NOT_FOUND');
        return customer;
      },
      (error) => {
        throw new Error('UNABLE_TO_UPDATE_CUSTOMER', { cause: error });
      },
    );
  },

  /**
   * @description Delete customer
   * @param {String} id customer id
   * @returns {Customer}
   */
  async delete(id) {
    return CustomerModel.findOneAndDelete({ _id: id }).then(
      (customer) => {
        if (!customer) throw new Error('CUSTOMER_NOT_FOUND');
        return customer;
      },
      (error) => {
        throw new Error('UNABLE_TO_DELETE_CUSTOMER', { cause: error });
      },
    );
  },
};

module.exports = customerServices;
