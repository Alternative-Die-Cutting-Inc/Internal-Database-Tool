// const froshRouter = require('../routes/froshRoutes');
// const userRouter = require('../routes/userRoutes');
// const timelineRouter = require('../routes/timelineRoutes');
// const faqRouter = require('../routes/faqRoutes');
// const paymentRouter = require('../routes/paymentRoutes');
// const announcementRouter = require('../routes/announcementRoutes');
// const qrRouter = require('../routes/qrRoutes');
// const scuntRouter = require('../routes/scuntRoutes');
// const scuntMissionRouter = require('../routes/scuntMissionRoutes');
// const scuntTeamRouter = require('../routes/scuntTeamRoutes');
// const scuntGameSettingsRouter = require('../routes/scuntGameSettingsRoutes');
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
