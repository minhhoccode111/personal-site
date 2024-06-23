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

// user :slug for readability in the frontend
router.put(
  "/:slug",
  verifyJWTAuthor,
  verifyInputUpdateWork,
  worksController.updateWork,
);

router.delete("/:slug", verifyJWTAuthor, worksController.deleteWork);

module.exports = router;
