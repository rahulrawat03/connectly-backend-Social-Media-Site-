const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).send(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.send("Account has been updated");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send("You can update only your account!");
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    return res.send(other);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    return res.send(friendList);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id/notes", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.send(user.notes);
  } catch (ex) {
    return res.status(500).send("Server error");
  }
});

router.put("/:id/notes", async (req, res) => {
  const add = req.body.add;
  try {
    const user = await User.findById(req.params.id);
    let newNotes = user.notes || [];

    if (add) newNotes.push({ title: req.body.title, note: req.body.note });
    else newNotes = newNotes.filter((note) => note.title !== req.body.title);

    user.notes = newNotes;
    await user.save();

    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.put("/:id/picture", upload.single("picture"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.profilePicture = req.file.filename;

    await user.save();
    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.put("/:id/cover", upload.single("cover"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.coverPicture = req.file.filename;

    await user.save();
    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.put("/:id/desc", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      desc: req.body.desc,
    });

    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.put("/:id/sendRequest", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);

    let sentRequests = user.requestsSent;
    let receivedRequests = friend.requestsReceived;

    if (sentRequests.includes(friend._id)) {
      sentRequests = sentRequests.filter((s) => !s.equals(friend._id));
      receivedRequests = receivedRequests.filter((r) => !r.equals(user._id));
      friend.notifications = [
        `${user.username} has taken his friend request back`,
        ...friend.notifications,
      ];
    } else {
      sentRequests.push(friend._id);
      receivedRequests.push(user._id);
      friend.notifications = [
        `${user.username} has sent you a friend request`,
        ...friend.notifications,
      ];
    }

    user.requestsSent = sentRequests;
    friend.requestsReceived = receivedRequests;
    friend.newNotifications = true;

    await user.save();
    await friend.save();

    return res.send(user);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.put("/:id/acceptRequest", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);

    let sentRequests = friend.requestsSent;
    let receivedRequests = user.requestsReceived;

    sentRequests = sentRequests.filter((s) => !s.equals(user._id));
    receivedRequests = receivedRequests.filter((r) => !r.equals(friend._id));

    user.requestsReceived = receivedRequests;
    friend.requestsSent = sentRequests;

    user.friends.push(friend._id);
    friend.friends.push(user._id);
    friend.notifications = [
      `${user.username} has accepted your friend request`,
      ...friend.notifications,
    ];
    friend.newNotifications = true;

    await user.save();
    await friend.save();

    return res.send(user);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.put("/:id/resetNotifications", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { newNotifications: false });
    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.get("/search/:query", async (req, res) => {
  try {
    const expression = new RegExp(req.params.query, "i");
    const usersWithName = await User.find({ username: expression });
    const usersWithMail = await User.find({ email: expression });

    const emailsWithName = new Set();
    for (let user of usersWithName) emailsWithName.add(user.email);

    const users = [...usersWithName];
    for (let user of usersWithMail) {
      if (!emailsWithName.has(user.email)) users.push(user);
    }

    return res.send(users);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
