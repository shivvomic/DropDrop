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

  // Cloudinary's fl_attachment throws a 400 Bad Request if the custom filename contains any dots (e.g., image.final.png -> fl_attachment:image.final).
  // To safely support all file names, we just use fl_attachment without a custom name.
  // Cloudinary will automatically use the public_id as the downloaded filename and append the correct extension.
  let downloadUrl = file.path;

  if (downloadUrl.includes("/upload/")) {
    downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
  }

  return res.redirect(downloadUrl);
}

module.exports = {
  uploadFile,
  deleteFile,
  downloadFile,
};