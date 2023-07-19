/**
 * @fileoverview Docket services
 * Global Docket objet
 * @typedef {import("../models/DocketModel").Docket} Docket
 */

const DocketModel = require("../models/DocketModel");
const { CounterModel } = require("../models/CounterModel");

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
        (error) => {
          throw error;
        }
      );
    } else {
      responseDocket = DocketModel.find({}).then(
        (dockets) => dockets,
        (error) => {
          throw error;
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
  async create(docket) {
    let responseDocket = null;
    responseDocket = DocketModel.create(docket).then(
      (docket) => docket,
      (error) => {
        throw error;
      }
    );
    return responseDocket;
  },

  /**
   * @description Update docket
   * @param {String} id docket number | _id
   * @param {Object} fields fields to update
   * @returns {Docket} updated docket
   */
  async update(id, fields) {
    let responseDocket = null;
    responseDocket = DocketModel.findOneAndUpdate({ _id: id }, fields, {
      new: true,
    }).then(
      (docket) => docket,
      (error) => {
        throw error;
      }
    );
    return responseDocket;
  },

  /**
   * @description Delete docket
   * @param {String} id docket number | _id
   * @returns {Docket}
   */
  async delete(id) {
    let responseDocket = null;
    responseDocket = DocketModel.findOneAndDelete({ _id: id }).then(
      (docket) => docket,
      (error) => {
        throw error;
      }
    );
    return responseDocket;
  },

  /** Helper Functions **/

  /**
   * @description start docket counter and return the count
   * @returns {Number} docket count
   */
  async initCounter() {
    return CounterModel.findOneAndUpdate(
      { _id: "docketNumber" },
      {},
      { upsert: true, new: true }
    ).then(
      (counter) => {
        if (counter.seq === 0) {
          counter.seq = 45000;
          counter.save().then(
            (counter) => {
              return counter.seq;
            },
            (error) => {
              throw error;
            }
          );
        }
        return counter.seq;
      },
      (error) => {
        throw error;
      }
    );
  },
};

module.exports = docketServices;
