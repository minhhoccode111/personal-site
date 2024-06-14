const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");

// test that db is up, server is up, etc.
router.get(
  "/",
  asyncHandler(async (_, res) => {
    console.log("successful!");
    res.status(200).json({ message: "successful" });
  }),
);

module.exports = router;
