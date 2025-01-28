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
} = require("./db/controllers/news.controller");

app.use(express.json());

app.get("/api", getJson);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postCommentById);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ error: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (
    err.message === "article not found" ||
    err.message === "no comments found"
  ) {
    res.status(404).send({ error: "Not Found" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;
