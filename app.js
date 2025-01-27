const express = require("express");
const endpointsJson = require("./endpoints.json");
const app = express();
const { getTopics, getJson } = require("./db/controllers/news.controller");

app.use(express.json());

app.get("/api", getJson);

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;
