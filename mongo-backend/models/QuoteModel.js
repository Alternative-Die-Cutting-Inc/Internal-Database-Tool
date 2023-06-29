const mongoose = require("mongoose");

const quoteJobSchema = new mongoose.Schema({});

const QuoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  jobName: {
    type: String,
    required: true,
  },
  attention: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },

  quoteJobs: [quoteJobSchema],
});

const QuoteModel = mongoose.model("Quote", QuoteSchema);

module.exports = QuoteModel;
