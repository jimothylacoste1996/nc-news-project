const {
  fetchTopics,
  selectArticleById,
  fetchArticles,
  selectCommentsById,
  insertCommentById,
  updateArticleById,
  getCurrentVotes,
  removeCommentById,
  fetchUsers,
  selectUserByUsername,
  updateCommentById,
  getCurrentCommentVotes,
  insertArticle,
} = require("../models/news.model");
const endpointsJson = require("..//../endpoints.json");
const { checkCommentExists } = require("../../utils/utils");

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
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;

  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsById(req, res, next) {
  const id = req.params.article_id;

  selectCommentsById(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentById(req, res, next) {
  const newComment = req.body;
  // if (
  //   newComment.username === undefined ||
  //   newComment.body === undefined ||
  //   typeof newComment.username !== "string" ||
  //   typeof newComment.body !== "string"
  // ) {
  //   res.status(400).send({ msg: "Bad Request" });
  // }
  newComment.article_id = req.params.article_id;

  insertCommentById(newComment)
    .then(() => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleById(req, res, next) {
  const votes = req.body.inc_votes;
  const id = req.params.article_id;

  if (typeof votes !== "number" || votes === undefined) {
    res.status(400).send({ msg: "Bad Request" });
  }

  getCurrentVotes(id)
    .then((currentVotes) => {
      return updateArticleById(id, votes, currentVotes).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteCommentById(req, res, next) {
  const id = req.params.comment_id;

  removeCommentById(id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

function getUsers(req, res, next) {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserByUsername(req, res, next) {
  const username = req.params.username;

  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
}

function patchCommentById(req, res, next) {
  const id = req.params.comment_id;
  const votes = req.body.inc_votes;

  getCurrentCommentVotes(id)
    .then((currentVotes) => {
      return updateCommentById(id, votes, currentVotes).then((comment) => {
        res.status(200).send({ comment });
      });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next) {
  const newArticle = req.body;

  insertArticle(newArticle)
    .then((insertedArticle) => {
      res.status(201).send({ article: insertedArticle });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getTopics,
  getJson,
  getArticleById,
  getArticles,
  getCommentsById,
  postCommentById,
  patchArticleById,
  deleteCommentById,
  getUsers,
  getUserByUsername,
  patchCommentById,
  postArticle,
};
