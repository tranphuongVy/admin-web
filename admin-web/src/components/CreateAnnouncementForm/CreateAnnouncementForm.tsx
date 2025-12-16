// import { useState } from "react";
// import Button from "../Button/Button";
// import "./CreateAnnouncementForm.css";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: { title: string; content: string }) => void;
// }

// export default function CreateAnnouncementForm({
//   open,
//   onClose,
//   onSubmit,
// }: Props) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   if (!open) return null;

//   const handleSubmit = () => {
//     if (!title.trim() || !content.trim()) {
//       setError("Title và Content không được để trống");
//       return;
//     }

//     onSubmit({ title: title.trim(), content: content.trim() });
//     setTitle("");
//     setContent("");
//     setError(null);
//     onClose();
//   };

//   return (
//     <div className="announcement-backdrop">
//       <div className="announcement-modal">
//         {/* Header */}
//         <div className="modal-header">
//           <h3>Create Announcement</h3>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         {/* Body */}
//         <div className="modal-body">
//           {error && <p className="error">{error}</p>}

//           <div className="form-group">
//             <label>Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Nhập tiêu đề thông báo"
//             />
//           </div>

//           <div className="form-group">
//             <label>Content</label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Nhập nội dung thông báo"
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="modal-actions">
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>Create</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import Button from "../Button/Button";
import { adminApi } from "../../api/admin.api"; // import API thật
import "./CreateAnnouncementForm.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // optional callback sau khi tạo thành công
}

export default function CreateAnnouncementForm({ open, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title và Content không được để trống");
      return;
    }

    try {
      setLoading(true);
      await adminApi.createAnnouncement({ title: title.trim(), content: content.trim() }); // gọi API thật
      setTitle("");
      setContent("");
      setError(null);
      onClose();
      if (onSuccess) onSuccess(); // reload danh sách ở parent nếu cần
    } catch (err) {
      console.error("Create announcement failed", err);
      setError("Tạo thông báo thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="announcement-backdrop">
      <div className="announcement-modal">
        <div className="modal-header">
          <h3>Create Announcement</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thông báo"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo"
              disabled={loading}
            />
          </div>
        </div>

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
