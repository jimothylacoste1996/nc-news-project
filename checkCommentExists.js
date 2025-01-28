const db = require("./db/connection");

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

module.exports = checkCommentExists;
