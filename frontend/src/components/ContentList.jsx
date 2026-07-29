import { NotebookPen } from "lucide-react";
import ContentCard from "./ContentCard";

function ContentList({ contents, roomCode }) {
  return (
    <div className="section-card">
      <h2 className="section-title">Shared Content</h2>

      {contents.length === 0 ? (
        <div className="empty-state">
          <NotebookPen size={50} color="#9ca3af" />

          <p>No shared content yet</p>
        </div>
      ) : (
        contents.map((item) => (
          <ContentCard key={item._id} item={item} roomCode={roomCode} />
        ))
      )}
    </div>
  );
}

export default ContentList;
