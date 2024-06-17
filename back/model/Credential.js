const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    provider: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true, // access createdAt, updatedAt
  },
);

// compound unique index for document uniqueness
// subject will be the profile.id return from google
// the provider will be 'google'
credentialSchema.index({ provider: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Credential", credentialSchema);
