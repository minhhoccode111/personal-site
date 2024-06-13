const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const Favorite = require("./Favorite");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
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
      default: "Bio is created automatically, please consider edit",
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
    timestamps: true, // access createdAt, updatedAt
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
userSchema.methods.isFavorite = async (articleid) => {
  const favorite = await Favorite.findOne(
    {
      userid: this._id,
      articleid,
    },
    "_id",
  )
    .lean()
    .exec();

  return !!favorite;
};

// @desc
// @required
userSchema.methods.favorite = async (articleid) => {
  try {
    await new Favorite({ userid: this._id, articleid }).save();
  } catch (err) {
    console.log(`Already favorited that article.`);
  }
};

// @desc
// @required
userSchema.methods.unfavorite = async (articleid) => {
  await Favorite.deleteOne({ userid: this._id, articleid });
};

module.exports = mongoose.model("User", userSchema);
