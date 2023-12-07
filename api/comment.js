//! Ill need a getCommentsbyPostId, createComment,
//! editComment, and deleteComment
const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  getAllComments,
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} = require("../db");

router.get("/", async (req, res, next) => {
  const allComments = await getAllComments();
  res.send(allComments);
  next();
});

router.get("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await getCommentsByPostId(postId);

    if (!comments) {
      res.send({
        error: "Error",
        name: "CommentsDon'tExistsError",
        message: `Comments for postId ${postId} not found`,
      });
    } else {
      res.send(comments);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.post("/", async (req, res, next) => {
  const { username, isVerified, comment, postId } = req.body;

  try {
    const newComment = await createComment({
      username,
      isVerified,
      comment,
      postId,
    });

    res.send(newComment);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
