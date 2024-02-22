const docketsRouter = require('../routes/docketsRouter');
const quotesRouter = require('../routes/quotesRouter');
const shipmentsRouter = require('../routes/shipmentsRouter');
const customerRouter = require('../routes/customerRouter');
const userRouter = require('../routes/userRouter');
const loadData = require('../services/oldDataService');
const routerLoader = (app) => {
  app.use('/dockets', docketsRouter);
  app.use('/quotes', quotesRouter);
  app.use('/shipments', shipmentsRouter);
  app.use('/user', userRouter);
  app.use('/customers', customerRouter);
  //default route
  app.get('*', (req, res) => {
    res.status(200).send('Alternative Die Cutting Inc. Backend API');
  });

  app.post('/loadData', (req, res) => {
    const lol = loadData();
    res.status(200).send(lol);
  });
};

module.exports = routerLoader;
