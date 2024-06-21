const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      maxLength: 3000,
      trim: true,
    },

    isAlreadyRead: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

contactSchema.methods.toContactResponse = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    message: this.message,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Contact", contactSchema);
