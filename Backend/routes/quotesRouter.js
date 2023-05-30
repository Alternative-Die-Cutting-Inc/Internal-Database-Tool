const express = require("express");
const quoteServices = require("../services/quoteServices");

const router = express.Router();

/** 
 * 
 */
router.get("/", async (req, res, next) => {
  try {
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
