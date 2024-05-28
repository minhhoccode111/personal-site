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
      default: "",
    },

    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },

    favoriteArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],

    followingUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // automatic add createdAt and updatedAt
  },
);

// @desc to handle unique field so that
// Schema.create() don't throw an Error when a unique field is conflicted
userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});

// @desc generate access token for a user
// @required valid email and password
userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    // payload 1 level deeper than I normal do
    {
      user: {
        // payload.user contains 3 fields instead of 1 like I normal do
        // which is really secure and probably impossible to fake
        id: this._id,
        email: this.email,
        password: this.password,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
  return accessToken;
};

// @desc get a user information
// NOTE: really big brain
userSchema.methods.toUserResponse = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    // schema method to generate 1 day access token
    token: this.generateAccessToken(),
  };
};

// @desc current user get someone else's profile information
// NOTE: really big brain
userSchema.methods.toProfileJSON = function (user) {
  return {
    // include some info
    username: this.username,
    bio: this.bio,
    image: this.image,
    // identify connection between current user with this profile user
    // if current user who request profile user is logged in
    // then identify following status between current user (argument user)
    // with the profile user by calling current user (argument user) with
    // profile user's _id, else return false
    following: user ? user.isFollowing(this._id) : false,
  };
};

// @desc identify following status between current user with profile user
// @required a user's id
userSchema.methods.isFollowing = function (id) {
  const idStr = id.toString();
  // loop through every id of user in current user's following list
  for (const followingUser of this.followingUsers) {
    // if profile's id existed in current user following list
    if (followingUser.toString() === idStr) {
      return true;
    }
  }
  return false;
};

// @desc add profile user's id to current user's followingUsers array
// @required a user's id
userSchema.methods.follow = function (id) {
  // only push to it if not existed
  // note that this method not prevent current user follow ownself
  if (this.followingUsers.indexOf(id) === -1) {
    this.followingUsers.push(id);
  }
  return this.save();
};

// @desc remove profile user's id from current user's followingUsers array
// @required a user's id
userSchema.methods.unfollow = function (id) {
  // only remove from it if not existed
  if (this.followingUsers.indexOf(id) !== -1) {
    // this is special method for Id array in mongodb
    this.followingUsers.remove(id);
  }
  return this.save();
};

// @desc identify whether current user mark article's id as favorite
// @required an article's id
userSchema.methods.isFavorite = function (id) {
  const idStr = id.toString();
  // loop through every id of article in current user's favorite list
  for (const article of this.favoriteArticles) {
    // if article's id existed in current user favorite list
    if (article.toString() === idStr) {
      return true;
    }
  }
  return false;
};

// @desc add article's id to current user's favorite array
// @required an article's id
userSchema.methods.favorite = function (id) {
  if (this.favoriteArticles.indexOf(id) === -1) {
    // only push to it if not existed
    this.favoriteArticles.push(id);
  }

  // NOTE: no need to keep favoritesCount in sync because every time
  // const article = await Article.findById(id).exec();
  //
  // article.favoritesCount += 1;
  //
  // await article.save();

  return this.save();
};

// @desc remove article's id from current user's favorite array
// @required an article's id
userSchema.methods.unfavorite = function (id) {
  if (this.favoriteArticles.indexOf(id) !== -1) {
    // only remove if existed
    this.favoriteArticles.remove(id);
  }

  // const article = await Article.findById(id).exec();
  //
  // article.favoritesCount -= 1;
  //
  // await article.save();

  return this.save();
};

module.exports = mongoose.model("User", userSchema);
