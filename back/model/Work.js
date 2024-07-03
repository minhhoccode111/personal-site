const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const workSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      maxLength: 100,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      maxLength: 3000,
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
  message: "Error, expected {PATH} to be unique",
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
    createdAt: this.createdAt,
    difficulty: this.difficulty,
    description: this.description,
  };
};

module.exports = mongoose.model("Work", workSchema);
