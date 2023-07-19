/**
 * @fileoverview quote router
 * @baseURL /quotes
 * Global Quote object
 * @typedef {import("../models/QuoteModel").Quote} Quote
 */
const express = require("express");
const quoteServices = require("../services/quoteServices");

const router = express.Router();

/**
 * @description get all quotes
 * @route GET /quotes
 * @returns {[Quote] | Quote} quote objects
 */
router.get("/", async (req, res, next) => {
  try {
    const allQuotes = await quoteServices.get();
    if (allQuotes.length === 0) {
      res.status(404).send({ message: "No quotes found" });
    } else {
      res.status(200).send(allQuotes);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @description get quote by id
 * @route GET /quotes/:id
 * @returns {Quote} quote object
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseQuote = await quoteServices.get(id);
    if (!responseQuote) {
      res.status(404).send({ message: "No quote found" });
    } else {
      res.status(200).send(responseQuote);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @description create quote
 * @route POST /quotes
 * @returns {Quote} quote object
 */
router.post("/", async (req, res, next) => {
  try {
    const newQuote = req.body.quote;
    const responseQuote = await quoteServices.create(newQuote);
    res.status(201).send(responseQuote);
  } catch (error) {
    next(error);
  }
});

/**
 * @description edit quote
 * @route PUT /quotes/:id
 * @returns {Quote} edited quote object
 */
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const editFields = req.body.fields;
    const responseQuote = await quoteServices.update(id, editFields);
    if (!responseQuote) {
      res.status(404).send({ message: "No quote found" });
    } else {
      res.status(200).send(responseQuote);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @description delete quote
 * @route DELETE /quotes/:id
 * @returns {Quote} deleted quote object
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseQuote = await quoteServices.delete(id);
    if (!responseQuote) {
      res.status(404).send({ message: "No quote found" });
    } else {
      res.status(200).send(responseQuote);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
