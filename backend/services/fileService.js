const Room = require("../models/room");
const cloudinary = require("../config/cloudinary");

async function addFile(roomCode, files) {
  const room = await Room.findOne({ roomCode });

  if (!room) {
    return null;
  }

  for (const file of files) {
    const resourceType = file.resource_type || (file.mimetype.startsWith("image/") ? "image" : "raw");
    console.log({
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      resource_type: file.resource_type,});

    room.files.push({
      name: file.originalname,
      path: file.path,
      publicId: file.filename,
      resourceType,
    });
  }

  room.lastActive = Date.now();

  await room.save();

  return room;
}

async function deleteFile(roomCode, fileId) {
  const room = await Room.findOne({ roomCode });

  if (!room) {
    return null;
  }

  const file = room.files.id(fileId);

  if (!file) {
    return null;
  }

  try {
    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
    });
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }

  room.files.pull(fileId);

  room.lastActive = Date.now();

  await room.save();

  return room;
}

module.exports = {
  addFile,
  deleteFile,
};
