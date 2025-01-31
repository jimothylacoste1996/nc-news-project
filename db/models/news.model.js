const db = require("../connection");

const { checkCommentExists, checkTopicExists } = require("../../utils/utils");

function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then((response) => {
    return response.rows;
  });
}

function selectArticleById(id) {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id =$1
  GROUP BY 
  articles.article_id`,
      [id]
    )
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ message: "article not found" });
      } else {
        return response.rows[0];
      }
    });
}

function fetchArticles(sort_by = "created_at", order = "desc", topic = null) {
  const sortByGreenList = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];

  let SQLString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY 
  articles.article_id ORDER BY ${sort_by} ${order}`;

  if (sort_by && !sortByGreenList.includes(sort_by)) {
    return Promise.reject({ message: "invalid sort_by column" });
  }

  if (order && order !== "asc" && order !== "desc") {
    return Promise.reject({ message: "invalid order" });
  }

  if (topic) {
    return checkTopicExists(topic)
      .then(() => {
        return db.query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic = '${topic}'
  GROUP BY 
  articles.article_id ORDER BY created_at desc`);
      })
      .then((response) => {
        return response.rows;
      });
  }

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

function insertCommentById(newComment) {
  const { article_id, username, body } = newComment;
  const votes = 0;
  const date = new Date();

  return db
    .query(
      `INSERT INTO comments (article_id, author, body, votes, created_at)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [article_id, username, body, votes, date]
    )
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      throw err;
    });
}

function getCurrentVotes(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article not found",
        });
      } else {
        return db
          .query(`SELECT votes FROM articles WHERE article_id = $1`, [id])
          .then((response) => {
            return response.rows[0].votes;
          });
      }
    });
}

function getCurrentCommentVotes(id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "comment not found",
        });
      } else {
        return db
          .query(`SELECT votes FROM comments WHERE comment_id = $1`, [id])
          .then((response) => {
            return response.rows[0].votes;
          });
      }
    });
}

function updateArticleById(id, votes, currentVotes) {
  const newVotes = currentVotes + votes;

  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2`, [
      newVotes,
      id,
    ])
    .then(() => {
      return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
    })
    .then((response) => {
      return response.rows[0];
    });
}

function removeCommentById(id) {
  return checkCommentExists(id).then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
  });
}

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then((response) => {
    return response.rows;
  });
}

function selectUserByUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ message: "user not found" });
      } else {
        return response.rows[0];
      }
    });
}

function updateCommentById(id, votes, currentVotes) {
  const newVotes = currentVotes + votes;

  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "comment not found",
        });
      } else {
        return db
          .query(`UPDATE comments SET votes = $1 WHERE comment_id = $2`, [
            newVotes,
            id,
          ])
          .then(() => {
            return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [
              id,
            ]);
          })
          .then((response) => {
            return response.rows[0];
          })
          .catch((err) => {
            throw err;
          });
      }
    });
}

function insertArticle({ author, title, body, topic, article_img_url }) {
  const votes = 0;
  const date = new Date();
  const comment_count = 0;

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url,votes,created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [author, title, body, topic, article_img_url, votes, date]
    )
    .then(() => {
      return db
        .query(
          `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, COUNT(comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.created_at = $1
  GROUP BY 
  articles.article_id`,
          [date]
        )
        .then((result) => {
          return result.rows[0];
        });
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = {
  fetchTopics,
  selectArticleById,
  fetchArticles,
  selectCommentsById,
  insertCommentById,
  updateArticleById,
  getCurrentVotes,
  removeCommentById,
  fetchUsers,
  selectUserByUsername,
  updateCommentById,
  getCurrentCommentVotes,
  insertArticle,
};
