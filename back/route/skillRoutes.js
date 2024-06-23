const express = require("express");
const router = express.Router();

const verifyJWTAuthor = require("../middleware/verifyJWTAuthor");

const skillsController = require("../controller/skillsController");

const {
  verifyInputCreateSkill,
  verifyInputUpdateSkill,
} = require("../middleware/verifyInput");

router.get("/", skillsController.getSkills);

router.post(
  "/",
  verifyJWTAuthor,
  verifyInputCreateSkill,
  skillsController.createSkill,
);

router.put(
  "/:slug",
  verifyJWTAuthor,
  verifyInputUpdateSkill,
  skillsController.updateSkill,
);

router.delete("/:slug", verifyJWTAuthor, skillsController.deleteSkill);

module.exports = router;
