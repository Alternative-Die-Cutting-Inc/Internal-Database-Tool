const http = require('http');
const mongoLoader = require('./loaders/mongoLoader');
const passportLoader = require('./loaders/passportLoader');
const errorResponseMiddleware = require('./middlewares/errorResponseMiddleware');
const routerLoader = require('./loaders/routerLoader');
const app = require('./app');

mongoLoader(app).then(async () => {
  const server = http.createServer(app);
  passportLoader(app);
  routerLoader(app);
  app.use(errorResponseMiddleware);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
