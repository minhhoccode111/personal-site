const connect = require("./../config/dbConnect");

const User = require("./../model/User");
const Article = require("./../model/Article");
const Comment = require("./../model/Comment");

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const pointer = {};
const users = [];
const articles = [];
const comments = [];

// use env var
const PASSWORD = "Bruh0!0!";
const SALT = Number(process.env.SALT || 13);

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
    password,
    isAuthor: true,
    username: "minhhoccode111",
    email: "minhhoccode111@gmail.com",
    bio: "I write code (sometimes)",
    image: escapeHtml(faker.image.avatar()),
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
    // console.log(`article author belike: `, author);

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
      console.log("duplicated article slug");
    }
  }
}

async function createUsers(number) {
  const password = await bcrypt.hash(PASSWORD, SALT);

  for (let i = 0; i < number; i++) {
    const userDetail = {
      email: `${i}asd@gmail.com`,
      password,
      // username: faker.person.fullName(),
      username: `${i}asd`, // easier testing
      bio: faker.lorem.paragraph(),
      image: escapeHtml(faker.image.avatar()),
    };

    console.log(`email belike: `, userDetail.email);
    console.log(`username belike: `, userDetail.username);

    const user = new User(userDetail);

    const favoriteArticles = faker.helpers.arrayElements(articles, {
      min: 5,
      max: 15,
    });

    // in case name not unique
    try {
      await Promise.all([
        user.save(),

        favoriteArticles.map(
          async (article) => await user.favorite(article._id),
        ),
      ]);

      users.push(user);
      console.log(`user: `, i, user);
    } catch (err) {
      i--;
      console.log(`duplicated username`);
    }
  }
}

async function createComments(number) {
  users.push(pointer.author);

  for (let i = 0; i < number; i++) {
    const author = faker.helpers.arrayElement(users); // pick a user

    const article = faker.helpers.arrayElement(articles); // pick an article

    const body = faker.word.words({ count: { min: 5, max: 100 } });

    const comment = await new Comment({
      author,
      body,
      article,
    }).save();

    comments.push(comment);

    console.log(`comment: `, i);
  }
}

const main = async () => {
  await createMe();
  await createArticles(30);
  await createUsers(25);
  await createComments(400);
};

connect(main);
