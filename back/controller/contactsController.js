const asyncHandler = require("express-async-handler");
const Contact = require("../model/Contact");
const User = require("../model/User");

const getContacts = asyncHandler(async (req, res, next) => {
  // check if i am a real author
  const authorid = req.userId;
  let offset = 20;
  let limit = 20;

  if (req.query.offset) {
    offset = req.query.offset;
  }

  if (req.query.limit) {
    limit = req.query.limit;
  }

  const [user, contacts, contactsCount] = await Promise.all([
    User.findOne({ id: authorid }).exec(),
    Contact.find()
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: 1 })
      .exec(),
    Contact.countDocuments({}).exec(),
  ]);

  if (!user || !user.isAuthor) {
    return res.status(403).json({ errors: { body: "Forbidden" } });
  }

  return res.status(200).json({
    contacts,
    contactsCount,
  });
});

const updateContact = asyncHandler(async (req, res, next) => {});

const createContact = asyncHandler(async (req, res, next) => {});

const deleteContact = asyncHandler(async (req, res, next) => {});

module.exports = {
  getContacts,
  updateContact,
  createContact,
  deleteContact,
};
