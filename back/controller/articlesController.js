const asyncHandler = require("express-async-handler");

const Article = require("../model/Article");
const User = require("../model/User");
const Favorite = require("../model/Favorite");

const mongoose = require("mongoose");

const debug = require("../constants/debug");

// @desc current user create a article
// @route POST /api/articles
// @access Private
// @required fields {title, description, body}
// @return Article
const createArticle = asyncHandler(async (req, res) => {
  const userid = req.userId;

  const author = await User.findById(userid).exec();

  if (!author) {
    return res.status(401).json({
      errors: [{ msg: "User Not Found" }],
    });
  }

  const { title, description, body, tagList } = req.body.article;

  const article = new Article({ title, description, body });

  article.author = author;

  if (Array.isArray(tagList) && tagList.length > 0) {
    article.tagList = tagList;
  }

  debug(`created article belike: `, article);

  try {
    await article.save();
    res.status(201).json({ article: await article.toArticleResponse(author) });
  } catch (err) {
    if (
      err.name === "MongoServerError" &&
      err.code === 11000 &&
      err.keyPattern &&
      err.keyPattern.slug
    ) {
      return res.status(409).json({
        errors: [
          {
            msg: "Article slug already exists",
          },
        ],
      });
    }
    debug(`error create article belike: `, err);
    return res.status(422).json({
      errors: [
        {
          msg: "Unable to create that article",
        },
      ],
    });
  }
});

// @desc current user delete an article
// @route DELETE /api/articles/:slug
// @access Private
// @return result messages
const deleteArticle = asyncHandler(async (req, res) => {
  const authorid = req.userId;

  const { slug } = req.params;

  Article.deleteOne({ slug, author: authorid }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: [{ msg: "Unable to delete article" }] });
    }

    if (result.deletedCount === 0) {
      return res.status(401).json({
        errors: [{ msg: "Article Not Found" }],
      });
    }

    return res
      .status(200)
      .json({ messages: [{ msg: "Article successfully deleted" }] });
  });
});

// @desc current user add an article to favorite
// @route POST /api/articles/:slug/favorite
// @access Private
// @return Article
const favoriteArticle = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { slug } = req.params;

  const [loginUser, article] = await Promise.all([
    User.findById(id).exec(),
    Article.findOne({ slug }).exec(),
  ]);

  if (!loginUser) {
    return res.status(401).json({
      errors: [{ msg: "User Not Found" }],
    });
  }

  if (!article) {
    return res.status(401).json({
      errors: [{ msg: "Article Not Found" }],
    });
  }

  // debug(`article info belike: `, article);

  await loginUser.favorite(article._id);

  return res
    .status(200)
    .json({ article: await article.toArticleResponse(loginUser) });
});

// @desc current user remove an article from favorite
// @route DELETE /api/articles/:slug/favorite
// @access Private
// @return Article
const unfavoriteArticle = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { slug } = req.params;

  const loginUser = await User.findById(id).exec();

  if (!loginUser) {
    return res.status(401).json({
      errors: [{ msg: "User Not Found" }],
    });
  }

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      errors: [{ msg: "Article Not Found" }],
    });
  }

  // NOTE: can't use Promise.all() because of race conditions
  // when deleting and counting at the same time
  await loginUser.unfavorite(article._id);
  return res
    .status(200)
    .json({ article: await article.toArticleResponse(loginUser) });
});

// @desc current user get an article
// @route GET /api/articles/:slug
// @access Public
// @return Article
const getArticleWithSlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(404).json({
      errors: [{ msg: "Article Not Found" }],
    });
  }

  return res.status(200).json({ article: await article.toArticleResponse() });
});

// @desc current user update a article
// @route PUT /api/articles/:slug
// @access Private
// @optional fields {title, description, body, tagList}
// @return Article
const updateArticle = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const { article } = req.body;

  const { slug } = req.params;

  // with author to make sure current user is qualified
  const [author, target] = await Promise.all([
    User.findById(userId).exec(),
    Article.findOne({ slug, author: userId }).exec(),
  ]);

  if (!target) {
    return res.status(401).json({
      errors: [{ msg: "Article Not Found" }],
    });
  }

  if (article.title) {
    target.title = article.title;
  }

  if (article.description) {
    target.description = article.description;
  }

  if (article.body) {
    target.body = article.body;
  }

  if (article.tagList) {
    target.tagList = article.tagList;
  }

  try {
    await target.save();
    res.status(200).json({ article: await target.toArticleResponse(author) });
  } catch (err) {
    if (
      err.name === "MongoServerError" &&
      err.code === 11000 &&
      err.keyPattern &&
      err.keyPattern.slug
    ) {
      return res.status(409).json({
        errors: [
          {
            msg: "Article slug already exists",
          },
        ],
      });
    }
    debug(`error create article belike: `, err);
    return res.status(422).json({
      errors: [
        {
          msg: "Unable to create that article",
        },
      ],
    });
  }
});

// @desc current user get all articles
// @route GET /api/articles
// @access Public
// @return Articles
const listArticles = asyncHandler(async (req, res) => {
  const query = req.query;
  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;
  const finalQuery = {};

  if (query.tag) {
    finalQuery.tagList = { $in: [query.tag] };
  }

  // list a user's all favorited articles
  // e.g: ?favorited-userid=6683fefece1724ef4ae49c18
  const favoritedUserid = query["favorited-userid"];
  const isValid = mongoose.isValidObjectId(favoritedUserid);
  if (isValid) {
    const favoritedArticles = await Favorite.find({
      userid: favoritedUserid,
    }).exec();

    const favoritedArticlesArr = favoritedArticles.map((ref) => ref.articleid);

    finalQuery._id = { $in: favoritedArticlesArr };
  }

  const [filteredArticles, articlesCount] = await Promise.all([
    Article.find(finalQuery)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: "desc" })
      .exec(),

    Article.countDocuments(finalQuery).exec(), // count all not limit or skip
  ]);

  if (req.loggedin) {
    const loginUser = await User.findById(req.userId).exec();

    return res.status(200).json({
      articles: await Promise.all(
        filteredArticles.map(async (article) => {
          return await article.toArticleResponse(loginUser);
        }),
      ),

      articlesCount,
    });
  } else {
    return res.status(200).json({
      articles: await Promise.all(
        filteredArticles.map(async (article) => {
          return await article.toArticleResponse();
        }),
      ),

      articlesCount,
    });
  }
});

module.exports = {
  createArticle,
  deleteArticle,
  favoriteArticle,
  unfavoriteArticle,
  getArticleWithSlug,
  updateArticle,
  listArticles,
};
