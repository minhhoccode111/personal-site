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

    authorid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    articleid: {
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
  const result = {
    id: this._id,
    body: this.body,
    articleid: this.articleid,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };

  // reduce database retrieve if pass the comment author to this method
  if (author) {
    result.author = author.toProfileJSON();
    return result;
  } else {
    const commentAuthor = await User.findById(this.authorid).exec();
    result.author = commentAuthor.toProfileJSON();
    return result;
  }
};

module.exports = mongoose.model("Comment", commentSchema);
