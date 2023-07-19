const docketsRouter = require("../routes/docketsRouter");
const quotesRouter = require("../routes/quotesRouter");

const routerLoader = (app) => {
  app.use("/dockets", docketsRouter);
  app.use("/quotes", quotesRouter);
  //default route
  app.get("*", (req, res) => {
    res.status(200).send("Alternative Die Cutting Inc. Backend API");
  });
};

module.exports = routerLoader;
