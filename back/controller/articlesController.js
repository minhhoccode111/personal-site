const asyncHandler = require("express-async-handler");

const Article = require("../model/Article");
const User = require("../model/User");
const Favorite = require("../model/Favorite");

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
      errors: { body: "User Not Found" },
    });
  }

  const { title, description, body, tagList } = req.body.article;

  const article = new Article({ title, description, body });

  article.author = author;

  if (Array.isArray(tagList) && tagList.length > 0) {
    article.tagList = tagList;
  }

  console.log(`created article belike: `, article);

  article.save(async function (err) {
    if (err) {
      return res.status(422).json({
        errors: {
          body: "Unable to create that article",
        },
      });
    }

    res.status(200).json({ article: await article.toArticleResponse(author) });
  });
});

// @desc current user delete an article
// @route DELETE /api/articles/:slug
// @access Private
// @return result messages
const deleteArticle = asyncHandler(async (req, res) => {
  const authorid = req.userId;

  const { slug } = req.params;

  Article.deleteOne({ slug, author: authorid }, function (_, result) {
    // NOTE: this new
    if (result.deletedCount === 0) {
      return res.status(401).json({
        errors: { body: "Article Not Found" },
      });
    }

    return res.status(200).json({
      messages: { body: "Article successfully deleted" },
    });
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
      errors: { body: "User Not Found" },
    });
  }

  if (!article) {
    return res.status(401).json({
      errors: { body: "Article Not Found" },
    });
  }

  // console.log(`article info belike: `, article);

  await loginUser.favorite(article._id);

  return res.status(200).json({
    article: await article.toArticleResponse(loginUser),
  });
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
      errors: { body: "User Not Found" },
    });
  }

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      errors: { body: "Article Not Found" },
    });
  }

  // NOTE: can't use Promise.all() because of race conditions
  // when deleting and counting at the same time
  await loginUser.unfavorite(article._id);
  return res.status(200).json({
    article: await article.toArticleResponse(loginUser),
  });
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
      errors: { body: "Article Not Found" },
    });
  }

  return res.status(200).json({
    article: await article.toArticleResponse(),
  });
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
      errors: { body: "Article Not Found" },
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

  target.save(async function (err) {
    if (err) {
      return res.status(422).json({
        errors: {
          body: "Unable to update that article",
        },
      });
    }

    return res.status(200).json({
      article: await target.toArticleResponse(author),
    });
  });
});

// @desc current user get all articles
// @route GET /api/articles
// @access Public
// @return Articles
const listArticles = asyncHandler(async (req, res) => {
  let limit = 20;
  let offset = 0;
  let query = {};

  if (req.query.limit) {
    limit = req.query.limit;
  }

  if (req.query.offset) {
    offset = req.query.offset;
  }

  if (req.query.tag) {
    query.tagList = { $in: [req.query.tag] };
  }

  if (req.query.favorited) {
    const favoriter = await User.findOne({
      username: req.query.favorited,
    }).exec();

    if (favoriter) {
      const favoritedArticles = await Favorite.find({
        userid: favoriter._id,
      }).exec();

      const favoritedArticlesArr = favoritedArticles.map(
        (ref) => ref.articleid,
      );

      query._id = { $in: favoritedArticlesArr };
    }
  }

  const [filteredArticles, articlesCount] = await Promise.all([
    Article.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: "desc" })
      .exec(),

    Article.countDocuments(query).exec(), // count all not limit or skip
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
