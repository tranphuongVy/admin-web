import { useEffect, useState } from "react";
import Button from "../Button/Button";

import type { Post } from "../../types/post";

import { postApi } from "../../api/post.api";
import { mapPost } from "../../types/mappers/post.mapper";

import "./PostDetailModal.css";

interface Props {
  open: boolean;
  postId: string | null;
  onClose: () => void;
}

export default function PostDetailModal({
  open,
  postId,
  onClose,
}: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !postId) {
      setPost(null);
      return;
    }

    let cancelled = false;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await postApi.getPostById(
          postId
        );

        if (cancelled) return;

        setPost(mapPost(data)); // ✅ chuẩn mapper
      } catch (err) {
        console.error(
          "Fetch post detail failed",
          err
        );
        if (!cancelled)
          setError("Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [open, postId]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <div className="modal-header">
          <h3>Post Detail</h3>
        </div>

        {loading && (
          <p className="empty">Loading...</p>
        )}

        {!loading && error && (
          <p className="empty error">{error}</p>
        )}

        {!loading && post && (
          <>
            <div className="post-info">
              <div className="post-header">
                <strong>{post.author.name}</strong>
                <span className="privacy">
                  {post.privacy}
                </span>
              </div>

              {post.text && (
                <p className="text">{post.text}</p>
              )}

              {post.media.length > 0 && (
                <div className="post-media">
                  {post.media
                    .slice()
                    .sort(
                      (a, b) => a.order - b.order
                    )
                    .map((m) =>
                      m.type === "IMAGE" ? (
                        <img
                        title="img"
                          key={m.id}
                          src={m.url}
                          className="post-image"
                        />
                      ) : (
                        <video
                          key={m.id}
                          className="post-video"
                          controls
                        >
                          <source src={m.url} />
                        </video>
                      )
                    )}
                </div>
              )}

              <span className="time">
                {post.createdAt.toLocaleString()}
              </span>
            </div>

            <div className="comments">
              <h4>
                Comments ({post.comments.length})
              </h4>

              {post.comments.length === 0 ? (
                <p className="empty">No comments</p>
              ) : (
                post.comments.map((c) => (
                  <div className="comment" key={c.id}>
                    <div className="comment-header">
                      <strong>{c.author.name}</strong>
                      <span className="comment-time">
                        {c.createdAt.toLocaleString()}
                      </span>
                    </div>
                    <p className="comment-content">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <div className="actions">
          <Button
            variant="ghost"
            onClick={() => {
              setPost(null);
              onClose();
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
