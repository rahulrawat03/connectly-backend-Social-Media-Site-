const router = require("express").Router();
const multer = require("multer");
const Post = require("../models/Post");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const post = {
      userId: req.body.userId,
      desc: req.body.desc,
      img: req.file?.filename,
    };

    const newPost = new Post(post);
    try {
      const savedPost = await newPost.save();
      return res.status(200).send(savedPost);
    } catch (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send("File uploded successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
