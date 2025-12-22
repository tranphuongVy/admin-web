// import { useEffect, useState } from "react";
// import Table from "../../components/Table/Table";
// import Button from "../../components/Button/Button";
// import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";

// import type { Comment } from "../../types/comment";
// import { adminApi } from "../../api/admin.api";

// import "./CommentListPage.css";

// const PAGE_SIZE = 5;

// export default function CommentListPage() {
//   /* ================= STATE ================= */
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [total, setTotal] = useState(0);

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [includeHidden, setIncludeHidden] = useState(false);
//   const [includeDeleted, setIncludeDeleted] = useState(false);

//   const [selected, setSelected] = useState<Comment | null>(null);

//   /* ================= FETCH COMMENTS ================= */
//   const fetchComments = async () => {
//     try {
//       const res = await adminApi.listComments({
//         page,
//         limit: PAGE_SIZE,
//         includeHidden,
//         includeDeleted,
//       });

//       let items: Comment[] = res.items;

//       // ===== frontend filter search =====
//       if (search) {
//         const keyword = search.toLowerCase();
//         items = items.filter(
//           (c) =>
//             c.content.toLowerCase().includes(keyword) ||
//             c.author.name.toLowerCase().includes(keyword)
//         );
//       }

//       // ===== frontend filter date range =====
//       if (fromDate) {
//         const from = new Date(fromDate).getTime();
//         items = items.filter(
//           (c) => new Date(c.createdAt).getTime() >= from
//         );
//       }

//       if (toDate) {
//         const to = new Date(toDate + "T23:59:59").getTime();
//         items = items.filter(
//           (c) => new Date(c.createdAt).getTime() <= to
//         );
//       }

//       setComments(items);
//       setTotal(res.total);
//     } catch (err) {
//       console.error("Fetch comments failed", err);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [page, search, includeHidden, includeDeleted, fromDate, toDate]);

//   /* ================= TABLE ================= */
//   const columns = [
//     {
//       key: "content" as const,
//       title: "Comment",
//       render: (c: Comment) => (
//         <div className="comment-content">
//           <strong>{c.author.name}</strong>
//           <p>{c.content || "—"}</p>

//           {c.hiddenAt && (
//             <span className="badge badge-hidden">Hidden</span>
//           )}
//           {c.deletedAt && (
//             <span className="badge badge-deleted">Deleted</span>
//           )}
//         </div>
//       ),
//     },
//     {
//       key: "createdAt" as const,
//       title: "Created",
//       render: (c: Comment) =>
//         new Date(c.createdAt).toLocaleString(),
//     },
//     {
//       key: "id" as const,
//       title: "Action",
//       render: (c: Comment) => (
//         <div className="actions-inline">
//           {!c.deletedAt && (
//             <>
//               <Button
//                 variant="ghost"
//                 onClick={async () => {
//                   try {
//                     if (c.hiddenAt) {
//                       await adminApi.unhideComment(c.id);
//                     } else {
//                       await adminApi.hideComment(c.id);
//                     }
//                     fetchComments();
//                   } catch (err) {
//                     console.error("Hide/Unhide comment failed", err);
//                   }
//                 }}
//               >
//                 {c.hiddenAt ? "Unhide" : "Hide"}
//               </Button>

//               <Button
//                 variant="danger"
//                 onClick={() => setSelected(c)}
//               >
//                 Delete
//               </Button>
//             </>
//           )}
//         </div>
//       ),
//     },
//   ];

//   /* ================= DELETE ================= */
//   const handleConfirmDelete = async () => {
//     if (!selected) return;

//     try {
//       await adminApi.deleteComment(selected.id);
//       fetchComments();
//     } catch (err) {
//       console.error("Delete comment failed", err);
//     } finally {
//       setSelected(null);
//     }
//   };

//   /* ================= PAGINATION ================= */
//   const totalPages = Math.ceil(total / PAGE_SIZE);

//   /* ================= RENDER ================= */
//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>Comments</h2>
//       </div>

//       {/* ===== Toolbar ===== */}
//       <div className="toolbar">
//         <input
//           className="search"
//           placeholder="Search by content or author..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />

//         <input
//         title="date1"
//           type="date"
//           className="filter-date"
//           value={fromDate}
//           onChange={(e) => {
//             setFromDate(e.target.value);
//             setPage(1);
//           }}
//         />

//         <input
//         title="date2"
//           type="date"
//           className="filter-date"
//           value={toDate}
//           onChange={(e) => {
//             setToDate(e.target.value);
//             setPage(1);
//           }}
//         />

//         <label className="checkbox">
//           <input
//             type="checkbox"
//             checked={includeHidden}
//             onChange={(e) => {
//               setIncludeHidden(e.target.checked);
//               setPage(1);
//             }}
//           />
//           Include hidden
//         </label>

//         <label className="checkbox">
//           <input
//             type="checkbox"
//             checked={includeDeleted}
//             onChange={(e) => {
//               setIncludeDeleted(e.target.checked);
//               setPage(1);
//             }}
//           />
//           Include deleted
//         </label>
//       </div>

//       {/* ===== Table ===== */}
//       <Table<Comment> columns={columns} data={comments} />

//       {/* ===== Pagination ===== */}
//       <div className="pagination">
//         <Button
//           variant="ghost"
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//         >
//           Prev
//         </Button>

//         <span className="page-info">
//           Page {page} / {totalPages || 1}
//         </span>

//         <Button
//           variant="ghost"
//           disabled={page === totalPages || totalPages === 0}
//           onClick={() => setPage((p) => p + 1)}
//         >
//           Next
//         </Button>
//       </div>

//       {/* ===== Confirm Delete ===== */}
//       <ConfirmDialog
//         open={!!selected}
//         title="Delete comment"
//         message="Are you sure you want to delete this comment?"
//         onCancel={() => setSelected(null)}
//         onConfirm={handleConfirmDelete}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";

import type { Comment } from "../../types/comment";
import { adminApi } from "../../api/admin.api";

import "./CommentListPage.css";

const PAGE_SIZE = 5;

export default function CommentListPage() {
  /* ================= STATE ================= */
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [includeHidden, setIncludeHidden] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [selected, setSelected] = useState<Comment | null>(null);

  /* ================= FETCH COMMENTS ================= */
  const fetchComments = async () => {
    try {
      const res = await adminApi.listComments({
        page,
        limit: PAGE_SIZE,
        includeHidden,
        includeDeleted,
      });

      let items: Comment[] = res.items;

      /* ===== SAFETY FILTER (frontend) ===== */
      if (!includeDeleted) {
        items = items.filter((c) => !c.deletedAt);
      }

      if (!includeHidden) {
        items = items.filter((c) => !c.hiddenAt);
      }

      /* ===== SEARCH ===== */
      if (search.trim()) {
        const keyword = search.toLowerCase();
        items = items.filter(
          (c) =>
            c.content.toLowerCase().includes(keyword) ||
            c.author.name.toLowerCase().includes(keyword)
        );
      }

      /* ===== DATE RANGE ===== */
      if (fromDate) {
        const from = new Date(fromDate).getTime();
        items = items.filter(
          (c) => c.createdAt.getTime() >= from
        );
      }

      if (toDate) {
        const to = new Date(`${toDate}T23:59:59`).getTime();
        items = items.filter(
          (c) => c.createdAt.getTime() <= to
        );
      }

      setComments(items);
      setTotal(items.length);
    } catch (err) {
      console.error("Fetch comments failed", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [
    page,
    search,
    includeHidden,
    includeDeleted,
    fromDate,
    toDate,
  ]);

  /* ================= TABLE ================= */
  const columns = [
    {
      key: "content" as const,
      title: "Comment",
      render: (c: Comment) => (
        <div className="comment-content">
          <strong>{c.author.name}</strong>
          <p>{c.content || "—"}</p>

          <div className="badges">
            {c.hiddenAt && (
              <span className="badge badge-hidden">
                Hidden
              </span>
            )}
            {c.deletedAt && (
              <span className="badge badge-deleted">
                Deleted
              </span>
            )}
          </div>
        </div>
      ),
    },

     {
    key: "postId" as const,
    title: "Post",
    render: (c: Comment) => (
      <div className="post-info">
        <div className="post-text">
          {c.post?.text
            ? c.post.text.slice(0, 60) + "..."
            : <em>No content</em>}
        </div>

        <div className="badges">
          {c.post?.hiddenAt && (
            <span className="badge badge-hidden">Post hidden</span>
          )}
          {c.post?.deletedAt && (
            <span className="badge badge-deleted">Post deleted</span>
          )}
        </div>

        <small className="post-id">
          ID: {c.post?.id}
        </small>
      </div>
    ),
  },

    {
      key: "createdAt" as const,
      title: "Created",
      render: (c: Comment) =>
        c.createdAt.toLocaleString(),
    },
    {
      key: "id" as const,
      title: "Action",
      render: (c: Comment) => (
        <div className="actions-inline">
          {!c.deletedAt && (
            <>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    if (c.hiddenAt) {
                      await adminApi.unhideComment(c.id);
                    } else {
                      await adminApi.hideComment(c.id);
                    }
                    fetchComments();
                  } catch (err) {
                    console.error(
                      "Hide/Unhide comment failed",
                      err
                    );
                  }
                }}
              >
                {c.hiddenAt ? "Unhide" : "Hide"}
              </Button>

              <Button
                variant="danger"
                onClick={() => setSelected(c)}
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
      await adminApi.deleteComment(selected.id);
      fetchComments();
    } catch (err) {
      console.error("Delete comment failed", err);
    } finally {
      setSelected(null);
    }
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(total / PAGE_SIZE);

  /* ================= RENDER ================= */
  return (
    <div className="page">
      <div className="page-header">
        <h2>Comments</h2>
      </div>

      {/* ===== Toolbar ===== */}
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
      <Table<Comment> columns={columns} data={comments} />

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
          disabled={
            page === totalPages || totalPages === 0
          }
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* ===== Confirm Delete ===== */}
      <ConfirmDialog
        open={!!selected}
        title="Delete comment"
        message="Are you sure you want to delete this comment?"
        onCancel={() => setSelected(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
