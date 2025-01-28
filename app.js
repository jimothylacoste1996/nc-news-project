const express = require("express");

const app = express();
const {
  getTopics,
  getJson,
  getArticleById,
  getArticles,
  getCommentsById,
  postCommentById,
  patchArticleById,
  deleteCommentById,
  getUsers,
} = require("./db/controllers/news.controller");

app.use(express.json());

app.get("/api", getJson);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentById);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.message === "invalid sort_by column" ||
    err.message === "invalid order"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (
    err.message === "article not found" ||
    err.message === "no comments found" ||
    err.message === "comment not found"
  ) {
    res.status(404).send({ msg: err.message });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;
