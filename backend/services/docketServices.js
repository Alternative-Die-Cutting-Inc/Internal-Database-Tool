/**
 * @fileoverview Docket services
 * Global Docket objet
 * @typedef {import("../models/DocketModel").Docket} Docket
 */

const DocketModel = require('../models/DocketModel');
const { CounterModel } = require('../models/CounterModel');

const docketServices = {
  /**
   * @description Get all dockets or get docket by id
   * @param {String} id
   * @returns {[Docket] | Docket}
   */
  async get(id) {
    if (id) {
      return DocketModel.findById(id).then(
        (docket) => {
          if (!docket) throw new Error('DOCKET_NOT_FOUND');
          return docket;
        },
        (error) => {
          throw new Error('UNABLE_TO_GET_DOCKET', { cause: error });
        },
      );
    } else {
      return DocketModel.find({}).then(
        (dockets) => dockets,
        (error) => {
          throw new Error('UNABLE_TO_GET_DOCKETS', { cause: error });
        },
      );
    }
  },

  /**
   * @description Get docket by number
   * @param {String} number the docket number
   * @returns {Docket}
   */
  async getFromNum(number) {
    return DocketModel.findOne({ docketNumber: number }).then(
      (docket) => {
        if (!docket) throw new Error('DOCKET_NOT_FOUND');
        return docket;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_DOCKET', { cause: error });
      },
    );
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
        throw new Error('UNABLE_TO_CREATE_DOCKET', { cause: error });
      },
    );
    return responseDocket;
  },

  /**
   * @description Update docket
   * @param {String} id docket id
   * @param {Object} fields fields to update
   * @returns {Docket} updated docket
   */
  async update(id, fields) {
    return DocketModel.findOneAndUpdate({ _id: id }, fields, {
      new: true,
      returnDocument: 'after',
    }).then(
      (docket) => {
        if (!docket) throw new Error('DOCKET_NOT_FOUND');
        return docket;
      },
      (error) => {
        throw new Error('UNABLE_TO_UPDATE_DOCKET', { cause: error });
      },
    );
  },

  /**
   * @description Delete docket
   * @param {String} id docket number | _id
   * @returns {Docket}
   */
  async delete(id) {
    let responseDocket = null;
    responseDocket = DocketModel.findOneAndDelete({ _id: id }).then(
      (docket) => {
        if (!docket) throw new Error('DOCKET_NOT_FOUND');
        return docket;
      },
      (error) => {
        throw new Error('UNABLE_TO_DELETE_DOCKET', { cause: error });
      },
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
      { _id: 'docketNumber' },
      {},
      { upsert: true, new: true },
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
            },
          );
        }
        return counter.seq;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_COUNTER', { cause: error });
      },
    );
  },
};

module.exports = docketServices;
