/**
 * @fileoverview Quote services
 * Global Quote objet
 * @typedef {import("../models/QuoteModel").Quote} Quote
 */

const QuoteModel = require("../models/QuoteModel");
const { CounterModel } = require("../models/CounterModel");

const quoteServices = {
  /**
   * @description Get all quotes or get quote by id
   * @param {String} id
   * @returns {[Quote] | Quote}
   */
  async get(id) {
    let responseQuote = null;
    if (id) {
      responseQuote = QuoteModel.findById(id).then(
        (quote) => quote,
        (error) => {
          throw error;
        }
      );
    } else {
      responseQuote = QuoteModel.find({}).then(
        (quotes) => quotes,
        (error) => {
          throw error;
        }
      );
    }
    return responseQuote;
  },

  /**
   * @description Create quote
   * @param {Quote} quote the object containing quote fields
   * @returns {Quote}
   */
  async create(quote) {
    let responseQuote = null;
    responseQuote = QuoteModel.create(quote).then(
      (quote) => quote,
      (error) => {
        throw error;
      }
    );
    return responseQuote;
  },

  /**
   * @description Update quote
   * @param {String} id quote number | _id
   * @param {Object} fields fields to update
   * @returns {Quote} updated quote
   */
  async update(id, fields) {
    let responseQuote = null;
    responseQuote = QuoteModel.findOneAndUpdate({ _id: id }, fields, {
      new: true,
    }).then(
      (quote) => quote,
      (error) => {
        throw error;
      }
    );
    return responseQuote;
  },

  /**
   * @description Delete quote
   * @param {String} id quote number | _id
   * @returns {Quote}
   */
  async delete(id) {
    let responseQuote = null;
    responseQuote = QuoteModel.findOneAndDelete({ _id: id }).then(
      (quote) => quote,
      (error) => {
        throw error;
      }
    );
    return responseQuote;
  },

  /** Helper Functions **/

  /**
   * @description start quote counter and return the count
   * @returns {Number} quote count
   */
  async initCounter() {
    return CounterModel.findOneAndUpdate(
      { _id: "quoteNumber" },
      {},
      { upsert: true, new: true }
    ).then(
      (counter) => {
        if (counter.seq === 0) {
          counter.seq = 185000;
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

module.exports = quoteServices;
