const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");
const verifyJWTAuthor = require("../middleware/verifyJWTAuthor");
const articleController = require("../controller/articlesController");

const {
  verifyInputCreateArticle,
  verifyInputUpdateArticle,
} = require("../middleware/verifyInput");

router.get("/", verifyJWTOptional, articleController.listArticles);

router.get("/:slug", articleController.getArticleWithSlug);

// @desc create new article
// @required fields article{title, description, body}
router.post(
  "/",
  verifyJWTAuthor,
  verifyInputCreateArticle,
  articleController.createArticle,
);

router.delete("/:slug", verifyJWTAuthor, articleController.deleteArticle);

router.post("/:slug/favorite", verifyJWT, articleController.favoriteArticle);

router.delete(
  "/:slug/favorite",
  verifyJWT,
  articleController.unfavoriteArticle,
);

// @desc update article
// @optional fields{title, description, body, tagList}
router.put(
  "/:slug",
  verifyJWTAuthor,
  verifyInputUpdateArticle,
  articleController.updateArticle,
);

module.exports = router;
