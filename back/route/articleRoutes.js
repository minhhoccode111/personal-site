const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");
const verifyJWTAuthor = require("../middleware/verifyJWTAuthor");
const articleController = require("../controller/articlesController");

// get all articles of current user, auth optional to display connection with
// the article and connection with the article's author
router.get("/", verifyJWTOptional, articleController.listArticles);

// get a specific article using its slug, no auth required
router.get("/:slug", articleController.getArticleWithSlug);

// current user create an article
router.post("/", verifyJWTAuthor, articleController.createArticle);

// current user delete an article
router.delete("/:slug", verifyJWTAuthor, articleController.deleteArticle);

// current user add an article to favorite
router.post("/:slug/favorite", verifyJWT, articleController.favoriteArticle);

// current user remove an article from favorite
router.delete(
  "/:slug/favorite",
  verifyJWT,
  articleController.unfavoriteArticle,
);

// current user update an article
router.put("/:slug", verifyJWTAuthor, articleController.updateArticle);

module.exports = router;
