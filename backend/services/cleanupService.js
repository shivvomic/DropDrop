const cloudinary = require("../config/cloudinary");
const Room = require("../models/room");

async function cleanupRooms() {
  const expiryTime = new Date(Date.now() - 60 * 60 * 1000);

  const expiredRooms = await Room.find({
    lastActive: {
      $lt: expiryTime,
    },
  });

  for (const room of expiredRooms) {
    for (const file of room.files) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType,
        });
      } catch (err) {
        console.error(`Failed to delete ${file.publicId}:`, err.message);
      }
    }

    await Room.deleteOne({
      _id: room._id,
    });

    console.log("Deleted Room:", room.roomCode);
  }
}

module.exports = cleanupRooms;
