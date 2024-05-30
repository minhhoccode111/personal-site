const asyncHandler = require("express-async-handler");

const User = require("../models/User");

// @desc get a user's profile
// @route GET /api/profiles/:username
// @access Public
// @return User
const getProfile = asyncHandler(async (req, res) => {
  // extract the username param
  const { username } = req.params;
  // extract logged in state, either true or false

  // console.log(`print out username ${username}`)
  // find user with that name
  const user = await User.findOne({ username }).exec();

  // a 404 if not found user
  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  // return user profile
  return res.status(200).json({
    profile: user.toProfileJSON(),
  });
});

module.exports = {
  getProfile,
};
