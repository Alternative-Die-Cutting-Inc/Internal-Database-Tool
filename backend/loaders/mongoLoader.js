const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const docketServices = require('../services/docketServices');
const quoteServices = require('../services/quoteServices');

const loadMongo = async (app) => {
  console.log('Loading mongo...');
  const { MONGODB_PASSWORD, MONGODB_USER } = process.env;
  const mongoURI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@localhost:27017/internal?authSource=admin`;

  await mongoose.connect(mongoURI);
  // mongoose.set('debug', true); // uncomment this if you have issues with mongo and want to debug
  console.log('Connected to mongo!');
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.USER_SESSION_SECRET,
      store: new MongoStore({
        mongoUrl: mongoURI,
        crypto: { secret: process.env.SESSION_SECRET },
      }),
    }),
  );
  const docketCount = await docketServices.initCounter();
  const quoteCount = await quoteServices.initCounter();
  const newRates = await quoteServices.initRates();
  console.log(`Docket count: ${docketCount}`);
  console.log(`Quote count: ${quoteCount}`);
  console.log(`Rates created: `, newRates);
};

module.exports = loadMongo;
