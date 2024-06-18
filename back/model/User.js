const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const Favorite = require("./Favorite");
const slugify = require("slugify");

const userSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      maxLength: 100,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100,
    },

    email: {
      index: true, // index for performance
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minLength: 8,
      maxLength: 100,
      trim: true,
    },

    bio: {
      type: String,
      default: "Bio is created automatically",
      maxLength: 1000,
    },

    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
      maxLength: 3000,
    },

    isAuthor: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

// @desc
// @required
userSchema.pre("save", function (next) {
  this.slug = slugify(this.username, { lower: true, replacement: "-" });
  next();
});

// @desc
// @required
userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});

// @desc
// @required
userSchema.methods.generateAccessToken = function () {
  const TOKEN = process.env.ACCESS_TOKEN_SECRET;
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
    { expiresIn: "1d" },
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
userSchema.methods.isFavorite = async function (articleid) {
  const favorited = await Favorite.findOne(
    {
      userid: this._id,
      articleid,
    },
    "_id",
  )
    .lean()
    .exec();

  return !!favorited;
};

// @desc
// @required
userSchema.methods.favorite = async function (articleid) {
  try {
    await new Favorite({ userid: this._id, articleid }).save();
  } catch (err) {
    console.log(`Already favorited that article.`);
  }
};

// @desc
// @required
userSchema.methods.unfavorite = async function (articleid) {
  const result = await Favorite.deleteOne({ userid: this._id, articleid });

  if (result.deletedCount === 0) console.log(`Already deleted that favorite`);
};

module.exports = mongoose.model("User", userSchema);
