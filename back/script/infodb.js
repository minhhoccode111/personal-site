const connect = require("./../config/dbConnect");

const User = require("./../model/User");
const Article = require("./../model/Article");
const Comment = require("./../model/Comment");

const main = async () => {
  const users = await User.find({}).exec();
  const articles = await Article.find({}).exec();
  const comments = await Comment.find({}).exec();

  console.log(`users: \n`, users);
  console.log(`articles: \n`, articles);
  console.log(`comments: \n`, comments);
};

connect(main);
