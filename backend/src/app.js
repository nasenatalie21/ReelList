const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const { CLIENT_URL } = require("./config/env");

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
