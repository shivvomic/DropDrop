const express = require("express");

const {
  uploadFile,
  deleteFile,
  downloadFile,
} = require("../controllers/uploadController");

const upload = require("../middleware/uploadMiddleWare");

function uploadRoutes(io) {
  const router = express.Router();

  router.post("/:roomCode", upload.array("files", 10), (req, res) =>
    uploadFile(req, res, io),
  );

  router.delete("/:roomCode/:fileId", (req, res) => deleteFile(req, res, io));

  router.get("/download/:roomCode/:fileId", (req, res) =>
    downloadFile(req, res),
  );

  return router;
}

module.exports = uploadRoutes;
