const usersRouter = require("express").Router();

const {
  getUsers,
  getUserByUsername,
} = require("../db/controllers/news.controller");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
