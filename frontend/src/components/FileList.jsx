import "./FileList.css";
import { FolderOpen } from "lucide-react";
import {
  FileText,
  Image,
  FileArchive,
  Music,
  Film,
  FileCode,
} from "lucide-react";

function getFileIcon(filename) {
  const name = filename.toLowerCase();

  if (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".gif") ||
    name.endsWith(".webp")
  ) {
    return <Image size={32} />;
  }

  if (name.endsWith(".pdf")) {
    return <FileText size={32} />;
  }

  if (name.endsWith(".zip") || name.endsWith(".rar")) {
    return <FileArchive size={32} />;
  }

  if (name.endsWith(".mp3") || name.endsWith(".wav")) {
    return <Music size={32} />;
  }

  if (name.endsWith(".mp4") || name.endsWith(".mov")) {
    return <Film size={32} />;
  }

  if (
    name.endsWith(".cpp") ||
    name.endsWith(".java") ||
    name.endsWith(".py") ||
    name.endsWith(".js")
  ) {
    return <FileCode size={32} />;
  }

  return <FileText size={32} />;
}
function isImage(filename) {
  const name = filename.toLowerCase();

  return (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".gif") ||
    name.endsWith(".webp")
  );
}
function FileList({ files, roomCode }) {
  async function deleteFile(fileId) {
    await fetch(
      `${import.meta.env.VITE_API_URL}/upload/${roomCode}/${fileId}`,
      {
        method: "DELETE",
      },
    );
  }

  if (files.length === 0) {
    return (
      <div className="section-card">
        <h2 className="section-title">Files</h2>

        <div className="empty-state">
          <FolderOpen size={48} />
          <p>No files uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h2 className="section-title">Files</h2>

      <div className="file-list">
        {files.map((file) => (
          <div className="file-card" key={file._id}>
            <div className="file-left">
              {isImage(file.name) ? (
                <img
                  className="file-preview"
                  src={`${import.meta.env.VITE_API_URL}/${file.path}`}
                  alt={file.name}
                />
              ) : (
                getFileIcon(file.name)
              )}

              <span className="file-name">{file.name}</span>
            </div>

            <div className="file-actions">
              <button
                className="action-btn download-btn"
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_URL}/upload/download/${roomCode}/${file._id}`;
                }}
              >
                Download
              </button>

              <button
                className="action-btn delete-btn"
                onClick={() => deleteFile(file._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileList;
