const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const User = require("../model/User");
const Article = require("../model/Article");
const Comment = require("../model/Comment");

// @desc current user add a comment to article
// @route POST /api/articles/:slug/comment
// @access Private
// @required fields {body}
// @return Comment
const addCommentsToArticle = asyncHandler(async (req, res) => {
  const authorid = req.userId;

  const { body } = req.body.comment;

  const { slug } = req.params;

  const [author, article] = await Promise.all([
    User.findById(authorid).exec(),
    Article.findOne({ slug }).exec(),
  ]);

  if (!author || !article) {
    return res.status(401).json({
      errors: { body: "Article or Author Not Found" },
    });
  }

  const newComment = new Comment({
    body,
    authorid: author,
    articleid: article,
  });

  const [_, commentResponse] = await Promise.all([
    newComment.save(),
    await newComment.toCommentResponse(author),
  ]);

  res.status(200).json({ comment: commentResponse });
});

// @desc current user get all comments of an article
// @route GET /api/articles/:slug/comments
// @access Public
// @return Comments
const getCommentsFromArticle = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let limit = 10;
  let offset = 10;

  if (req.query.limit) {
    limit = req.query.limit;
  }

  if (req.query.offset) {
    offset = req.query.offset;
  }

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      errors: { body: "Article Not Found" },
    });
  }

  const comments = await Comment.find({
    article,
  })
    .limit(Number(limit))
    .skip(Number(offset))
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({
    comments: await Promise.all(
      comments.map(async (comment) => await comment.toCommentResponse()),
    ),
  });
});

// @desc current user delete a comment of an article
// @route DELETE /api/articles/:slug/comments/:id
// @access Private
// @return resule messages
const deleteComment = asyncHandler(async (req, res) => {
  const authorid = req.userId;

  const { articleid, commentid } = req.params;

  const validId =
    mongoose.isValidObjectId(commentid) && mongoose.isValidObjectId(articleid);

  if (!validId) {
    return res.status(401).json({
      errors: { body: "Comment Not Found" },
    });
  }

  Comment.deleteOne(
    { articleid, authorid, _id: commentid },
    function (err, result) {
      if (err) {
        return res
          .status(422)
          .json({ errors: { body: "Unable to delete comment" } });
      }

      if (result.deletedCount === 0) {
        return res.status(401).json({
          errors: { body: "Comment Not Found" },
        });
      }

      return res
        .status(200)
        .json({ messages: { body: "Comment successfully deleted" } });
    },
  );
});

module.exports = {
  addCommentsToArticle,
  getCommentsFromArticle,
  deleteComment,
};
