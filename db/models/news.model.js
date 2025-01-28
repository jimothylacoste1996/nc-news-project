const db = require("../connection");
const articles = require("../data/test-data/articles");

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

function fetchArticles() {
  let SQLString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY 
  articles.article_id ORDER BY created_at DESC`;

  return db.query(SQLString).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ message: "no articles found" });
    } else {
      return response.rows;
    }
  });
}

function selectCommentsById(id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ message: "no comments found" });
      } else {
        return response.rows;
      }
    });
}

module.exports = {
  fetchTopics,
  selectArticleById,
  fetchArticles,
  selectCommentsById,
};
