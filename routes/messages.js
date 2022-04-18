const router = require("express").Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  const message = new Message(req.body);
  try {
    await message.save();
    res.send(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });
    res.send(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
