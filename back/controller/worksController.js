const asyncHandler = require("express-async-handler");

const Work = require("../model/Work");
const debug = require("../constants/debug");

const getWorks = asyncHandler(async (req, res) => {
  const query = req.query;
  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;

  const [works, worksCount] = await Promise.all([
    Work.find({}).limit(limit).skip(offset).sort({ createdAt: -1 }).exec(),

    Work.countDocuments({}).exec(),
  ]);

  return res.json({
    works: works.map((work) => work.toWorkResponse()),
    worksCount,
  });
});

const createWork = asyncHandler(async (req, res) => {
  const { title, image, github, demo, difficulty } = req.body.work;

  const newWork = new Work({
    title,
    image,
    github,
    demo,
    difficulty,
  });

  try {
    await newWork.save();

    res.status(201).json({ work: newWork.toWorkResponse() });
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      err.errors &&
      err.errors.title &&
      err.errors.title.kind === "unique"
    ) {
      return res.status(409).json({
        errors: [
          {
            msg: "Work already exists",
          },
        ],
      });
    }

    // debug(`error create user belike: `, err);

    return res.status(422).json({
      errors: [
        {
          msg: "Unable to create work",
        },
      ],
    });
  }
});

const updateWork = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { work } = req.body;

  const updateWork = await Work.findOne({ slug }).exec();

  if (!updateWork) {
    return res.status(404).json({ errors: [{ msg: "Work Not Found" }] });
  }

  if (work.title) {
    updateWork.title = work.title;
  }

  if (work.image) {
    updateWork.image = work.image;
  }

  if (work.demo) {
    updateWork.demo = work.demo;
  }

  if (work.github) {
    updateWork.github = work.github;
  }

  if (work.difficulty) {
    updateWork.difficulty = work.difficulty;
  }

  try {
    await updateWork.save();

    res.status(200).json({ work: updateWork.toWorkResponse() });
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      err.errors &&
      err.errors.title &&
      err.errors.title.kind === "unique"
    ) {
      return res.status(409).json({
        errors: [
          {
            msg: "Work already exists",
          },
        ],
      });
    }

    // debug(`error create user belike: `, err);

    return res.status(422).json({
      errors: [
        {
          msg: "Unable to update work",
        },
      ],
    });
  }
});

const deleteWork = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  Work.deleteOne({ slug }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: [{ msg: "Unable to delete that work" }] });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ errors: [{ msg: "Work Not Found" }] });
    }

    return res
      .status(200)
      .json({ messages: [{ msg: "Work delete successfully" }] });
  });
});

module.exports = {
  getWorks,
  createWork,
  updateWork,
  deleteWork,
};
