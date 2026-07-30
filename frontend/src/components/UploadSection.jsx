import { useState } from "react";
import { UploadCloud, File, Loader2, Check } from "lucide-react";
import "./UploadSection.css";

function UploadSection({ roomCode, selectedFiles, setSelectedFiles,setFiles}) {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle");

  async function uploadFiles() {
    if (!roomCode || selectedFiles.length === 0 || status === "uploading")
      return;

    try {
      setStatus("uploading");

      const formData = new FormData();

      for (const file of selectedFiles) {
        formData.append("files", file);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/${roomCode}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const data = await response.json();

      setSelectedFiles([]);
      setFiles(data.files);

      setStatus("uploaded");

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  }

  function handleDrop(e) {
    e.preventDefault();

    setDragging(false);

    const files = [...e.dataTransfer.files];

    if (files.length) {
      setSelectedFiles(files);
    }
  }

  return (
    <div className="section-card upload-card">
      <h2 className="section-title">Upload Files</h2>

      <label
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <UploadCloud size={52} />

        <h3>Drag & Drop Files</h3>

        <p>or click to browse</p>

        <input
          className="upload-input"
          type="file"
          multiple
          onChange={(e) => setSelectedFiles([...e.target.files])}
        />
      </label>

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          {selectedFiles.map((file, index) => (
            <div key={index} className="selected-file">
              <File size={18} />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="upload-btn"
        disabled={selectedFiles.length === 0 || status === "uploading"}
        onClick={uploadFiles}
      >
        {status === "idle" && "Upload Files"}

        {status === "uploading" && (
          <>
            <Loader2 size={18} className="spin" />
            Uploading...
          </>
        )}

        {status === "uploaded" && (
          <>
            <Check size={18} />
            Uploaded
          </>
        )}
      </button>
    </div>
  );
}

export default UploadSection;
