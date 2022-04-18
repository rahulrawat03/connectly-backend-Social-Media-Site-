const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: String,
  note: String,
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    requestsSent: {
      type: Array,
      default: [],
    },
    requestsReceived: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
    },
    notes: {
      type: [notesSchema],
      default: [],
    },
    notifications: {
      type: [String],
      default: [],
    },
    newNotifications: {
      type: Boolean,
      default: false,
    },
    events: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
