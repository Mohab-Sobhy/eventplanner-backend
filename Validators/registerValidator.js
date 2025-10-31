const { body } = require("express-validator");

const registerValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
];

module.exports = { registerValidator };
