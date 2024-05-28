const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },

    bio: {
      type: String,
      default: "Content is created automatically, please consider edit",
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

// @desc
// @required
userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      user: {
        id: this._id,
        email: this.email,
        password: this.password,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
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
userSchema.methods.toProfileJSON = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
  };
};

// @desc
// @required
userSchema.methods.isFavorite = function (id) {
  const idStr = id.toString();
  for (const article of this.favoriteArticles) {
    if (article.toString() === idStr) return true;
  }
  return false;
};

// @desc
// @required
userSchema.methods.favorite = function (id) {
  if (this.favoriteArticles.indexOf(id) === -1) this.favoriteArticles.push(id);

  return this.save();
};

// @desc
// @required
userSchema.methods.unfavorite = function (id) {
  if (this.favoriteArticles.indexOf(id) !== -1)
    this.favoriteArticles.remove(id);
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
