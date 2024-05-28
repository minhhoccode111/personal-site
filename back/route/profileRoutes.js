const express = require("express");
const router = express.Router();
const profileController = require("../controller/profilesController");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");

// current user get profile - authentication optional
router.get("/:username", verifyJWTOptional, profileController.getProfile);

module.exports = router;
