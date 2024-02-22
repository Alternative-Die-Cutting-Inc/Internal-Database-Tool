const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

const app = express();

const corsOptions = {
  credentials: true,
  origin: [process.env.CLIENT_BASE_URL, process.env.API_BASE_URL, 'https://beta.alternativedc.com'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  compression({
    level: 9,
    threshold: 1000*1000
  }),
);
module.exports = app;
