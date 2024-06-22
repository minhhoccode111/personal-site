const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const commentController = require("../controller/commentsController");

const { verifyInputCreateComment } = require("../middleware/verifyInput");

// @desc add comment to an article
// @required fields {body}
router.post(
  "/:slug/comments",
  verifyJWT,
  verifyInputCreateComment,
  commentController.addCommentsToArticle,
);

router.get("/:slug/comment", commentController.getCommentsFromArticle);

// WARN: use :article not :slug because no need to check article existence
router.delete(
  "/:articleid:/comments/:commentid",
  verifyJWT,
  commentController.deleteComment,
);

module.exports = router;
