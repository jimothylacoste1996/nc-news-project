const { fetchTopics } = require("../models/news.model");
const endpointsJson = require("..//../endpoints.json");

function getJson(req, res, next) {
  res
    .status(200)
    .send({ endpoints: endpointsJson })
    .catch((err) => {
      next(err);
    });
}

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics, getJson };
