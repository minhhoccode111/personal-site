const asyncHandler = require("express-async-handler");
const Contact = require("../model/Contact");

const getContacts = asyncHandler(async (req, res) => {
  // check if i am a real author
  let offset = 20;
  let limit = 20;

  if (req.query.offset) {
    offset = req.query.offset;
  }

  if (req.query.limit) {
    limit = req.query.limit;
  }

  const [contacts, contactsCount] = await Promise.all([
    Contact.find()
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: 1 })
      .exec(),
    Contact.countDocuments({}).exec(),
  ]);

  return res.status(200).json({
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
    return res.status(404).json({ errors: { body: "Contact Not Found" } });
  }

  contact.markAsRead = markAsRead;
  await contact.save();

  return res.json({
    contact: contact.toContactResponse(),
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const { contactid } = req.params;

  Contact.deleteOne({ id: contactid }, function (err, result) {
    if (err) {
      return res
        .status(422)
        .json({ errors: { body: "Unable to delete that contact" } });
    }

    if (result.deleteCount === 0) {
      return res.status(404).json({ errors: { body: "Contact Not Found" } });
    }

    return res
      .status(200)
      .json({ messages: { body: "Contact Delete Successfully" } });
  });
});

module.exports = {
  getContacts,
  updateContact,
  createContact,
  deleteContact,
};
