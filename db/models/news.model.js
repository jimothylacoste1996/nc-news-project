const db = require("../connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then((response) => {
    return response.rows;
  });
}

function selectArticleById(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [id])
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ message: "article not found" });
      } else {
        return response.rows[0];
      }
    });
}

module.exports = { fetchTopics, selectArticleById };
