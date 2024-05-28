const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");
const articleController = require("../controllers/articlesController");

// feed endpoint must go before :slug endpoint
// because we don't want to find an actual post named "feed"
// get all articles of current user's following
router.get("/feed", verifyJWT, articleController.feedArticles);

// get all articles of current user, auth optional to display connection with
// the article and connection with the article's author
router.get("/", verifyJWTOptional, articleController.listArticles);

// get a specific article using its slug, no auth required
router.get("/:slug", articleController.getArticleWithSlug);

// current user create an article
router.post("/", verifyJWT, articleController.createArticle);

// current user delete an article
router.delete("/:slug", verifyJWT, articleController.deleteArticle);

// current user add an article to favourtie
router.post("/:slug/favorite", verifyJWT, articleController.favoriteArticle);

// current user remove an article from favourtie
router.delete(
  "/:slug/favorite",
  verifyJWT,
  articleController.unfavoriteArticle,
);

// current user update an article
router.put("/:slug", verifyJWT, articleController.updateArticle);

module.exports = router;
