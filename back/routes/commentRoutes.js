const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");
const commentController = require("../controllers/commentsController");

// current user comment on an article
router.post(
  "/:slug/comments",
  verifyJWT,
  commentController.addCommentsToArticle,
);

// current user get all comment of an article, auth optional
router.get(
  "/:slug/comments",
  verifyJWTOptional,
  commentController.getCommentsFromArticle,
);

// current user delete a comment in an article
router.delete(
  "/:slug/comments/:id",
  verifyJWT,
  commentController.deleteComment,
);

module.exports = router;
