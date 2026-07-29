require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const roomSocket = require("./socket/roomSocket");

const uploadRoutes = require("./routes/uploadRoutes");

const cleanupRooms = require("./services/cleanupService");

const startCleanupJob = require("./jobs/cleanupJob");

const contentRoutes = require("./routes/contentRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// app.use(
//   "/uploads",
//   express.static("uploads")
// );

app.use(
  "/content",

  contentRoutes(io),
);

roomSocket(io);
startCleanupJob();
app.use("/upload", uploadRoutes(io));

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("server running");
});
