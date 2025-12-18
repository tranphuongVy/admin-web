import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";

import type { Post } from "../../types/post";

import { adminApi } from "../../api/admin.api";

import "./PostListPage.css";

const PAGE_SIZE = 4;

type PrivacyFilter = "ALL" | "PUBLIC" | "FRIENDS" | "PRIVATE";

export default function PostListPage() {
  /* ================= STATE ================= */

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [privacy, setPrivacy] = useState<PrivacyFilter>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [includeHidden, setIncludeHidden] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [selected, setSelected] = useState<Post | null>(null);
  const [detailPost, setDetailPost] = useState<Post | null>(null);

  /* ================= FETCH ================= */

  const fetchPosts = async () => {
    try {
      const res = await adminApi.listPosts({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        includeHidden,
        includeDeleted,
      });

      // ⚠️ res.items ĐÃ LÀ Post[]
      let items: Post[] = res.items;

      /* ===== Frontend filter ===== */

      if (privacy !== "ALL") {
        items = items.filter((p) => p.privacy === privacy);
      }

      if (fromDate) {
        const from = new Date(fromDate).getTime();
        items = items.filter(
          (p) => p.createdAt.getTime() >= from
        );
      }

      if (toDate) {
        const to = new Date(toDate + "T23:59:59").getTime();
        items = items.filter(
          (p) => p.createdAt.getTime() <= to
        );
      }

      setPosts(items);
      setTotal(res.total);
    } catch (err) {
      console.error("Fetch posts failed", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [
    page,
    search,
    privacy,
    fromDate,
    toDate,
    includeHidden,
    includeDeleted,
  ]);

  /* ================= TABLE ================= */

  const columns = [
    {
      key: "text" as const,
      title: "Content",
      render: (p: Post) => (
        <div
          className="post-content clickable"
          onClick={() => setDetailPost(p)}
        >
          <strong>{p.author.name}</strong>
          <p>{p.text || "—"}</p>

          {p.hiddenAt && (
            <span className="badge badge-hidden">
              Hidden
            </span>
          )}

          {p.deletedAt && (
            <span className="badge badge-deleted">
              Deleted
            </span>
          )}
        </div>
      ),
    },
    {
      key: "privacy" as const,
      title: "Privacy",
      render: (p: Post) => (
        <span
          className={`privacy privacy-${p.privacy.toLowerCase()}`}
        >
          {p.privacy}
        </span>
      ),
    },
    {
      key: "id" as const,
      title: "Action",
      render: (p: Post) => (
        <div className="actions-inline">
          {!p.deletedAt && (
            <>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    if (p.hiddenAt) {
                      await adminApi.unhidePost(p.id);
                    } else {
                      await adminApi.hidePost(p.id);
                    }
                    fetchPosts();
                  } catch (err) {
                    console.error("Hide/Unhide failed", err);
                  }
                }}
              >
                {p.hiddenAt ? "Unhide" : "Hide"}
              </Button>

              <Button
                variant="danger"
                onClick={() => setSelected(p)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  /* ================= DELETE ================= */

  const handleConfirmDelete = async () => {
    if (!selected) return;

    try {
      await adminApi.deletePost(selected.id);
      fetchPosts();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setSelected(null);
      setDetailPost(null);
    }
  };

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(total / PAGE_SIZE);

  /* ================= RENDER ================= */

  return (
    <div className="page">
      <div className="page-header">
        <h2>Posts</h2>
      </div>

      {/* ===== Toolbar (KHÔNG BỊ MẤT) ===== */}
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by content or author..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
        title="select"
          className="filter"
          value={privacy}
          onChange={(e) => {
            setPrivacy(e.target.value as PrivacyFilter);
            setPage(1);
          }}
        >
          <option value="ALL">All privacy</option>
          <option value="PUBLIC">Public</option>
          <option value="FRIENDS">Friends</option>
          <option value="PRIVATE">Private</option>
        </select>

        <input
        title="date1"
          type="date"
          className="filter-date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
        />

        <input
        title="date2"
          type="date"
          className="filter-date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) => {
              setIncludeHidden(e.target.checked);
              setPage(1);
            }}
          />
          Include hidden
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => {
              setIncludeDeleted(e.target.checked);
              setPage(1);
            }}
          />
          Include deleted
        </label>
      </div>

      {/* ===== Table ===== */}
      <Table<Post> columns={columns} data={posts} />

      {/* ===== Pagination ===== */}
      <div className="pagination">
        <Button
          variant="ghost"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="page-info">
          Page {page} / {totalPages || 1}
        </span>

        <Button
          variant="ghost"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* ===== Confirm Delete ===== */}
      <ConfirmDialog
        open={!!selected}
        title="Delete post"
        message="Are you sure you want to delete this post?"
        onCancel={() => setSelected(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* ===== Detail ===== */}
      <PostDetailModal
        open={!!detailPost}
        postId={detailPost?.id ?? null}
        onClose={() => setDetailPost(null)}
      />
    </div>
  );
}
