const asyncHandler = require("express-async-handler");

const User = require("../model/User");

// @desc get a user's profile
// @route GET /api/profiles/:username
// @access Public
// @return User
const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  // username must be unique
  const user = await User.findOne({ username }).exec();

  if (!user) {
    return res.status(404).json({
      errors: { body: "User Not Found" },
    });
  }

  return res.status(200).json({
    profile: user.toProfileJSON(),
  });
});

module.exports = {
  getProfile,
};
