const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../model/User");
const debug = require("../constants/debug");
const httpStatus = require("../constants/httpStatus");

// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
  const { user } = req.body;

  debug(`user sign up belike: `, user);

  const SALT = Number(process.env.SALT) || 13;
  const hashedPwd = await bcrypt.hash(user.password, SALT);

  const userObject = {
    username: user.username,
    password: hashedPwd,
    email: user.email,
  };

  const createdUser = new User(userObject);

  try {
    await createdUser.save();

    res.status(httpStatus.CREATED).json({ user: createdUser.toUserResponse() });
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      err.errors &&
      err.errors.email &&
      err.errors.email.kind === "unique"
    ) {
      return res.status(httpStatus.CONFLICT).json({
        errors: [
          {
            msg: "Email already exists",
          },
        ],
      });
    }

    // debug(`error create user belike: `, err);

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      errors: [
        {
          msg: "Unable to register user",
        },
      ],
    });
  }
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
  const email = req.userEmail;

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ errors: [{ msg: "User Not Found" }] });

  res.status(httpStatus.OKAY).json({ user: user.toUserResponse() });
});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const loginUser = await User.findOne({ email: user.email }).exec();

  debug(loginUser);

  if (!loginUser)
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ errors: [{ msg: "User Not Found" }] });

  const match = await bcrypt.compare(user.password, loginUser.password);

  if (!match)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ errors: [{ msg: "Unauthorized: Wrong password" }] });

  res.status(httpStatus.OKAY).json({ user: loginUser.toUserResponse() });
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

  debug(`target belike: `, target);

  if (target.isGoogleAuth && user.email) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      errors: [
        {
          msg: "Google Auth users are now allowed to update email",
        },
      ],
    });
  }

  // Google Auth user can update their password to login with email + password
  if (user.password) {
    const processSalt = process.env.SALT;
    const SALT = Number(processSalt) || 13;
    const newPassword = await bcrypt.hash(user.password, SALT);
    target.password = newPassword;
  }

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
  try {
    await target.save();

    res.status(httpStatus.OKAY).json({ user: target.toUserResponse() });
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      err.errors &&
      err.errors.email &&
      err.errors.email.kind === "unique"
    ) {
      return res.status(httpStatus.CONFLICT).json({
        errors: [
          {
            msg: "Email already exists",
          },
        ],
      });
    }

    // debug(`error create user belike: `, err);

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      errors: [
        {
          msg: "Unable to update user",
        },
      ],
    });
  }
});

module.exports = {
  registerUser,
  getCurrentUser,
  userLogin,
  updateUser,
};
