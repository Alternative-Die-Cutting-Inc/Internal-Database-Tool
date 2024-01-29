/**
 * @fileoverview Quote services
 * Global Quote objet
 * @typedef {import("../models/QuoteModel").Quote} Quote
 */

const { QuoteModel, RatesModel } = require('../models/QuoteModel');
const { CounterModel } = require('../models/CounterModel');

const quoteServices = {
  /**
   * @description Get all quotes or get quote by id
   * @param {String} id
   * @returns {[Quote] | Quote}
   */
  async get(id) {
    if (id) {
      return QuoteModel.findById(id).then(
        (quote) => {
          if (!quote) throw new Error('QUOTE_NOT_FOUND');
          return quote;
        },
        (error) => {
          throw new Error('UNABLE_TO_GET_QUOTE', { cause: error });
        },
      );
    } else {
      return QuoteModel.find(
        {},
        {
          quoteNumber: 1,
          customer: 1,
          jobName: 1,
          description: 1,
          notes: 1,
          'quoteJobs.units': 1,
          'quoteJobs.perSheet': 1,
          'quoteJobs.total': 1,
          status: 1,
          creationDate: 1,
        },
      )
        .sort({ quoteNumber: -1 })
        .then(
          (quotes) => quotes,
          (error) => {
            throw new Error('UNABLE_TO_GET_QUOTES', { cause: error });
          },
        );
    }
  },

  /**
   * @description Get all global rates
   * @returns {Rates[]}
   */
  async getRates() {
    return RatesModel.findOne({}, { _id: 0, __v: 0 }).then(
      (rates) => {
        if (!rates) throw new Error('RATES_NOT_FOUND');
        return rates;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_RATES', { cause: error });
      },
    );
  },

  async search(query, filters) {
    return QuoteModel.find(query, filters).then(
      (quotes) => {
        if (!quotes.length) throw new Error('QUOTES_NOT_FOUND');
        return quotes;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_QUOTES', { cause: error });
      },
    );
  },

  /**
   * @description Get quote by number
   * @param {String} number the quote number
   * @returns {Quote}
   */
  async getFromNum(number) {
    return QuoteModel.findOne({ quoteNumber: number }).then(
      (quote) => {
        if (!quote) throw new Error('QUOTE_NOT_FOUND');
        return quote;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_QUOTE', { cause: error });
      },
    );
  },

  /**
   * @description Create quote
   * @param {Quote} quote the object containing quote fields
   * @returns {Quote}
   */
  async create(quote) {
    if (quote.copy !== '') {
      const copyQuote = await QuoteModel.findOne({ quoteNumber: quote.copy }).then(
        (quote) => {
          if (!quote) throw new Error('QUOTE_NOT_FOUND');
          return quote;
        },
        (error) => {
          throw new Error('UNABLE_TO_GET_QUOTE', { cause: error });
        },
      );
      const newQuote = await QuoteModel.create(quote).then(
        (quote) => quote,
        (error) => {
          throw new Error('UNABLE_TO_CREATE_QUOTE', { cause: error });
        },
      );
      copyQuote.quoteJobs.map((job) => {
        newQuote.quoteJobs.push({
          units: job.units,
          perSheet: job.perSheet,
          clientNotes: job.clientNotes,
          internalNotes: job.internalNotes,
          extraCharges: job.extraCharges,
          dieHours: job.dieHours,
          dieSetup: job.dieSetup,
          dieRunSpeed: job.dieRunSpeed,
          dieRunM: job.dieRunM,
          gluerSetupHours: job.gluerSetupHours,
          gluerRunSpeed: job.gluerRunSpeed,
          gluerRunM: job.gluerRunM,
          stripRunSpeed: job.stripRunSpeed,
          stripRunM: job.stripRunM,
          pressMachine: job.pressMachine,
        });
      });
      return newQuote.save().then(
        (quote) => quote,
        (error) => {
          throw new Error('UNABLE_TO_UPDATE_QUOTE', { cause: error });
        },
      );
    }
    return QuoteModel.create(quote).then(
      (quote) => quote,
      (error) => {
        throw new Error('UNABLE_TO_CREATE_QUOTE', { cause: error });
      },
    );
  },

  /**
   * @description Update quote
   * @param {String} id quote number | _id
   * @param {Object} fields fields to update
   * @returns {Quote} updated quote
   */
  async update(id, fields) {
    return QuoteModel.findOneAndUpdate({ _id: id }, fields, {
      new: true,
    }).then(
      (quote) => {
        if (!quote) throw new Error('QUOTE_NOT_FOUND');
        return quote;
      },
      (error) => {
        throw new Error('UNABLE_TO_UPDATE_QUOTE', { cause: error });
      },
    );
  },

  /**
   * @description Update quote job fields
   * @param {String} quoteID quote _id
   * @param {String} jobID job _id
   * @param {Object} fields job fields to update
   * @returns {Quote} updated quote
   */
  async updateJob(quoteID, jobID, fields) {
    // Get the quote thats being updated
    const quote = await QuoteModel.findById(quoteID).then(
      (quote) => {
        if (!quote) throw new Error('QUOTE_NOT_FOUND');
        return quote;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_QUOTE', { cause: error });
      },
    );
    // Get the job thats being updated
    const job = quote.quoteJobs.id(jobID);
    if (!job) throw new Error('JOB_NOT_FOUND');

    // Update the job fields
    job.set(fields);

    // Save the quote
    return quote.save().then(
      (quote) => quote,
      (error) => {
        throw new Error('UNABLE_TO_UPDATE_QUOTE', { cause: error });
      },
    );
  },

  /**
   * @description Update rates
   * @param {Rates} newRates An array of rates
   * @returns {Rates} updated rates
   */
  async updateRates(newRates) {
    return RatesModel.findOneAndUpdate({}, newRates, {
      projection: {
        _id: 0,
        __v: 0,
      },
      returnDocument: 'after',
    }).then(
      (rates) => {
        if (!rates) throw new Error('RATES_NOT_FOUND');
        return rates;
      },
      (error) => {
        throw new Error('UNABLE_TO_UPDATE_RATES', { cause: error });
      },
    );
  },

  async addJob(quoteID, fields) {
    return QuoteModel.findById(quoteID).then(
      (quote) => {
        if (!quote) throw new Error('QUOTE_NOT_FOUND');
        quote.quoteJobs.push({ ...fields });
        return quote.save().then(
          (quote) => quote,
          (error) => {
            throw new Error('UNABLE_TO_UPDATE_QUOTE', { cause: error });
          },
        );
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_QUOTE', { cause: error });
      },
    );
  },

  /**
   * @description Delete quote
   * @param {String} id quote number | _id
   * @returns {Quote}
   */
  async delete(id) {
    return QuoteModel.findOneAndDelete({ _id: id }).then(
      (quote) => {
        if (!quote) throw new Error('QUOTE_NOT_FOUND');
        return quote;
      },
      (error) => {
        throw new Error('UNABLE_TO_DELETE_QUOTE', { cause: error });
      },
    );
  },

  /** Helper Functions **/

  /**
   * @description start quote counter and return the count
   * @returns {Number} quote count
   */
  async initCounter() {
    return CounterModel.findOneAndUpdate(
      { _id: 'quoteNumber' },
      {},
      { upsert: true, new: true },
    ).then(
      (counter) => {
        if (counter.seq === 0) {
          counter.seq = 185000;
          counter.save().then(
            (counter) => {
              return counter.seq;
            },
            (error) => {
              throw new Error('UNABLE_TO_UPDATE_COUNTER', { cause: error });
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

  /**
   * @description Initialize quote rates
   * @returns {Boolean} true if rates are newly created
   */
  async initRates() {
    return RatesModel.findOneAndUpdate({}, {}, { upsert: true, new: true }).then(
      (rates) => {
        if (!rates.global) {
          rates.global = 1;
          rates.die = 1;
          rates.gluer = 1;
          rates.strip = 1;
          rates.bobst = 1;
          rates.heidelberg = 1;
          return rates.save().then(
            (rates) => {
              return true;
            },
            (error) => {
              throw new Error('UNABLE_TO_UPDATE_RATES', { cause: error });
            },
          );
        }
        return false;
      },
      (error) => {
        throw new Error('UNABLE_TO_GET_RATES', { cause: error });
      },
    );
  },
};

module.exports = quoteServices;
