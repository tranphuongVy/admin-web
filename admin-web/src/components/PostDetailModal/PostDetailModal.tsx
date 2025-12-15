
import { useMemo, useState } from "react";
import Button from "../Button/Button";
import type { Post } from "../../types/post";
import type { Comment } from "../../types/comment";
import { hideComment } from "../../store/commentStore";

import "./PostDetailModal.css";

interface Props {
  open: boolean;
  post: Post | null;
  onClose: () => void;
}

const PAGE_SIZE = 3;

/* ================= MOCK COMMENTS ================= */

const MOCK_COMMENTS_BY_POST: Record<string, Comment[]> = {
  p1: [
    {
      id: "c1",
      content: "Bài viết rất hay 👍",
      author: { id: "u2", name: "Nguyễn Văn B" },
      createdAt: new Date("2025-01-01T10:00:00"),
    },
    {
      id: "c2",
      content: "Mình đồng ý với quan điểm này",
      author: { id: "u3", name: "Trần Thị C" },
      createdAt: new Date("2025-01-01T11:30:00"),
    },
    {
      id: "c3",
      content: "Có thể giải thích thêm không?",
      author: { id: "u4", name: "Lê Văn D" },
      createdAt: new Date("2025-01-01T12:00:00"),
    },
    {
      id: "c4",
      content: "Cảm ơn bạn đã chia sẻ",
      author: { id: "u5", name: "Phạm Thị E" },
      createdAt: new Date("2025-01-01T13:00:00"),
    },
  ],
  p2: [
    {
      id: "c5",
      content: "Thông tin này rất hữu ích",
      author: { id: "u1", name: "Admin" },
      createdAt: new Date("2025-01-02T09:00:00"),
    },
  ],
};

export default function PostDetailModal({
  open,
  post,
  onClose,
}: Props) {
  /* ================= STATE ================= */

  const [page, setPage] = useState(1);

  // lưu ID comment bị ẩn (soft delete)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(
    () => new Set()
  );

  /* ================= DATA ================= */

  const comments = useMemo(() => {
    if (!post) return [];
    return MOCK_COMMENTS_BY_POST[post.id] || [];
  }, [post]);

  // chỉ lấy comment chưa bị ẩn
  const visibleComments = useMemo(() => {
    return comments.filter((c) => !hiddenIds.has(c.id));
  }, [comments, hiddenIds]);

  const totalPages = Math.ceil(
    visibleComments.length / PAGE_SIZE
  );

  const pagedComments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleComments.slice(start, start + PAGE_SIZE);
  }, [visibleComments, page]);

  /* ================= GUARD ================= */

  if (!open || !post) return null;

  /* ================= RENDER ================= */

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        {/* Header */}
        <div className="modal-header">
          <h3>Post Detail</h3>
        </div>

        {/* ===== POST INFO ===== */}
        <div className="post-info">
          <div className="post-header">
            <strong>{post.author.name}</strong>
            <span className="privacy">{post.privacy}</span>
          </div>

          {post.text && <p className="text">{post.text}</p>}

          <span className="time">
            {post.createdAt.toLocaleString()}
          </span>
        </div>

        {/* ===== COMMENTS ===== */}
        <div className="comments">
          <h4>Comments ({visibleComments.length})</h4>

          {pagedComments.length === 0 && (
            <p className="empty">No comments</p>
          )}

          {pagedComments.map((c) => (
            <div className="comment" key={c.id}>
              <div className="comment-header">
                <strong>{c.author.name}</strong>
                <span className="comment-time">
                  {c.createdAt.toLocaleString()}
                </span>
              </div>

              <p className="comment-content">{c.content}</p>

              <Button
  variant="ghost"
  onClick={() => {
    hideComment(c); // đẩy sang CommentListPage
    setHiddenIds(
      (prev) => new Set(prev).add(c.id)
    );
  }}
>
  Delete
</Button>

            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              <span>
                Page {page} / {totalPages}
              </span>

              <Button
                variant="ghost"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="actions">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
