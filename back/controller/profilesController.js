const asyncHandler = require("express-async-handler");

const User = require("../model/User");
const httpStatus = require("../constants/httpStatus");

// @desc get a user's profile
// @route GET /api/profiles/:userid
// @access Public
// @return User
const getProfile = asyncHandler(async (req, res) => {
  const { userid } = req.params;

  const user = await User.findById(userid).exec();

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      errors: [{ msg: "User Not Found" }],
    });
  }

  return res.status(httpStatus.OKAY).json({ profile: user.toProfileJSON() });
});

module.exports = {
  getProfile,
};
