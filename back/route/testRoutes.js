const express = require("express");
const router = express.Router();

// const Work = require("../model/Work");

const asyncHandler = require("express-async-handler");

// test that db is up, server is up, etc.
router.get(
  "/",
  asyncHandler(async (_, res) => {
    console.log("successful!");
    // await Work.deleteMany();
    res.status(200).json({ messages: { body: "successful" } });
  }),
);

module.exports = router;
