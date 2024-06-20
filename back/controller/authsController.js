const asyncHandler = require("express-async-handler");
const querystring = require("node:querystring");
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
const googleCallback = (req, res) => {
  const clientURL = process.env.CLIENT_URL;
  let finalURL = clientURL + "/login"; // prefix URL

  // console.log(`client url belike: `, CLIENT_URL);
  // console.log(`req.user belike: `, req.user);
  // console.log(`req.authError belike: `, req.authError);

  if (!req.user) {
    finalURL += "/failure";
    return res.redirect(finalURL);
  }

  const user = req.user; // extract logged in user

  finalURL += "/success";
  const subURL = querystring.encode(user);

  finalURL += "?" + subURL;

  console.log(`the finalURL belike: `, finalURL);

  return res.redirect(finalURL);
};

module.exports = {
  userLogin,
  googleCallback,
};
