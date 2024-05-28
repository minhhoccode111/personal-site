const connect = require("./../config/dbConnect");

const User = require("./../models/User");
const Article = require("./../models/Article");
const Comment = require("./../models/Comment");

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const pointer = {};
const users = [];
const articles = [];
const comments = [];

const PASSWORD = "asd";
const SALT = 10;

// manually created, not reliable
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (match) {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
}

async function createMe() {
  const password = await bcrypt.hash(PASSWORD, SALT);
  const detail = {
    email: "minhhoccode111@gmail.com",
    password,
    username: "minhhoccode111",
    bio: "I write code (sometimes)",
    isAuthor: true,
  };

  const me = new User(detail);
  await me.save();
  pointer.author = me;

  console.log(`add author: `, me);
}

async function createArticles(number) {
  for (let i = 0; i < number; i++) {
    const description = faker.word.words({ count: { min: 15, max: 30 } });

    const title = faker.word.words({ count: { min: 5, max: 10 } });

    const body = faker.lorem.paragraph({ min: 3, max: 10 });

    const tagList = faker.lorem
      .sentence({ min: 1, max: 5 })
      .split(" ")
      .map((tag) => tag.toLowerCase());

    const author = pointer.author;

    const article = new Article({
      body,
      title,
      author,
      tagList,
      description,
    });

    try {
      await article.save();
      articles.push(article);
      console.log(`article: `, i);
    } catch (err) {
      i--;
      console.log("duplicated article");
    }
  }
}

async function createUsers(number) {
  const password = await bcrypt.hash(PASSWORD, SALT);

  for (let i = 0; i < number; i++) {
    const userDetail = {
      email: `asd${i}@gmail.com`,
      password,
      username: faker.person.fullName(),
      bio: faker.lorem.paragraph(),
      image: escapeHtml(faker.image.avatar()),
    };

    const user = new User(userDetail);

    const favoriteArticles = faker.helpers.arrayElements(articles);

    user.favoriteArticles = favoriteArticles;

    // in case name not unique
    try {
      await user.save();
      users.push(user);
      console.log(`user: `, i);
    } catch (err) {
      i--;
      console.log(`duplicated username`);
    }
  }
}

async function createComments(number) {
  users.push(pointer.author);

  for (let i = 0; i < number; i++) {
    const author = faker.helpers.arrayElement(users);

    const article = faker.helpers.arrayElement(articles);

    const body = faker.word.words({ count: { min: 5, max: 100 } });

    const comment = new Comment({
      author,
      body,
      article,
    });

    await comment.save();

    await article.addComment(comment._id);

    comments.push(comment);

    console.log(`comment: `, i);
  }
}

const main = async () => {
  await createMe();
  await createArticles(100);
  await createUsers(25);
  await createComments(400);
};

connect(main);
