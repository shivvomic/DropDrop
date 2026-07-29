const Room = require("../models/room");

function roomSocket(io) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-room", async (roomCode) => {
      try {
        if (!roomCode) {
          console.log("Empty room code");
          return;
        }

        roomCode = roomCode.trim().toUpperCase();

        // Leave previous room if joined
        if (socket.roomCode) {
          socket.leave(socket.roomCode);
          console.log(socket.id, "left", socket.roomCode);
        }

        let room = await Room.findOne({
          roomCode,
        });

        if (!room) {
          room = await Room.create({
            roomCode,
          });

          console.log("Created Room:", roomCode);
        }

        room.lastActive = Date.now();
        await room.save();

        socket.roomCode = roomCode;

        socket.join(roomCode);

        // Send latest room data
        socket.emit("load-files", room.files);

        socket.emit("load-contents", room.contents);

        socket.emit("room-joined", roomCode);

        console.log(socket.id, "joined", roomCode);
      } catch (err) {
        console.error("Join Room Error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
}

module.exports = roomSocket;
