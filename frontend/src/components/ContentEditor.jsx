import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";
import "./ContentEditor.css";

function ContentEditor({ roomCode, content, setContent }) {
  const [status, setStatus] = useState("idle");

  async function sendContent() {
    if (!content.trim() || status === "sending") return;

    try {
      setStatus("sending");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/content/${roomCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: content,
          }),
          // keepalive: true,
        },
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      setContent("");

      setStatus("sent");

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  }

  return (
    <div className="section-card editor-card">
      <textarea
        className="editor-textarea"
        placeholder="Start typing or pasting your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="editor-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginLeft: "auto",
          }}
        >
          <span className="char-count-mock">
            {content.length}/500000 characters
          </span>

          <button
            className="send-btn"
            onClick={sendContent}
            disabled={!content.trim() || status === "sending"}
          >
            {status === "idle" && (
              <>
                <Send size={16} />
                Send
              </>
            )}

            {status === "sending" && (
              <>
                <Loader2 size={16} className="spin" />
                Sending...
              </>
            )}

            {status === "sent" && (
              <>
                <Check size={16} />
                Sent
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentEditor;
