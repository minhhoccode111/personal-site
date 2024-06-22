const express = require("express");
const router = express.Router();

const verifyJWTAuthor = require("../middleware/verifyJWTAuthor");

const worksController = require("../controller/worksController");

const {
  verifyInputCreateWork,
  verifyInputUpdateWork,
} = require("../middleware/verifyInput");

router.get("/", worksController.getWorks);

router.post(
  "/",
  verifyJWTAuthor,
  verifyInputCreateWork,
  worksController.createWork,
);

router.put(
  "/:workid",
  verifyJWTAuthor,
  verifyInputUpdateWork,
  worksController.updateWork,
);

router.delete("/:workid", verifyJWTAuthor, worksController.deleteWork);

module.exports = router;
