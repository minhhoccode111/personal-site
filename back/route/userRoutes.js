const express = require("express");
const router = express.Router();
const userController = require("../controller/usersController");
const verifyJWT = require("../middleware/verifyJWT");

// Authentication
router.post("/users/login", userController.userLogin);

// Registration
router.post("/users", userController.registerUser);

// Get Current User Information
router.get("/user", verifyJWT, userController.getCurrentUser);

// Update Current User Information
router.put("/user", verifyJWT, userController.updateUser);

module.exports = router;
