const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: String,
  username: String,
  desc: String,
});

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
