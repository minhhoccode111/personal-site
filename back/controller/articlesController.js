const asyncHandler = require("express-async-handler");

const Article = require("../model/Article");
const User = require("../model/User");

const {
  verifyInputCreateArticle,
  verifyInputUpdateArticle,
} = require("../middleware/verifyInput");

// @desc current user create a article
// @route POST /api/articles
// @access Private
// @required fields {title, description, body}
// @return Article
const createArticle = [
  verifyInputCreateArticle,
  asyncHandler(async (req, res) => {
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

      res
        .status(200)
        .json({ article: await article.toArticleResponse(author) });
    });
  }),
];

// @desc current user delete an article
// @route DELETE /api/articles/:slug
// @access Private
// @return result messages
const deleteArticle = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { slug } = req.params;

  Article.deleteOne({ slug, author: id }, function (_, result) {
    // NOTE: this is new
    if (result.deletedCount === 0) {
      return res.status(401).json({
        errors: { body: "Article Not Found" },
      });
    }

    return res.status(200).json({
      messages: { body: "Article successfully deleted!!!" },
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

  console.log(`article info belike: `, article);

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

  // NOTE: can't use Promise.all() because of race conditios
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
    // NOTE: should retrieve and pass user to this to display favorite?
    article: await article.toArticleResponse(false),
  });
});

// @desc current user update a article
// @route PUT /api/articles/:slug
// @access Private
// @optional fields {title, description, body, tagList}
// @return Article
const updateArticle = [
  verifyInputUpdateArticle,
  asyncHandler(async (req, res) => {
    const userId = req.userId;

    const { article } = req.body;

    const { slug } = req.params;

    const loginUser = await User.findById(userId).exec();

    // also find with current userId
    const target = await Article.findOne({ slug, author: userId }).exec();

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

    // save after current user updated the article
    target.save(async function (err) {
      if (err) {
        return res.status(422).json({
          errors: {
            body: "Unable to update that article",
          },
        });
      }

      // async because we have to retrive db to get the article's author
      return res.status(200).json({
        article: await target.toArticleResponse(loginUser),
      });
    });
  }),
];

// @desc current user get all articles
// @route GET /api/articles
// @access Public
// @return Articles
const listArticles = asyncHandler(async (req, res) => {
  // default params' values
  let limit = 20;
  let offset = 0;
  let query = {};

  // extract limit from the query parameters if provided
  if (req.query.limit) {
    limit = req.query.limit;
  }

  // extract offset from the query parameters if provided
  if (req.query.offset) {
    offset = req.query.offset;
  }

  // extract tag from the query parameters if provided
  if (req.query.tag) {
    // add a tagList property to the query, only 1 tag
    query.tagList = { $in: [req.query.tag] };
  }

  // console.log(`the query belike: `, query);
  // console.log(`the query.tag belike: `, req.query.tag);

  // favorited is a username param to help get all articles
  // which that user mark as favorite
  if (req.query.favorited) {
    // Find the user who favorited articles
    const favoriter = await User.findOne({
      username: req.query.favorited,
    }).exec();

    // If the user exists, add their favorite articles to the query
    if (favoriter) {
      // adds their favorite articles to the query if the user exists
      // e.g. query will be { _id: { $in: ['articleId1', 'articleId2', 'articleId3']} }
      query._id = { $in: favoriter.favoriteArticles };
    }
  }

  // find articles matching the query with limit and offset
  const [filteredArticles, articlesCount] = await Promise.all([
    Article.find(query)
      .limit(Number(limit)) // Limit the number of articles
      .skip(Number(offset)) // Skip the specified number of articles
      // Sort articles by creation date in descending order
      .sort({ createdAt: "desc" })
      .exec(),

    // count the total number of articles matching the query
    Article.countDocuments(query).exec(),
  ]);

  // check if current user is logged in
  if (req.loggedin) {
    // retrieve current user
    const loginUser = await User.findById(req.userId).exec();

    return res.status(200).json({
      articles: await Promise.all(
        filteredArticles.map(async (article) => {
          // return needed information of article
          // and connection of current user with the article
          return await article.toArticleResponse(loginUser);
        }),
      ),

      articlesCount,
    });
  } else {
    return res.status(200).json({
      articles: await Promise.all(
        filteredArticles.map(async (article) => {
          // return needed information of article without connection info
          return await article.toArticleResponse(false);
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
