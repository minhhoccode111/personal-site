const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../model/User");

// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
  const { user } = req.body;

  console.log(`user sign up belike: `, user);

  // process.env.SALT no need await but a number 13 is needed
  const hashedPwd = await bcrypt.hash(user.password, process.env.SALT);

  const userObject = {
    username: user.username,
    password: hashedPwd,
    email: user.email,
  };

  const createdUser = new User(userObject);

  createdUser.save(function (err) {
    if (err) {
      return res.status(422).json({
        errors: {
          body: "Unable to register a user",
        },
      });
    }

    res.status(201).json({ user: createdUser.toUserResponse() });
  });
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
  const email = req.userEmail;

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res.status(404).json({ errors: { body: "User Not Found" } });

  res.status(200).json({ user: user.toUserResponse() });
});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const loginUser = await User.findOne({ email: user.email }).exec();

  console.log(loginUser);

  if (!loginUser)
    return res.status(404).json({ errors: { body: "User Not Found" } });

  const match = await bcrypt.compare(user.password, loginUser.password);

  if (!match)
    return res
      .status(401)
      .json({ errors: { body: "Unauthorized: Wrong password" } });

  res.status(200).json({ user: loginUser.toUserResponse() });
});

// @desc update currently logged-in user
// @warning if password or email is updated, client-side must update the token
// @route PUT /api/user
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const email = req.userEmail;

  const target = await User.findOne({ email }).exec();

  if (user.email) {
    target.email = user.email;
  }

  if (user.username) {
    target.username = user.username;
  }

  if (user.password) {
    const hashedPwd = await bcrypt.hash(user.password, 10);
    target.password = hashedPwd;
  }

  if (typeof user.image !== "undefined") {
    target.image = user.image;
  }

  if (typeof user.bio !== "undefined") {
    target.bio = user.bio;
  }

  // then save again, check for uniqueness of email
  target.save(function (err) {
    if (err) {
      return res.status(422).json({
        errors: {
          body: "Unable to update user",
        },
      });
    }

    res.status(200).json({
      user: target.toUserResponse(),
    });
  });
});

module.exports = {
  registerUser,
  getCurrentUser,
  userLogin,
  updateUser,
};
