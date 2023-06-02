/**
 * 
 */

const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const docketsRouter = require("./routes/docketsRouter");
const quotesRouter = require("./routes/quotesRouter");
const shippingRouter = require("./routes/shippingRouter");

const corsOptions = {
  credentials: true,
  origin: [
    process.env.FRONTEND_BASE_URL,
    process.env.BACKEND_BASE_URL,
    "http://localhost:5173",
  ],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/quotes", quotesRouter);
app.use("/dockets", docketsRouter);
app.use("/shipping", shippingRouter);

app.get("/*", function (req, res) {
  res.send("Alternative Die Cutting Inc. Backend API");
});

app.listen(port);
console.log("server started on port " + port);
