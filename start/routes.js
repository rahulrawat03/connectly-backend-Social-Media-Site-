const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("../routes/users");
const authRoute = require("../routes/auth");
const postRoute = require("../routes/posts");
const uploadRoute = require("../routes/upload");
const eventRoute = require("../routes/events");
const productRoute = require("../routes/products");
const conversationRoute = require("../routes/conversations");
const messageRoute = require("../routes/messages");

module.exports = function (app) {
  app.use(cors());
  app.use(helmet());
  app.use(morgan("common"));
  app.use(express.json());
  app.use("/api/images", express.static("public/images"));
  app.use("/api/upload", uploadRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/posts", postRoute);
  app.use("/api/events", eventRoute);
  app.use("/api/products", productRoute);
  app.use("/api/conversations", conversationRoute);
  app.use("/api/messages", messageRoute);
};
