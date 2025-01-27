const { fetchTopics, selectArticleById } = require("../models/news.model");
const convertTimestampToDate = require("../seeds/utils");
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

function getArticleById(req, res, next) {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log("here");
      next(err);
    });
}

module.exports = { getTopics, getJson, getArticleById };
