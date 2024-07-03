const express = require("express");
const router = express.Router();
const httpStatus = require("../constants/httpStatus");

// const Work = require("../model/Work");
const debug = require("../constants/debug");

const asyncHandler = require("express-async-handler");

// test that db is up, server is up, etc.
router.get(
  "/",
  asyncHandler(async (_, res) => {
    debug("successful!");
    // await Work.deleteMany();
    res.status(httpStatus.OKAY).json({ messages: { body: "successful" } });
  }),
);

module.exports = router;
