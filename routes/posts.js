const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    await post.save();
    return res.send(post);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.send("the post has been updated");
    } else {
      return res.status(403).send("you can update only your post");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.send("the post has been deleted");
    } else {
      return res.status(403).send("you can delete only your post");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.send("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.send("The post has been disliked");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = {
      userId: req.body.userId,
      username: req.body.username,
      desc: req.body.desc,
    };

    await post.updateOne({ $push: { comments: comment } });

    return res.send(post.comments);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.send(post);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.friends.map((friendId) => Post.find({ userId: friendId }))
    );
    return res.send(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    return res.send(posts);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
