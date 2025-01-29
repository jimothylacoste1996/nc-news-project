const topicsRouter = require("express").Router();

const { getTopics } = require("../db/controllers/news.controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
