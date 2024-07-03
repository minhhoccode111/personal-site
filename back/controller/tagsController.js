const asyncHandler = require("express-async-handler");

const Article = require("../model/Article");
const debug = require("../constants/debug");
const httpStatus = require("../constants/httpStatus");

// @desc get all tags that existed
// @route GET /api/tags
// @access Public
// @return Tags
const getTags = asyncHandler(async (_, res) => {
  const tags = await Article.find().distinct("tagList").exec();

  debug(tags);
  res.status(httpStatus.OKAY).json({ tags });
});

module.exports = {
  getTags,
};
