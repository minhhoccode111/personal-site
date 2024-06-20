const connect = require("./../config/dbConnect");

const User = require("../model/User");
const Article = require("../model/Article");
const Comment = require("../model/Comment");
const Credential = require("../model/Credential");

const main = async () => {
  const users = await User.find({}).exec();
  const articles = await Article.find({}).exec();
  const comments = await Comment.find({}).exec();
  const credentials = await Credential.find({}).exec();

  console.log(`users: \n`, users);
  console.log(`articles: \n`, articles);
  console.log(`comments: \n`, comments);
  console.log(`credentials: \n`, credentials);
};

connect(main);
