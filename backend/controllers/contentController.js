const { addContent, deleteContent } = require("../services/contentService");

async function createContent(req, res, io) {
  const { roomCode } = req.params;
  const { text } = req.body;

  const room = await addContent(roomCode, text);

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  io.to(roomCode).emit("content-added", room.contents);

  res.json({
    success: true,
  });
}

async function removeContent(req, res, io) {
  const { roomCode, contentId } = req.params;

  const room = await deleteContent(roomCode, contentId);

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  io.to(roomCode).emit("content-added", room.contents);

  res.json({
    success: true,
  });
}

module.exports = {
  createContent,
  deleteContent: removeContent,
};
