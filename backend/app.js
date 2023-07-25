const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  credentials: true,
  origin: [process.env.CLIENT_BASE_URL, process.env.API_BASE_URL],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

module.exports = app;
