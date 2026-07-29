import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import "./ContentCard.css";

function ContentCard({ item, roomCode }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(item.text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteContent() {
    try {
      setDeleting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/content/${roomCode}/${item._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="content-card">
      <div className="content-grid">
        <pre className="content-text">{item.text}</pre>

        <div className="content-actions">
          <button className="copy-btn" onClick={copyContent}>
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>

          <button
            className="delete-btn"
            onClick={deleteContent}
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
