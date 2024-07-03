const asyncHandler = require("express-async-handler");
const querystring = require("node:querystring");
const bcrypt = require("bcrypt");

const User = require("../model/User");
const debug = require("../constants/debug");
const httpStatus = require("../constants/httpStatus");

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const loginUser = await User.findOne({ email: user.email }).exec();

  debug(`login user belike: `, loginUser);

  if (!loginUser)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ errors: [{ msg: "Unauthorized: Wrong email" }] });

  const match = await bcrypt.compare(user.password, loginUser.password);

  if (!match)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ errors: [{ msg: "Unauthorized: Wrong password" }] });

  res.status(httpStatus.OKAY).json({ user: loginUser.toUserResponse() });
});

// @desc
// @route
// @access
// @required
// @return
const googleCallback = (req, res) => {
  const clientRedirectURL = process.env.CLIENT_REDIRECT_URL;

  // debug(`client url belike: `, CLIENT_URL);
  // debug(`req.user belike: `, req.user);
  // debug(`req.authError belike: `, req.authError);

  if (!req.user) return res.redirect(clientRedirectURL + "/failure");

  const user = req.user;
  const subURL = querystring.encode(user);
  const finalURL = clientRedirectURL + `/success?${subURL}`;

  // debug(`the finalURL belike: `, finalURL);

  return res.redirect(finalURL);
};

module.exports = {
  userLogin,
  googleCallback,
};
