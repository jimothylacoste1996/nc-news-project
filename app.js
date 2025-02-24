const express = require("express");

const cors = require("cors");

const apiRouter = require("./routes/api-router");

const { getJson } = require("./db/controllers/news.controller");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.get("/api", getJson);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  const errCodes = [
    "22P02",
    "23502",
    "23503",
    "invalid sort_by column",
    "invalid order",
  ];

  if (errCodes.includes(err.code) || errCodes.includes(err.message)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const errMsgs = [
    "article not found",
    "no comments found",
    "comment not found",
    "topic not found",
    "user not found",
  ];

  if (errMsgs.includes(err.message)) {
    res.status(404).send({ msg: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
