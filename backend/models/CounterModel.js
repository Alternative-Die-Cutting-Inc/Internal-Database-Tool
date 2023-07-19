const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    required: true,
    default: 0,
  },
});

const CounterModel = mongoose.model("Counter", CounterSchema);

/**
 * @description Auto increment counter and assign to document
 * @param {String} counterName name of the counter
 * @param {Object} doc document to increment
 * @param {Function} next callback function
 */
const autoIncrementModelID = function (counterName, doc, next) {
  CounterModel.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).then(
    (counter) => {
      doc[counterName] = counter.seq;
      next();
    },
    (error) => {
      next(error);
    }
  );
};

module.exports = { CounterModel, autoIncrementModelID };
