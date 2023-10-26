const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getUserByUsername,
  updatePost,
  deletePost,
} = require("../db");

router.get("/", async (req, res, next) => {
  const allPosts = await getAllPosts();
  res.send(allPosts);
  next();
});

router.post("/", async (req, res, next) => {
  const { username, tweet, isVerified, imageUrl, profileImage } = req.body;

  try {
    const newPost = await createPost({
      username,
      tweet,
      isVerified,
      imageUrl,
      profileImage,
    });

    res.send(newPost);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch("/:postId", async (req, res, next) => {
  const { tweet, imageUrl } = req.body;

  const updateData = { id: req.params.postId };
  if (tweet) {
    updateData.tweet = tweet;
  }
  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }
  try {
    const changedPost = await updatePost(req.params.postId, updateData);

    if (!changedPost) {
      res.send({
        name: "Error",
        error: "Could not update the post",
        message: `Post ${updateData.id} not found`,
      });
    } else if (changedPost.error) {
      res.send({
        name: "Error",
        error: changedPost.error,
        message: `An post with name ${req.body.name} already exists`,
      });
    } else {
      res.send(changedPost);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:postId", async (req, res, next) => {
  const { postId } = req.params;

  try {
    const deletedPost = await deletePost(postId);
    res.send(deletedPost);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
