const express = require("express");
const router = express.Router();

const {
  verifyInputCreateContact,
  verifyInputUpdateContact,
} = require("../middleware/verifyInput");

const verifyJWTAuthor = require("../middleware/verifyJWTAuthor");

const contactsController = require("../controller/contactsController");

// i get all contact messages
router.get("/", verifyJWTAuthor, contactsController.getContacts);

// guest post a contact message
router.post("/", verifyInputCreateContact, contactsController.createContact);

// i check a message to is already read
router.put(
  "/:contactid",
  verifyJWTAuthor,
  verifyInputUpdateContact,
  contactsController.updateContact,
);

// i delete a contact message
router.delete("/:contactid", verifyJWTAuthor, contactsController.deleteContact);

module.exports = router;
