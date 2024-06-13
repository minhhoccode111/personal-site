const { body, validationResult } = require("express-validator");

const verifyInputRegisterUser = [
  body("user", "User object is required").isObject(),
  body("user.username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ max: 100 })
    .withMessage("Username must be less than 100 characters")
    .escape(),
  body("user.email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 8, max: 100 })
    .withMessage("Email must be between 8 and 100 characters")
    .normalizeEmail(), // instead of escape
  body("user.password")
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters")
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
  body("user.email", "Email is required").trim().escape(),
  body("user.password", "Password is required").trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const verifyInputUpdateUser = [
  body("user", "User object is required").isObject(),
  body("user.bio").trim().optional().isLength({ max: 1000 }).escape(),
  body("user.image").trim().optional().isLength({ max: 3000 }).escape(),
  body("user.username")
    .trim()
    .optional({ values: "falsy" })
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ max: 100 })
    .withMessage("Username must be less than 100 characters")
    .escape(),
  body("user.email")
    .trim()
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 8, max: 100 })
    .withMessage("Email must be between 8 and 100 characters")
    .normalizeEmail(), // instead of escape
  body("user.password")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters")
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
  verifyInputUserLogin,
  verifyInputUpdateUser,
};
