const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: String,
    name: String,
    venue: String,
    date: String,
    time: String,
    desc: String,
    people: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
