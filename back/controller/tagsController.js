const asyncHandler = require("express-async-handler");

const Article = require("../model/Article");

// @desc get all tags that existed
// @route GET /api/tags
// @access Public
// @return Tags
const getTags = asyncHandler(async (req, res) => {
  // distinct "tagList" will return either an error or a list of distinct tags
  const tags = await Article.find().distinct("tagList").exec();

  // console.log(tags);
  res.status(200).json({
    tags,
  });
});

module.exports = {
  getTags,
};
