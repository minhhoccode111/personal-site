const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");
const User = require("./User");

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    tagList: [
      {
        type: String,
      },
    ],

    author: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true, // automatic add createdAt and updatedAt
  },
);

// @desc
// @required
articleSchema.plugin(uniqueValidator);

// @desc
// @required
articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, replacement: "-" });
  next();
});

// @desc
// @required
articleSchema.methods.updateFavoriteCount = async function () {
  const favoriteCount = await User.countDocuments({
    favoriteArticles: { $in: [this._id] },
  }).exec();

  this.favoritesCount = favoriteCount;
  return this.save();
};

// @desc
// @required
articleSchema.methods.toArticleResponse = async function (user) {
  const authorObj = await User.findById(this.author).exec();

  return {
    slug: this.slug,
    body: this.body,
    title: this.title,
    tagList: this.tagList,
    description: this.description,
    favoritesCount: this.favoritesCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: user ? user.isFavorite(this._id) : false,
    author: authorObj.toProfileJSON(),
  };
};

// @desc
// @required
articleSchema.methods.addComment = function (commentId) {
  if (this.comments.indexOf(commentId) === -1) this.comments.push(commentId);

  return this.save();
};

// @desc
// @required
articleSchema.methods.removeComment = function (commentId) {
  if (this.comments.indexOf(commentId) !== -1) this.comments.remove(commentId);

  return this.save();
};

module.exports = mongoose.model("Article", articleSchema);
