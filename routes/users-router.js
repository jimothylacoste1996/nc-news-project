const usersRouter = require("express").Router();

const { getUsers } = require("../db/controllers/news.controller");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
