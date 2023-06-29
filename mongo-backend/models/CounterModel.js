const mongoose = require("mongoose");
const { count } = require("./UserModel");

const CounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    required: true,
    default: 44300,
  },
});

const CounterModel = mongoose.model("Counter", CounterSchema);

module.exports = CounterModel;
