const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: String,
    name: String,
    units: Number,
    price: String,
    img: String,
    desc: String,
    isBook: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
