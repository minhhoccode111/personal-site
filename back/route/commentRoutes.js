const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const commentController = require("../controller/commentsController");

const { verifyInputUpdateArticle } = require("../middleware/verifyInput");

// @desc add comment to an article
// @required fields {body}
router.post(
  "/:slug/comments",
  verifyJWT,
  verifyInputUpdateArticle,
  commentController.addCommentsToArticle,
);

router.get("/:slug/comments", commentController.getCommentsFromArticle);

router.delete(
  "/:slug/comments/:commentid",
  verifyJWT,
  commentController.deleteComment,
);

module.exports = router;
