const Room = require("../models/room");

async function addContent(roomCode, text) {
  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    return null;
  }

  room.contents.push({
    text,
  });

  room.lastActive = Date.now();

  await room.save();

  return room;
}

async function deleteContent(roomCode, contentId) {
  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    return null;
  }

  room.contents = room.contents.filter(
    (content) => content._id.toString() !== contentId,
  );

  room.lastActive = Date.now();

  await room.save();

  return room;
}

module.exports = {
  addContent,
  deleteContent,
};
