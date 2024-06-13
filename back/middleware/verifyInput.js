const { body, validationResult } = require("express-validator");

const verifyInputRegisterUser = [
  body("user", "User object is required").isObject(),
  body("user.email", "Invalid email address").isEmail().trim().escape(),
  body("user.username", "Username is required")
    .trim()
    .notEmpty()
    .escape()
    .blacklist("<>"), // remove < and > from string
  body("user.password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const verifyInputUserLogin = [
  body("user", "User object is required").isObject(),
  body("user.email", "Invalid email address").isEmail().trim().escape(),
  body("user.username", "Username is required")
    .trim()
    .notEmpty()
    .escape()
    .blacklist("<>"), // remove < and > from string
  body("user.password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  verifyInputRegisterUser,
};
