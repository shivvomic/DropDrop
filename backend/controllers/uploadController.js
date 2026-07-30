// const path = require("path");

const cloudinary = require("../config/cloudinary");

const Room = require("../models/room");

const {
  addFile,
  deleteFile: deleteFileService,
} = require("../services/fileService");

async function uploadFile(req, res, io) {
  const { roomCode } = req.params;

  const room = await addFile(roomCode, req.files);

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  io.to(roomCode).emit("file-uploaded", room.files);

  res.json({
    success: true,
    files: room.files,
  });
}

async function deleteFile(req, res, io) {
  const { roomCode, fileId } = req.params;

  const room = await deleteFileService(roomCode, fileId);

  if (!room) {
    return res.status(404).json({
      message: "Room or file not found",
    });
  }

  io.to(roomCode).emit("file-uploaded", room.files);

  res.json({
    success: true,
  });
}

async function downloadFile(req, res) {
  const { roomCode, fileId } = req.params;

  const room = await Room.findOne({ roomCode });

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  const file = room.files.id(fileId);

  if (!file) {
    return res.status(404).json({
      message: "File not found",
    });
  }

  const url = cloudinary.url(file.publicId, {
    resource_type: file.resourceType,

    flags: "attachment",

    attachment: file.name,
  });
  console.log({
  publicId: file.publicId,
  resourceType: file.resourceType,
  generatedUrl: url,
});

  return res.redirect(url);
}

module.exports = {
  uploadFile,
  deleteFile,
  downloadFile,
};
