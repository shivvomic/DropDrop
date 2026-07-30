const Room = require("../models/room");
const cloudinary = require("../config/cloudinary");

async function addFile(roomCode, files) {
  const room = await Room.findOne({ roomCode });

  if (!room) {
    return null;
  }

  for (const file of files) {
    room.files.push({
      name: file.originalname,
      path: file.path,
      publicId: file.filename,
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
    let resourceType = "raw";

    if (file.path.includes("/image/")) {
      resourceType = "image";
    } else if (file.path.includes("/video/")) {
      resourceType = "video";
    }

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: resourceType,
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
