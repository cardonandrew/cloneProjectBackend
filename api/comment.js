//! Ill need a getCommentsbyPostId, createComment,
//! editComment, and deleteComment
const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  getAllComments,
  createComment,
  getCommentByPostId,
  updateComment,
  deleteComment,
} = require("../db");

router.get("/", async (req, res, next) => {
  const allComments = await getAllComments();
  res.send(allComments);
  next();
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
