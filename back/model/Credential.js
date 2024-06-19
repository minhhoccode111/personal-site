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
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

// compound index and uniqueness at the same time
credentialSchema.index({ userid: 1, articleid: 1 }, { unique: true });

module.exports = mongoose.model("Credential", credentialSchema);
