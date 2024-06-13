const connect = require("./../config/dbConnect");

const User = require("./../model/User");
const Article = require("./../model/Article");
const Comment = require("./../model/Comment");

const main = async () => {
  await User.deleteMany({});
  await Article.deleteMany({});
  await Comment.deleteMany({});

  const users = await User.countDocuments({}).exec();
  const articles = await Article.countDocuments({}).exec();
  const comments = await Comment.countDocuments({}).exec();

  console.log(`number users: `, users);
  console.log(`number articles: `, articles);
  console.log(`number comments: `, comments);
};

connect(main);
