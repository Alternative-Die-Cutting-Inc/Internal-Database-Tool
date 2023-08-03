/**
 * @fileoverview quote router
 * @baseURL /quotes
 * Global Quote object
 * @typedef {import("../models/QuoteModel").Quote} Quote
 */
const express = require('express');
const quoteServices = require('../services/quoteServices');

const router = express.Router();

/**
 * @description get all quotes
 * @route GET /quotes
 * @returns {[Quote] | Quote} quote objects
 */
router.get('/', async (req, res, next) => {
  try {
    const allQuotes = await quoteServices.get();
    res.status(200).send({ quotes: allQuotes });
  } catch (error) {
    next(error);
  }
});

/**
 * @description get quote by id
 * @route GET /quotes/:id
 * @returns {Quote} quote object
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseQuote = await quoteServices.get(id);
    res.status(200).send({ quote: responseQuote });
  } catch (error) {
    next(error);
  }
});

/**
 * @description get quote by number
 * @route GET /quotes/number/:number
 * @returns {Quote} quote object
 */
router.get('/number/:number', async (req, res, next) => {
  try {
    const number = req.params.number;
    const responseQuote = await quoteServices.getFromNum(number);
    res.status(200).send({ quote: responseQuote });
  } catch (error) {
    next(error);
  }
});

/**
 * @description create quote
 * @route POST /quotes
 * @returns {Quote} quote object
 */
router.post('/', async (req, res, next) => {
  try {
    const newQuote = req.body.quote;
    const responseQuote = await quoteServices.create(newQuote);
    res.status(201).send({ quote: responseQuote });
  } catch (error) {
    next(error);
  }
});

/**
 * @description edit quote
 * @route PUT /quotes/:id
 * @returns {Quote} edited quote object
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const editFields = req.body.fields;
    const responseQuote = await quoteServices.update(id, editFields);

    res.status(200).send({ quote: responseQuote });
  } catch (error) {
    next(error);
  }
});

/**
 * @description edit quote job
 * @route PUT /quotes/:quoteID/:jobID
 * @returns {Quote} edited quote object
 */
router.put('/:quoteID/:jobID', async (req, res, next) => {
  try {
    const quoteID = req.params.quoteID;
    const jobID = req.params.jobID;
    const editFields = req.body.fields;
    const responseQuote = await quoteServices.updateJob(quoteID, jobID, editFields);

    res.status(200).send({ quote: responseQuote });
  } catch (error) {
    next(error);
  }
});

/**
 * @description delete quote
 * @route DELETE /quotes/:id
 * @returns {Quote} deleted quote object
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseQuote = await quoteServices.delete(id);
    res.status(200).send({ quote: responseQuote });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
