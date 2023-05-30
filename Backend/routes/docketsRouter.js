const express = require("express");
const docketServices = require("../services/docketServices");

const router = express.Router();

/**
 *
 */
router.get("/", async (req, res, next) => {
  try {
    const data = await docketServices.get();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
