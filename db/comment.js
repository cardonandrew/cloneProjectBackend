//! Ill need a getCommentsbyPostId, createComment,
//! editComment, and deleteComment
const client = require("./client.js");

async function getAllComments() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM comments
    `);
    return rows;
  } catch (error) {
    console.log("Could not get all comments from DB");
    return;
  }
}

async function createComment({ username, isVerified, comment, postId }) {
  try {
    const { rows } = await client.query(
      `
          INSERT INTO comments(username, "isVerified", comment, "postId")
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `,
      [username, isVerified, comment, postId]
    );

    return rows;
  } catch (error) {
    console.log(error);
    return;
  }
}

async function getCommentsByPostId(postId) {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
      SELECT comment FROM comments
      WHERE "postId" = $1;
      `,
      [postId]
    );

    return comment;
  } catch (error) {
    console.log("Error in getPostById");
    throw error;
  }
}

module.exports = {
  getAllComments,
  createComment,
  getCommentsByPostId,
};
