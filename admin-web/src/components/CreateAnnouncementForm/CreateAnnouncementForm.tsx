import { useState } from "react";
import Button from "../Button/Button";
import "./CreateAnnouncementForm.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => void;
}

export default function CreateAnnouncementForm({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      setError("Title và Content không được để trống");
      return;
    }

    onSubmit({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
    setError(null);
    onClose();
  };

  return (
    <div className="announcement-backdrop">
      <div className="announcement-modal">
        {/* Header */}
        <div className="modal-header">
          <h3>Create Announcement</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thông báo"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </div>
  );
}
