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
      index: true, // always find comments using this
    },
  },

  {
    timestamps: true,
  },
);

commentSchema.methods.toCommentResponse = async function () {
  const authorObj = await User.findById(this.author).exec();

  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: authorObj.toProfileJSON(), // to display name and image
  };
};

module.exports = mongoose.model("Comment", commentSchema);
