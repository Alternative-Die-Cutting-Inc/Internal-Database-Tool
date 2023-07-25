const http = require('http');
const mongoLoader = require('./loaders/mongoLoader');
const passportLoader = require('./loaders/passportLoader');
const errorResponseMiddleware = require('./middlewares/errorResponseMiddleware');
const routerLoader = require('./loaders/routerLoader');
const app = require('./app');
require('dotenv').config();

mongoLoader(app).then(async () => {
  const server = http.createServer(app);
  passportLoader(app);
  routerLoader(app);
  app.use(errorResponseMiddleware);

  server.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
  });
});
