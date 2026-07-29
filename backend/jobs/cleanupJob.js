const cleanupRooms = require("../services/cleanupService");

function startCleanupJob() {
  console.log("Cleanup Job Started");

  setInterval(cleanupRooms, 60 * 1000 * 60);
}

module.exports = startCleanupJob;
