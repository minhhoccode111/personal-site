const Article = require("../models/Article");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const slugify = require("slugify");

// @desc current user create a article
// @route POST /api/articles
// @access Private
// @required fields {title, description, body}
// @return Article
const createArticle = asyncHandler(async (req, res) => {
  const id = req.userId;

  const author = await User.findById(id).exec();

  const { title, description, body, tagList } = req.body.article;

  // confirm data
  if (!title || !description || !body) {
    res.status(400).json({ message: "All fields are required" });
  }

  // WARN: check for slug name 'feed' edge case
  const slug = slugify(title, { lower: true, replacement: "-" });
  if (slug === "feed") {
    return res.status(422).json({
      errors: {
        message: "Unable to create that article",
      },
    });
  }

  // create a new article with input data
  const article = new Article({ title, description, body });

  // mark current user as article's author
  article.author = id;

  // if tagList is valid, save to article
  if (Array.isArray(tagList) && tagList.length > 0) {
    article.tagList = tagList;
  }

  // then save created article
  article.save(async function (err) {
    if (err) {
      return res.status(422).json({
        errors: {
          message: "Unable to create that article",
        },
      });
    }

    res.status(200).json({
      // await to retrieve db for article's author
      // schema method to response only information that we want
      article: await article.toArticleResponse(author),
    });
  });
});

// @desc current user delete an article
// @route DELETE /api/articles/:slug
// @access Private
// @return operations result
const deleteArticle = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { slug } = req.params;

  // console.log(id);

  // retrieve current user in db
  const loginUser = await User.findById(id).exec();

  // check user existence
  if (!loginUser) {
    return res.status(401).json({
      message: "User Not Found",
    });
  }

  // retrieve article with slug
  const article = await Article.findOne({ slug }).exec();

  // check article existence
  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  // console.log(`article author is ${article.author}`)
  // console.log(`login user id is ${loginUser}`)

  // if both existed and current user is the article's author
  if (article.author.toString() === loginUser._id.toString()) {
    // delete the article
    await Article.deleteOne({ slug: slug });

    // return success message
    res.status(200).json({
      message: "Article successfully deleted!!!",
    });
  } else {
    // return fail message
    res.status(403).json({
      message: "Only the author can delete his article",
    });
  }
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
      message: "User Not Found",
    });
  }

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }
  // console.log(`article info ${article}`);

  // current user add current article's id to favorite array
  await loginUser.favorite(article._id);

  // update the article's favorite count and return updated article
  // the implement `return this.save()` return a promise so we have to await
  const updatedArticle = await article.updateFavoriteCount();

  return res.status(200).json({
    // return the article with needed information
    // pass in current user to help identify
    // // if current user favorited the article
    // // and the connection between current user with article's author
    article: await updatedArticle.toArticleResponse(loginUser),
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
      message: "User Not Found",
    });
  }

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  // remove the article's id from current user's favoriteArticles array
  await loginUser.unfavorite(article._id);

  // update the article favorite count
  await article.updateFavoriteCount();

  return res.status(200).json({
    // return the article with needed information
    // pass in current user to help identify
    // // if current user favorited the article
    // // and the connection between current user with article's author
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
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  return res.status(200).json({
    // return the article with needed information
    // no need to identify the connection with the article's author
    article: await article.toArticleResponse(false),
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

  const loginUser = await User.findById(userId).exec();

  const target = await Article.findOne({ slug }).exec();

  // check article existence
  if (!target) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  // console.log(target.title);
  // console.log(req.userId);

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
          message: "Unable to update that article",
        },
      });
    }

    // async because we have to retrive db to get the article's author
    return res.status(200).json({
      article: await target.toArticleResponse(loginUser),
    });
  });
});

// @desc current user get own feed
// @route GET /api/articles/feed
// @access Private
// @return Articles of authors the current user is following
const feedArticles = asyncHandler(async (req, res) => {
  // default query
  let limit = 20; // max 20 articles a time
  let offset = 0; // first skip article

  // extract limit from the query
  if (req.query.limit) {
    limit = req.query.limit;
  }

  // extract offset from the query
  if (req.query.offset) {
    offset = req.query.offset;
  }

  const userId = req.userId;

  // retrieve current user in db
  const loginUser = await User.findById(userId).exec();

  // console.log(loginUser.followingUsers)

  const [filteredArticles, articlesCount] = await Promise.all([
    // find articles that
    Article.find({
      // the author is in current user's followingUsers array
      author: { $in: loginUser.followingUsers },
    })
      .limit(Number(limit)) // max number of articles
      .skip(Number(offset)) // skip number of articles
      .exec(),

    // count articles that
    Article.countDocuments({
      // the author is in current user's followingUsers array
      author: { $in: loginUser.followingUsers },
    }).exec(),
  ]);

  // console.log(`articles: ${filteredArticles}`);

  // user promise.all to wait for all article promises return from .map()
  const articles = await Promise.all(
    filteredArticles.map(async (article) => {
      // pass current user to identify connection with the article
      // and connection with the article's author
      return await article.toArticleResponse(loginUser);
    }),
  );

  return res.status(200).json({
    articles,
    articlesCount,
  });
});

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
    // NOTE: big brain
    // add a tagList property to the query, only 1 tag
    query.tagList = { $in: [req.query.tag] };
  }

  // console.log(`the query belike: `, query);
  // console.log(`the query.tag belike: `, req.query.tag);

  // if an author is specified in the query parameters
  if (req.query.author) {
    // NOTE: big brain
    // Find the user with the specified username
    const author = await User.findOne({ username: req.query.author }).exec();
    // Only add author to the query if the user exists
    if (author) {
      query.author = author._id;
    }
  }

  // favorited is a username param to help get all articles
  // which that user mark as favorite
  if (req.query.favorited) {
    // NOTE: big brain
    // Find the user who favorited articles
    const favoriter = await User.findOne({
      username: req.query.favorited,
    }).exec();

    // If the user exists, add their favorite articles to the query
    if (favoriter) {
      // NOTE: big brain
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
          // and connection of current user with the article's author
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
  feedArticles,
  listArticles,
};
