const asyncHandler = require("express-async-handler");
const Work = require("../model/Work");

const getWorks = asyncHandler(async (req, res) => {
  const query = req.query;
  const limit = isNaN(Number(query.limit)) ? 20 : Number(query.limit);
  const offset = isNaN(Number(query.offset)) ? 0 : Number(query.offset);

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

  newWork.save(function (err) {
    if (err) {
      console.log(`error created new work: `, err);

      return res
        .status(422)
        .json({ errors: { body: "Unable to create work" } });
    }

    return res.json({
      work: newWork.toWorkResponse(),
    });
  });
});

const updateWork = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { work } = req.body;

  const updateWork = await Work.findOne({ slug }).exec();

  if (!updateWork) {
    return res.status(404).json({ errors: { body: "Work Not Found" } });
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

  updateWork.save(function (err) {
    if (err) {
      console.log(`error update work: `, err);

      return res
        .status(422)
        .json({ errors: { body: "Unable to update work" } });
    }

    return res.json({
      work: updateWork.toWorkResponse(),
    });
  });
});

const deleteWork = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  Work.deleteOne({ slug }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: { body: "Unable to delete that work" } });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ errors: { body: "Work Not Found" } });
    }

    return res
      .status(200)
      .json({ messages: { body: "Work delete successfully" } });
  });
});

module.exports = {
  getWorks,
  createWork,
  updateWork,
  deleteWork,
};
