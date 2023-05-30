const express = require("express");
const shippingServices = require("../services/shippingServices");

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
