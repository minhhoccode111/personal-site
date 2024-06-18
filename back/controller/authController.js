const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../model/User");

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const loginUser = await User.findOne({ email: user.email }).exec();

  console.log(`login user belike: `, loginUser);

  if (!loginUser)
    return res
      .status(401)
      .json({ errors: { body: "Unauthorized: Wrong email" } });

  const match = await bcrypt.compare(user.password, loginUser.password);

  if (!match)
    return res
      .status(401)
      .json({ errors: { body: "Unauthorized: Wrong password" } });

  res.status(200).json({ user: loginUser.toUserResponse() });
});

// @desc
// @route
// @access
// @required
// @return
const googleLogin = asyncHandler(async (req, res) => {
  return res.json({
    messages: {
      body: "Authorized",
    },
  });
});

// @desc
// @route
// @access
// @required
// @return
const googleSuccess = (req, res) => {
  console.log(`can access req.user?`, req.user);

  return res.status(200).json({
    messages: {
      body: "Authorized",
    },
  });
};

// @desc
// @route
// @access
// @required
// @return
const googleFailure = (req, res) => {
  console.log(`can access req.user?`, req.user);

  return res.status(401).json({
    messages: {
      body: "Unauthorized",
    },
  });
};

module.exports = {
  userLogin,
  googleLogin,
  googleSuccess,
  googleFailure,
};
