const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },

    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profileid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

// TODO: uniqueness for provider and profileid

// compound unique index for document uniqueness
credentialSchema.index({ userid: 1, articleid: 1 }, { unique: true });

// TODO: add indexes for needed fields

module.exports = mongoose.model("Credential", credentialSchema);
