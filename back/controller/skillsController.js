const asyncHandler = require("express-async-handler");

const Skill = require("../model/Skill");
const debug = require("../constants/debug");
const httpStatus = require("../constants/httpStatus");

const getSkills = asyncHandler(async (req, res) => {
  const query = req.query;
  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;

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

  try {
    await newSkill.save();

    res.status(httpStatus.CREATED).json({ skill: newSkill.toSkillResponse() });
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      err.errors &&
      err.errors.title &&
      err.errors.title.kind === "unique"
    ) {
      return res.status(httpStatus.CONFLICT).json({
        errors: [
          {
            msg: "Skill already exists",
          },
        ],
      });
    }

    // debug(`error create user belike: `, err);

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      errors: [
        {
          msg: "Unable to create skill",
        },
      ],
    });
  }
});

const updateSkill = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { skill } = req.body;

  const updateSkill = await Skill.findOne({ slug }).exec();

  if (!updateSkill) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ errors: [{ msg: "Skill Not Found" }] });
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

  try {
    await updateSkill.save();

    res.status(httpStatus.OKAY).json({ skill: updateSkill.toSkillResponse() });
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      err.errors &&
      err.errors.title &&
      err.errors.title.kind === "unique"
    ) {
      return res.status(httpStatus.CONFLICT).json({
        errors: [
          {
            msg: "Skill already exists",
          },
        ],
      });
    }

    // debug(`error create user belike: `, err);

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      errors: [
        {
          msg: "Unable to update skill",
        },
      ],
    });
  }
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  Skill.deleteOne({ slug }, function (err, result) {
    if (err) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .json({ errors: [{ msg: "Unable to delete that skill" }] });
    }

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ errors: [{ msg: "Skill Not Found" }] });
    }

    return res
      .status(httpStatus.OKAY)
      .json({ messages: [{ msg: "Skill delete successfully" }] });
  });
});

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
