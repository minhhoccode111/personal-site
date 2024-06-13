const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");
const User = require("./User");
const Favorite = require("./Favorite");

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
      maxLength: 100,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      maxLength: 30000,
      trim: true,
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
articleSchema.methods.toArticleResponse = async function (user) {
  const [authorObj, favoritesCount, favorited] = await Promise.all([
    User.findById(this.author).exec(),
    Favorite.countDocuments({ articleid: this._id }).exec(),
    user?.isFavorite(this._id),
  ]);

  return {
    slug: this.slug,
    body: this.body,
    title: this.title,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    description: this.description,
    author: authorObj.toProfileJSON(),
    favorited: !!favorited,
    favoritesCount,
  };
};

// articleSchema.methods.isAuthor = function (user) {
//   return user._id.toString() === this.author.toString();
// };

module.exports = mongoose.model("Article", articleSchema);
