const db = require("../db/connection");

function checkCommentExists(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          message: "comment not found",
        });
      } else {
        return "comment exists";
      }
    });
}

function checkTopicExists(topic) {
  return db
    .query(`SELECT * FROM articles WHERE topic = $1`, [topic])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          message: "topic not found",
        });
      } else {
        return "topic exists";
      }
    });
}

function checkUserExists(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          message: "user not found",
        });
      } else {
        return true;
      }
    });
}

module.exports = { checkCommentExists, checkTopicExists, checkUserExists };
