const asyncHandler = require("express-async-handler");

const Contact = require("../model/Contact");

const httpStatus = require("../constants/httpStatus");

const getContacts = asyncHandler(async (req, res) => {
  // check if i am a real author
  const query = req.query;
  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;

  const [contacts, contactsCount] = await Promise.all([
    Contact.find().limit(limit).skip(offset).sort({ createdAt: 1 }).exec(),
    Contact.countDocuments({}).exec(),
  ]);

  return res.status(httpStatus.OKAY).json({
    contacts: contacts.map((contact) => contact.toContactResponse()),
    contactsCount,
  });
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, body } = req.body.contact;

  const newContact = new Contact({
    name,
    email,
    body,
  });

  await newContact.save();

  return res.json({
    contact: newContact.toContactResponse(),
  });
});

const updateContact = asyncHandler(async (req, res) => {
  const { contactid } = req.params;
  const { markAsRead } = req.body.contact;

  const contact = await Contact.findById(contactid).exec();

  if (!contact) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ errors: [{ msg: "Contact Not Found" }] });
  }

  contact.markAsRead = markAsRead;
  await contact.save();

  return res.json({
    contact: contact.toContactResponse(),
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const { contactid } = req.params;

  Contact.deleteOne({ _id: contactid }, function (err, result) {
    if (err) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .json({ errors: [{ msg: "Unable to delete that contact" }] });
    }

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ errors: [{ msg: "Contact Not Found" }] });
    }

    return res
      .status(httpStatus.OKAY)
      .json({ messages: [{ msg: "Contact Delete Successfully" }] });
  });
});

module.exports = {
  getContacts,
  updateContact,
  createContact,
  deleteContact,
};
