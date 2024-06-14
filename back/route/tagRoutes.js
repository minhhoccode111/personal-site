const express = require("express");
const router = express.Router();
const tagsController = require("../controller/tagsController");

router.get("/", tagsController.getTags);

module.exports = router;
