const commentsRouter = require("express").Router();

const { deleteCommentById } = require("../db/controllers/news.controller");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
