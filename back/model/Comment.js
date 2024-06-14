const mongoose = require("mongoose");
const User = require("./User");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxLength: 30000,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      index: true, // comments are usually found using this field
    },
  },

  {
    timestamps: true,
  },
);

commentSchema.methods.toCommentResponse = async function (author) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: author
      ? author
      : await User.findById(this.author).exec().toProfileJSON(),
  };
};

module.exports = mongoose.model("Comment", commentSchema);
