const client = require("./client.js");

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM posts
    `);
    return rows;
  } catch (error) {
    console.log("Could not get all posts from DB");
    return;
  }
}

async function getPostById(postId) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      SELECT * FROM posts
      WHERE id = $1;
      `,
      [postId]
    );

    return post;
  } catch (error) {
    console.log("Error in getPostById");
    throw error;
  }
}

async function createPost({
  username,
  tweet,
  isVerified,
  imageUrl,
  profileImage,
}) {
  try {
    const { rows } = await client.query(
      `
          INSERT INTO posts(username,
            tweet,
            "isVerified",
            "imageUrl",
            "profileImage")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `,
      [username, tweet, isVerified, imageUrl, profileImage]
    );

    return rows;
  } catch (error) {
    console.log(error);
    return;
  }
}

async function updatePost(postId, fields) {
  console.log("fields>>>>>>>>", fields);

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  console.log("setString", setString);
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      UPDATE posts
      SET ${setString}
      WHERE id = ${postId}
      RETURNING *;
  `,
      Object.values(fields)
    );

    console.log(post);
    return post;
  } catch (error) {
    console.log("Error in updatePost function");
    throw error;
  }
}

async function deletePost(id) {
  try {
    const { rows } = await client.query(
      `
             DELETE FROM posts
             WHERE id=$1;
            `,
      [id]
    );

    return rows;
  } catch (error) {
    return {
      error: "Error deleting post!",
    };
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
