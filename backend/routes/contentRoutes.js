const express = require("express");

const {
  createContent,
  deleteContent,
} = require("../controllers/contentController");

function contentRoutes(io) {
  const router = express.Router();

  // Create content
  router.post("/:roomCode", (req, res) => createContent(req, res, io));

  // Delete content
  router.delete("/:roomCode/:contentId", (req, res) =>
    deleteContent(req, res, io),
  );

  return router;
}

module.exports = contentRoutes;
