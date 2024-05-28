const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");

// const Article = require("./../models/Article");
// const User = require("./../models/User");
// const Comment = require("./../models/Comment");

// test that db is up, server is up, etc.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // this route can be use to interact with db
    // like print info, clear, populate, etc.

    // const [articles, users, comments] = await Promise.all([
    //   Article.find({}).exec(),
    //   User.find({}).exec(),
    //   Comment.find({}).exec(),
    // ]);

    // console.log(`the users belike: `, users);
    // console.log(`the articles belike: `, articles);
    // console.log(`the comments belike: `, comments);

    console.log("successful!");
    res.status(200);
    res.json({ message: "successful" });
  }),
);

module.exports = router;
