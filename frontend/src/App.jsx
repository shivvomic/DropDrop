import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

import generateRoomCode from "./utils/generateRoomCode";

import Header from "./components/Header";
import RoomControls from "./components/RoomControls";
import ContentEditor from "./components/ContentEditor";
import UploadSection from "./components/UploadSection";
import FileList from "./components/FileList";
import ContentList from "./components/ContentList";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});
window.socket = socket;

function App() {
  const [theme, setTheme] = useState("dark");
  const [roomCode, setRoomCode] = useState("");

  const [content, setContent] = useState("");
  const [contents, setContents] = useState([]);

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  function createRoom() {
    const code = generateRoomCode().toUpperCase();

    setRoomCode(code);

    socket.emit("join-room", code);
  }

  function joinRoom(overrideCode) {
    const code = (overrideCode || roomCode).trim().toUpperCase();
    if (!code) return;
    setRoomCode(code);
    socket.emit("join-room", code);
  }

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected:", socket.id);

      if (roomCode) {
        socket.emit("join-room", roomCode);
      }
    };

    const handleRoomJoined = (room) => {
      console.log("Joined:", room);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && socket.disconnected) {
        socket.connect();
      }
    };

    const handleOnline = () => {
      if (roomCode) {
        socket.connect();
      }
    };

    socket.on("connect", handleConnect);
    socket.on("room-joined", handleRoomJoined);

    socket.on("load-files", setFiles);
    socket.on("file-uploaded", setFiles);

    socket.on("load-contents", setContents);
    socket.on("content-added", setContents);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room-joined", handleRoomJoined);

      socket.off("load-files", setFiles);
      socket.off("file-uploaded", setFiles);

      socket.off("load-contents", setContents);
      socket.off("content-added", setContents);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [roomCode]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="app">
      <RoomControls
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        createRoom={createRoom}
        joinRoom={joinRoom}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container">
        <Header />

        <div className="workspace">
          <ContentEditor
            roomCode={roomCode}
            content={content}
            setContent={setContent}
          />

          <UploadSection
            roomCode={roomCode}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setFiles={setFiles}
          />
        </div>

        <FileList files={files} roomCode={roomCode} />

        <ContentList contents={contents} roomCode={roomCode} />
      </main>
    </div>
  );
}

export default App;
