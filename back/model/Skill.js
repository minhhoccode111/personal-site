const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");

const skillSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      requried: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    image: {
      type: String,
      required: true,
      trim: true,
      maxLength: 3000,
    },

    level: {
      type: Number,
      min: 1,
      max: 5,
    },
  },

  {
    timestamps: true,
  },
);

skillSchema.plugin(uniqueValidator, {
  message: "Error, expect {PATH} to be unique",
});

skillSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, replacement: "-" });
  next();
});

skillSchema.methods.toSkillResponse = function () {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    image: this.image,
    level: this.level,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Skill", skillSchema);
