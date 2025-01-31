const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  patchArticleById,
  getCommentsById,
  postCommentById,
  postArticle,
} = require("../db/controllers/news.controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsById);

articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.post("/", postArticle);

articlesRouter.post("/:article_id/comments", postCommentById);

module.exports = articlesRouter;
