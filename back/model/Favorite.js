const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userid: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },

  articleid: {
    ref: "Article",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

// NOTE: add plugin to handle uniqueness here?

// compound unique index for document uniqueness
favoriteSchema.index({ userid: 1, articleid: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
