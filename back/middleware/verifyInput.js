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

const verifyInputCreateArticle = [
  body("article", "Article object is required").isObject(),
  body("article.title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters")
    .escape(),

  body("article.description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters")
    .escape(),

  body("article.body")
    .trim()
    .notEmpty()
    .withMessage("Body is required")
    .isLength({ max: 30000 })
    .withMessage("Body must be less than 30000 characters")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const verifyInputUpdateArticle = [
  body("article", "Article object is required").isObject(),
  body("article.title")
    .trim()
    .optional({ values: "falsy" })
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters")
    .escape(),

  body("article.description")
    .trim()
    .optional({ values: "falsy" })
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters")
    .escape(),

  body("article.body")
    .trim()
    .optional({ values: "falsy" })
    .notEmpty()
    .withMessage("Body is required")
    .isLength({ max: 30000 })
    .withMessage("Body must be less than 30000 characters")
    .escape(),

  body("tags")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Tags must be an array")
    .custom((value, { req }) => {
      if (value.length > 0) {
        const isValid = value.every((tag) => typeof tag === "string");
        if (!isValid) {
          throw new Error("Each tag must be a string");
        }
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const verifyInputCreateComment = [
  body("comment", "Comment object is required").isObject(),

  body("article.body")
    .trim()
    .notEmpty()
    .withMessage("Comment body is required")
    .isLength({ max: 30000 })
    .withMessage("Comment body must be less than 30000 characters")
    .escape(),

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
  verifyInputCreateArticle,
  verifyInputUpdateArticle,
  verifyInputCreateComment,
};
