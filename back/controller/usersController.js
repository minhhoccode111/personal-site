const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../models/User");

// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
  // extract user object from body
  const { user } = req.body;

  // console.log(`user sign up belike: `, user);

  // validate data input (no sanitize)
  if (!user || !user.email || !user.username || !user.password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // hash password to store in db
  const hashedPwd = await bcrypt.hash(user.password, 10); // salt rounds

  // an object data object user provide
  const userObject = {
    username: user.username,
    password: hashedPwd,
    email: user.email,
  };

  const createdUser = new User(userObject);

  // mongoose-unique-validator help us to do this
  createdUser.save(function (err) {
    // error while create new user
    if (err) {
      return res.status(422).json({
        errors: {
          body: "Unable to register a user",
        },
      });
    }

    // successfully create user
    res.status(201).json({
      // response with needed information
      user: createdUser.toUserResponse(),
    });
  });
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
  // After authentication; email and hashsed password was stored in req
  const email = req.userEmail;

  // find user with payload's info in db
  const user = await User.findOne({ email }).exec();

  if (!user) {
    // if user not found, send 404 back to client
    return res.status(404).json({ message: "User Not Found" });
  }

  res.status(200).json({
    // schema method to response only information that we want and 1 day token
    // but exclude password, favorite posts
    user: user.toUserResponse(),
  });
});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
  const { user } = req.body;

  // confirm data
  if (!user || !user.email || !user.password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // find user with that email in db
  const loginUser = await User.findOne({ email: user.email }).exec();

  // console.log(loginUser);

  // if no user with that email
  if (!loginUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  // use bcrypt to compare encryted password with user input password
  const match = await bcrypt.compare(user.password, loginUser.password);

  // if password do not match
  if (!match)
    return res.status(401).json({ message: "Unauthorized: Wrong password" });

  res.status(200).json({
    // schema method to response only information that we want and 1 day token
    // but exclude password, favorite posts
    user: loginUser.toUserResponse(),
  });
});

// @desc update currently logged-in user
// Warning: if password or email is updated, client-side must update the token
// @route PUT /api/user
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
  const { user } = req.body;

  // confirm data
  if (!user) {
    return res.status(400).json({ message: "Required a User object" });
  }

  // extract email from payload after user logged in
  const email = req.userEmail;

  // retrive db with that email to find the user
  const target = await User.findOne({ email }).exec();

  // if data from client includes email
  if (user.email) {
    // then update email
    target.email = user.email;
  }

  // if data from client includes username
  if (user.username) {
    // then update
    target.username = user.username;
  }

  // if data from client includes password
  if (user.password) {
    // then update
    const hashedPwd = await bcrypt.hash(user.password, 10);
    target.password = hashedPwd;
  }

  // if data from client includes image
  if (typeof user.image !== "undefined") {
    // then update
    target.image = user.image;
  }

  // if data from client includes bio
  if (typeof user.bio !== "undefined") {
    // then update
    target.bio = user.bio;
  }

  // then save again, check for uniqueness
  target.save(function (err) {
    if (err) {
      return res.status(422).json({
        errors: {
          body: "Unable to update user",
        },
      });
    }

    res.status(200).json({
      // response with needed information
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
