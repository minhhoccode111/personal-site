const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    // NOTE: strict length later
    username: {
      type: String,
      required: true,
      // unique: true, // only unique email
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      // match: [/\S+@\S+\.\S+/, "is invalid"], // use express-validator instead
      index: true, // index this field to improve performance
    },

    bio: {
      type: String,
      default: "Bio is created automatically, please consider edit",
    },

    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },

    isAuthor: {
      type: Boolean,
      default: false,
    },

    favoriteArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },

  {
    timestamps: true,
  },
);

// @desc
// @required
userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});

const TOKEN = process.env.ACCESS_TOKEN_SECRET;

// @desc
// @required
userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      user: {
        id: this._id,
        email: this.email,
        password: this.password,
        isAuthor: this.isAuthor,
      },
    },
    TOKEN,
    { expiresIn: "7d" },
  );
  return accessToken;
};

// @desc
// @required
userSchema.methods.toUserResponse = function () {
  return {
    bio: this.bio,
    email: this.email,
    image: this.image,
    username: this.username,
    isAuthor: this.isAuthor,
    token: this.generateAccessToken(),
  };
};

// @desc
// @required
userSchema.methods.toProfileJSON = function () {
  return {
    bio: this.bio,
    image: this.image,
    username: this.username,
    isAuthor: this.isAuthor,
  };
};

// @desc
// @required
userSchema.methods.isFavorite = function (articleId) {
  const idStr = articleId.toString();
  for (const article of this.favoriteArticles) {
    if (article.toString() === idStr) return true;
  }
  return false;
};

// @desc
// @required
userSchema.methods.favorite = function (articleId) {
  if (this.favoriteArticles.indexOf(articleId) === -1)
    this.favoriteArticles.push(articleId);

  return this.save();
};

// @desc
// @required
userSchema.methods.unfavorite = function (articleId) {
  if (this.favoriteArticles.indexOf(articleId) !== -1)
    this.favoriteArticles.remove(articleId);
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
