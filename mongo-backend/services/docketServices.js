/**
 * @fileoverview Docket services
 */

const DocketModel = require("../models/docketModel");
/**
 * Global Docket objet
 * @typedef {import("../models/docketModel").Docket} Docket
 */

const docketServices = {
  /**
   * @description Get all dockets or get docket by id
   * @param {String} id
   * @returns {[Docket] | Docket}
   */
  async get(id) {
    let responseDocket = null;
    if (id) {
      responseDocket = DocketModel.findById(id).then(
        (docket) => docket,
        (err) => {
          throw err;
        }
      );
    } else {
      responseDocket = DocketModel.find({}).then(
        (dockets) => dockets,
        (err) => {
          throw err;
        }
      );
    }
    return responseDocket;
  },

  /**
   * @description Create docket
   * @param {Docket} docket the object containing docket fields
   * @returns {Docket}
   */
  async createDocket(docket) {
    let responseDocket = null;
    return responseDocket;
  },

  /**
   * @description Update docket
   * @param {String} id docket number | _id
   * @param {Object} fields fields to update
   * @returns {Docket} updated docket
   */
  async updateDocket(id, fields) {
    let responseDocket = null;
    return responseDocket;
  },

  /**
   * @description Delete docket
   * @param {String} id docket number | _id
   * @returns {Docket}
   */
  async deleteDocket(id) {
    let responseDocket = null;
    return responseDocket;
  },
};

module.exports = docketServices;
