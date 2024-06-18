const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const commentController = require("../controller/commentsController");

const { verifyInputCreateComment } = require("../middleware/verifyInput");

// @desc add comment to an article
// @required fields {body}
router.post(
  "/",
  verifyJWT,
  verifyInputCreateComment,
  commentController.addCommentsToArticle,
);

router.get("/", commentController.getCommentsFromArticle);

router.delete("/:commentid", verifyJWT, commentController.deleteComment);

module.exports = router;
