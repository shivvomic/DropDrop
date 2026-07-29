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

const socket = io(import.meta.env.VITE_SOCKET_URL);
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
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("room-joined", (room) => {
      console.log("Joined:", room);
    });

    socket.on("load-files", setFiles);
    socket.on("file-uploaded", setFiles);

    socket.on("load-contents", setContents);
    socket.on("content-added", setContents);

    return () => {
      socket.off("connect");
      socket.off("room-joined");

      socket.off("load-files");
      socket.off("file-uploaded");

      socket.off("load-contents");
      socket.off("content-added");
    };
  }, []);

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
          />
        </div>

        <FileList files={files} roomCode={roomCode} />

        <ContentList contents={contents} roomCode={roomCode} />
      </main>
    </div>
  );
}

export default App;
