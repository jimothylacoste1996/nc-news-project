const db = require("./db/connection");

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

module.exports = checkTopicExists;
