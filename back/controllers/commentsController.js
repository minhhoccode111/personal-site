const mongoose = require("mongoose");
const Article = require("../models/Article");
const User = require("../models/User");
const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");

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
    // return the needed information of the comment
    // and commenter is used to identify connection between current user
    // with the comment's author, this method is not needed in this route
    // but really helpful when getting all comments of a post
    comment: await newComment.toCommentResponse(commenter),
  });
});

const getCommentsFromArticle = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  const loggedin = req.loggedin;

  if (loggedin) {
    // get current user if loggedin
    const loginUser = await User.findById(req.userId).exec();

    return res.status(200).json({
      comments: await Promise.all(
        article.comments.map(async (commentId) => {
          const commentObj = await Comment.findById(commentId).exec();
          // comment's connection with current user
          return await commentObj.toCommentResponse(loginUser);
        }),
      ),
    });
  } else {
    return res.status(200).json({
      comments: await Promise.all(
        article.comments.map(async (commentId) => {
          const commentObj = await Comment.findById(commentId).exec();
          // console.log(commentObj);
          // no need for connection with comment
          const temp = await commentObj.toCommentResponse(false);
          // console.log(temp);
          return temp;
        }),
      ),
    });
  }
});

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
    // NOTE: change to Promise.all to improve performant
    await Promise.all([
      // remove the comment in article's comments array
      article.removeComment(comment._id),
      // remove the comment document
      Comment.deleteOne({ _id: comment._id }),
    ]);

    // return success message
    return res.status(200).json({
      message: "comment has been successfully deleted!!!",
    });
  } else {
    // if current user not own the comment the a 403 return
    return res.status(403).json({
      error: "only the author of the comment can delete the comment",
    });
  }
});

module.exports = {
  addCommentsToArticle,
  getCommentsFromArticle,
  deleteComment,
};
