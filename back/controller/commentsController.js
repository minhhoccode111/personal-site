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
  const id = req.userId;

  // current user create the comment
  const commenter = await User.findById(id).exec();

  // if current user not found
  if (!commenter) {
    return res.status(401).json({
      message: "User Not Found",
    });
  }

  // extract the article title slug
  const { slug } = req.params;

  // console.log(`the slug is ${slug}`)
  const article = await Article.findOne({ slug }).exec();

  // check for existence
  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  // extract comment body (content) from body
  const { body } = req.body.comment;

  // current user post a new comment to the article
  const newComment = await Comment.create({
    body,
    author: commenter._id,
    article: article._id,
  });

  // add comment's id to the article array, await because of this.save()
  await article.addComment(newComment._id);

  return res.status(200).json({
    comment: await newComment.toCommentResponse(),
  });
});

// @desc current user get all comments of an article
// @route GET /api/articles/:slug/comments
// @access Public
// @return Comments
const getCommentsFromArticle = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  res.status(200).json({
    comments: await Promise.all(
      article.comments.map(async (commentId) => {
        const commentObj = await Comment.findById(commentId).exec();
        return await commentObj.toCommentResponse();
      }),
    ),
  });
});

// @desc current user delete a comment of an article
// @route DELETE /api/articles/:slug/comments/:id
// @access Private
// @return resule messages
const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // the article's slug title and comment id
  const { slug, id } = req.params;

  // check valid mongodb id to return soon
  const validId = mongoose.isValidObjectId(id);
  if (!validId) {
    return res.status(401).json({
      message: "Comment Not Found",
    });
  }

  const [commenter, article, comment] = await Promise.all([
    User.findById(userId).exec(),
    Article.findOne({ slug }).exec(),
    Comment.findById(id).exec(),
  ]);

  // check for existence of current user
  if (!commenter) {
    return res.status(401).json({
      message: "User Not Found",
    });
  }

  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  if (!comment) {
    return res.status(401).json({
      message: "Comment Not Found",
    });
  }

  // console.log(`comment author id: ${comment.author}`);
  // console.log(`commenter id: ${commenter._id}`)

  // check for comment's authorization
  if (comment.author.toString() === commenter._id.toString()) {
    await Promise.all([
      // remove the comment in article's comments array
      article.removeComment(comment._id),
      // remove the comment document
      Comment.deleteOne({ _id: comment._id }),
    ]);

    // return success message
    return res.status(200).json({
      message: "comment has been successfully deleted",
    });
  } else {
    // if current user not own the comment the a 403 return
    return res.status(403).json({
      message: "Cannot delete comments not own",
    });
  }
});

module.exports = {
  addCommentsToArticle,
  getCommentsFromArticle,
  deleteComment,
};
