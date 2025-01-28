const {
  fetchTopics,
  selectArticleById,
  fetchArticles,
} = require("../models/news.model");
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
      next(err);
    });
}
function getArticles(req, res, next) {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics, getJson, getArticleById, getArticles };
