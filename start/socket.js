const socket = require("socket.io");
const http = require("http");

module.exports = function (app) {
  const server = http.createServer(app);
  const io = socket(server, {
    cors: {
      origin: "*",
    },
  });

  let users = [];

  const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId))
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      console.log(userId);
    });

    socket.on("sendMessage", ({ userId, friendId, text }) => {
      const receiver = getUser(friendId);
      if (receiver) {
        io.to(receiver.socketId).emit("receiveMessage", {
          senderId: userId,
          text,
        });
      }
    });

    socket.on("sendBadge", ({ friendId, convId }) => {
      const receiver = getUser(friendId);
      if (receiver) {
        io.to(receiver.socketId).emit("receiveBadge", convId);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("disconnected");
    });
  });

  server.listen(3001, () => {
    console.log("Listening on port 3001...");
  });
  return server;
};
