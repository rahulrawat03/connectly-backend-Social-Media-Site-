const router = require("express").Router();
const Conversation = require("../models/Conversation");

router.post("/", async (req, res) => {
  let conversation = await Conversation.findOne({
    members: [req.body.senderId, req.body.receiverId],
  });

  if (conversation) return res.status(200).send();

  conversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    await conversation.save();
    res.send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.body.userId, req.body.friendId] },
    }).sort({ createdAt: -1 });
    res.send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/conv/:convId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convId);
    return res.send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.send(conversations);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/markSeen/:convId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convId);

    let unseen = conversation.unseen || [];
    if (unseen.includes(req.body.userId))
      unseen = unseen.filter((u) => u !== req.body.userId);

    conversation.unseen = unseen;
    await conversation.save();

    return res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/markUnseen/:convId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convId);

    const unseen = conversation.unseen || [];
    if (!unseen.includes(req.body.userId)) unseen.push(req.body.userId);

    conversation.unseen = unseen;
    await conversation.save();
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
