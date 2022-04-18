const router = require("express").Router();
const Event = require("../models/Event");

router.get("/", async (req, res) => {
  try {
    const response = await Event.find().sort({ createdAt: -1 });
    return res.send(response);
  } catch (ex) {
    console.log(ex);
  }
});

router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();

    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    let people = event.people;
    const userId = req.body.userId;

    if (people.includes(userId)) people = people.filter((p) => p !== userId);
    else people.push(userId);

    event.people = people;
    await event.save();

    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
  }
});

router.get("/search/:query", async (req, res) => {
  try {
    const expression = new RegExp(req.params.query, "i");
    const events = await Event.find({ name: expression });
    return res.send(events);
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
