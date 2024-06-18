const express = require("express");
const router = express.Router();

const userController = require("../controller/usersController");
const verifyJWT = require("../middleware/verifyJWT");

const {
  verifyInputUpdateUser,
  verifyInputRegisterUser,
} = require("../middleware/verifyInput");

// @desc registration for a user
// @required fields user{email, username, password}
router.post("/users", verifyInputRegisterUser, userController.registerUser);

router.get("/user", verifyJWT, userController.getCurrentUser);

// @desc update currently logged-in user
// @optional fields user{bio, image, username, email, password}
router.put(
  "/user",
  verifyJWT,
  verifyInputUpdateUser,
  userController.updateUser,
);

module.exports = router;
