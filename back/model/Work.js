const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const workSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      maxLength: 100,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      maxLength: 3000,
      required: true,
      trim: true,
    },

    demo: {
      type: String,
      maxLength: 3000,
      required: true,
      trim: true,
    },

    github: {
      type: String,
      maxLength: 3000,
      required: true,
      trim: true,
    },

    difficulty: {
      type: Number,
      max: 5,
      min: 0,
    },
  },

  {
    timestamps: true,
  },
);

workSchema.plugin(uniqueValidator, {
  message: "Error, expect {PATH} to be unique",
});

workSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, replacement: "-" });

  next();
});

workSchema.methods.toWorkResponse = function () {
  return {
    id: this._id,
    slug: this.slug,
    demo: this.demo,
    title: this.title,
    image: this.image,
    github: this.github,
    difficulty: this.difficulty,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Work", workSchema);
