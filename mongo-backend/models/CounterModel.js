const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    required: true,
  },
});

const CounterModel = mongoose.model("Counter", CounterSchema);

module.exports = CounterModel;
