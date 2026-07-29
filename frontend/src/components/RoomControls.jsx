import { useState } from "react";
import {
  Copy,
  Link,
  QrCode,
  Check,
  Plus,
  LogIn,
  Save,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import "./RoomControls.css";

function RoomControls({
  roomCode,
  setRoomCode,
  createRoom,
  joinRoom,
  theme,
  toggleTheme,
}) {
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);
  const [joined, setJoined] = useState(false);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinInput, setJoinInput] = useState("");

  async function handleCopy() {
    if (!roomCode) return;
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function handleCreate() {
    createRoom();
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
    }, 2000);
  }

  function handleJoinClick() {
    setShowJoinModal(true);
    setJoinInput("");
  }

  function submitJoin() {
    if (!joinInput.trim()) return;

    joinRoom(joinInput);

    setJoined(true);
    setShowJoinModal(false);

    setTimeout(() => {
      setJoined(false);
    }, 2000);
  }

  return (
    <nav className="room-navbar">
      <div className="brand-logo">
        <div className="logo-icon">📋</div>
        <span>
          Drop<span className="logo-purple">Drop</span>
        </span>
      </div>

      <div className="nav-controls">
        <div className="room-pill-container">
          <span className="room-label">Room:</span>
          <input
            className="room-input-nav"
            placeholder="CODE"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <div className="room-actions-nav">
            <button onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <button className="nav-btn-new" onClick={handleCreate}>
          {created ? (
            <>
              <Check size={16} /> Created
            </>
          ) : (
            <>
              <Plus size={16} /> New Room
            </>
          )}
        </button>

        <button className="nav-btn-new" onClick={handleJoinClick}>
          {joined ? (
            <>
              <Check size={16} /> Joined
            </>
          ) : (
            <>
              <LogIn size={16} /> Join Room
            </>
          )}
        </button>

        <button className="nav-btn-icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {showJoinModal && (
        <div
          className="join-modal-overlay"
          onClick={() => setShowJoinModal(false)}
        >
          <div className="join-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Join a Room</h3>
            <p>Enter the room code you received to join and collaborate.</p>

            <input
              className="join-modal-input"
              placeholder="Room Code"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && submitJoin()}
              autoFocus
            />

            <div className="join-modal-actions">
              <button
                className="join-modal-btn"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>
              <button className="join-modal-btn primary" onClick={submitJoin}>
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default RoomControls;
