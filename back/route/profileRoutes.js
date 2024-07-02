const express = require("express");
const router = express.Router();
const profileController = require("../controller/profilesController");
const verifyJWTOptional = require("../middleware/verifyJWTOptional");

router.get("/:userid", verifyJWTOptional, profileController.getProfile);

module.exports = router;
