const asyncHandler = require("express-async-handler");
const Skill = require("../model/Skill");

const getSkills = asyncHandler(async (req, res) => {
  let limit = 20;
  let offset = 20;

  if (req.query.limit) {
    limit = req.query.limit;
  }

  if (req.query.offset) {
    offset = req.query.offset;
  }

  const [skills, skillsCount] = await Promise.all([
    Skill.find({})
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: -1 })
      .exec(),

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
      console.log(`error created new skill: `, err);

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
  const { skillid } = req.params;
  const { skill } = req.body;

  const updateSkill = await Skill.findById(skillid).exec();

  if (!updateSkill) {
    return res.status(404).json({ errors: { body: "Skill Not Found" } });
  }

  if (skill.title) {
    skill.title = skill.title;
  }

  if (skill.image) {
    skill.image = skill.image;
  }

  if (skill.level) {
    skill.level = skill.level;
  }

  updateSkill.save(function (err) {
    if (err) {
      console.log(`error update skill: `, err);

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
  const { skillid } = req.params;

  Skill.deleteOne({ id: skillid }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: { body: "Unable to delete that skill" } });
    }

    if (result.deleteCount === 0) {
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
