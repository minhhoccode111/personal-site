const asyncHandler = require("express-async-handler");

const Skill = require("../model/Skill");
const debug = require("../constants/debug");

const getSkills = asyncHandler(async (req, res) => {
  const query = req.query;
  const limit = isNaN(Number(query.limit)) ? 20 : Number(query.limit);
  const offset = isNaN(Number(query.offset)) ? 0 : Number(query.offset);

  const [skills, skillsCount] = await Promise.all([
    Skill.find({}).limit(limit).skip(offset).sort({ createdAt: -1 }).exec(),

    Skill.countDocuments({}).exec(),
  ]);

  return res.json({
    skills: skills.map((skill) => skill.toSkillResponse()),
    skillsCount,
  });
});

const createSkill = asyncHandler(async (req, res) => {
  const { title, image, level } = req.body.skill;

  const newSkill = new Skill({
    title,
    image,
    level,
  });

  newSkill.save(function (err) {
    if (err) {
      debug(`error created new skill: `, err);

      return res
        .status(422)
        .json({ errors: { body: "Unable to create skill" } });
    }

    return res.json({
      skill: newSkill.toSkillResponse(),
    });
  });
});

const updateSkill = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { skill } = req.body;

  const updateSkill = await Skill.findOne({ slug }).exec();

  if (!updateSkill) {
    return res.status(404).json({ errors: { body: "Skill Not Found" } });
  }

  if (skill.title) {
    updateSkill.title = skill.title;
  }

  if (skill.image) {
    updateSkill.image = skill.image;
  }

  if (skill.level) {
    updateSkill.level = skill.level;
  }

  updateSkill.save(function (err) {
    if (err) {
      debug(`error update skill: `, err);

      return res
        .status(422)
        .json({ errors: { body: "Unable to update skill" } });
    }

    return res.json({
      skill: updateSkill.toSkillResponse(),
    });
  });
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  Skill.deleteOne({ slug }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: { body: "Unable to delete that skill" } });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ errors: { body: "Skill Not Found" } });
    }

    return res
      .status(200)
      .json({ messages: { body: "Skill delete successfully" } });
  });
});

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
