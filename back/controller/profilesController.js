const asyncHandler = require("express-async-handler");

const User = require("../model/User");

// @desc get a user's profile
// @route GET /api/profiles/:userid
// @access Public
// @return User
const getProfile = asyncHandler(async (req, res) => {
  const { userid } = req.params;

  const user = await User.findById(userid).exec();

  if (!user) {
    return res.status(404).json({
      errors: [{ msg: "User Not Found" }],
    });
  }

  return res.status(200).json({ profile: user.toProfileJSON() });
});

module.exports = {
  getProfile,
};
