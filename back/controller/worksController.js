const asyncHandler = require("express-async-handler");
const Work = require("../model/Work");

const getWorks = asyncHandler(async (req, res) => {
  let limit = 20;
  let offset = 20;

  if (req.query.limit) {
    limit = req.query.limit;
  }

  if (req.query.offset) {
    offset = req.query.offset;
  }

  const [works, worksCount] = await Promise.all([
    Work.find({})
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: -1 })
      .exec(),

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
  const { workid } = req.params;
  const { work } = req.body;

  const updateWork = await Work.findById(workid).exec();

  if (!updateWork) {
    return res.status(404).json({ errors: { body: "Work Not Found" } });
  }

  if (work.title) {
    work.title = work.title;
  }

  if (work.image) {
    work.image = work.image;
  }

  if (work.demo) {
    work.demo = work.demo;
  }

  if (work.github) {
    work.github = work.github;
  }

  if (work.difficulty) {
    work.difficulty = work.difficulty;
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
  const { workid } = req.params;

  Work.deleteOne({ id: workid }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: { body: "Unable to delete that work" } });
    }

    if (result.deleteCount === 0) {
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
