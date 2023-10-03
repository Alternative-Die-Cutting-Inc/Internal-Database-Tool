const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
  credentials: true,
  origin: [process.env.CLIENT_BASE_URL, process.env.API_BASE_URL, 'https://beta.alternativedc.com'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

module.exports = app;
