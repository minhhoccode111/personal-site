const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const commentController = require("../controller/commentsController");

const { verifyInputCreateComment } = require("../middleware/verifyInput");

router.post(
  "/:articleid/comments",
  verifyJWT,
  verifyInputCreateComment,
  commentController.addCommentsToArticle,
);

router.get("/:articleid/comments", commentController.getCommentsFromArticle);

router.delete(
  "/:articleid/comments/:commentid",
  verifyJWT,
  commentController.deleteComment,
);

module.exports = router;
