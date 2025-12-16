// import { useMemo, useState } from "react";
// import type { ChangeEvent } from "react";
// import Table from "../../components/Table/Table";
// import Button from "../../components/Button/Button";
// import type { Comment } from "../../types/comment";
// import {
//   getHiddenComments,
//   restoreComment,
// } from "../../store/commentStore";
// import "./CommentListPage.css";

// const PAGE_SIZE = 6;

// export default function CommentListPage() {
//   /* ================= STATE ================= */
//   const [page, setPage] = useState(1);
//   const [refresh, setRefresh] = useState(0);

//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   /* ================= DATA ================= */
//   const comments = useMemo(() => {
//     return getHiddenComments();
//   }, [refresh]);

//   /* ================= SEARCH + FILTER ================= */
//   const filteredComments = useMemo(() => {
//     return comments.filter((c) => {
//       // search theo content + author
//       const keyword = search.toLowerCase();
//       const matchSearch =
//         c.content.toLowerCase().includes(keyword) ||
//         c.author.name.toLowerCase().includes(keyword);

//       // filter theo ngày
//       const createdTime = c.createdAt.getTime();

//       const matchFromDate = fromDate
//         ? createdTime >= new Date(fromDate).getTime()
//         : true;

//       const matchToDate = toDate
//         ? createdTime <= new Date(toDate + "T23:59:59").getTime()
//         : true;

//       return matchSearch && matchFromDate && matchToDate;
//     });
//   }, [comments, search, fromDate, toDate]);

//   /* ================= PAGINATION ================= */
//   const totalPages = Math.ceil(filteredComments.length / PAGE_SIZE);

//   const pagedComments = useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     return filteredComments.slice(start, start + PAGE_SIZE);
//   }, [filteredComments, page]);

//   /* ================= TABLE ================= */
//   const columns = [
//     {
//       key: "content" as const,
//       title: "Content",
//       render: (c: Comment) => <p>{c.content}</p>,
//     },
//     {
//       key: "author" as const,
//       title: "Author",
//       render: (c: Comment) => c.author.name,
//     },
//     {
//       key: "createdAt" as const,
//       title: "Created At",
//       render: (c: Comment) => c.createdAt.toLocaleString(),
//     },
//     {
//       key: "id" as const,
//       title: "Action",
//       render: (c: Comment) => (
//         <Button
//           variant="primary"
//           onClick={() => {
//             restoreComment(c.id);
//             setRefresh((r) => r + 1);
//           }}
//         >
//           Restore
//         </Button>
//       ),
//     },
//   ];

//   /* ================= HANDLERS ================= */
//   const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   const handleFromDate = (e: ChangeEvent<HTMLInputElement>) => {
//     setFromDate(e.target.value);
//     setPage(1);
//   };

//   const handleToDate = (e: ChangeEvent<HTMLInputElement>) => {
//     setToDate(e.target.value);
//     setPage(1);
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>Hidden Comments</h2>
//       </div>

//       {/* ===== Toolbar ===== */}
//       <div className="toolbar">
//         <input
//           className="search"
//           placeholder="Search by content or author..."
//           value={search}
//           onChange={handleSearch}
//         />

//         <input
//           type="date"
//           className="filter-date"
//           value={fromDate}
//           onChange={handleFromDate}
//           title="From date"
//         />

//         <input
//           type="date"
//           className="filter-date"
//           value={toDate}
//           onChange={handleToDate}
//           title="To date"
//         />
//       </div>

//       {/* ===== Table ===== */}
//       <Table<Comment> columns={columns} data={pagedComments} />

//       {/* ===== Pagination ===== */}
//       <div className="pagination">
//         <Button
//           variant="ghost"
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//         >
//           Prev
//         </Button>

//         <span>
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

const PAGE_SIZE = 6;

type CommentRow = Comment & { postText: string };

export default function CommentListPage() {
  /* ================= STATE ================= */
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selected, setSelected] = useState<CommentRow | null>(null);

  /* ================= FETCH ================= */
  const fetchComments = async () => {
    try {
      const res = await adminApi.listComments({ page, limit: PAGE_SIZE });

      const items: CommentRow[] = res.items.map((c: Comment) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        deletedAt: c.deletedAt ? new Date(c.deletedAt) : null,
        post: { ...c.post, deletedAt: c.post.deletedAt ? new Date(c.post.deletedAt) : null },
        postText: c.post.text || "—",
      }));

      // frontend filter
      let filtered = items;
      if (search) {
        const keyword = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.content.toLowerCase().includes(keyword) ||
            c.author.name.toLowerCase().includes(keyword)
        );
      }

      if (fromDate) {
        const from = new Date(fromDate).getTime();
        filtered = filtered.filter((c) => c.createdAt.getTime() >= from);
      }

      if (toDate) {
        const to = new Date(toDate + "T23:59:59").getTime();
        filtered = filtered.filter((c) => c.createdAt.getTime() <= to);
      }

      setComments(filtered);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page, search, fromDate, toDate]);

  /* ================= TABLE ================= */
  const columns = [
    {
      key: "content" as const,
      title: "Content",
      render: (c: CommentRow) => <p>{c.content}</p>,
    },
    {
      key: "postText" as const,
      title: "Post",
      render: (c: CommentRow) => c.postText,
    },
    {
      key: "createdAt" as const,
      title: "Created At",
      render: (c: CommentRow) => c.createdAt.toLocaleString(),
    },
    {
      key: "deletedAt" as const,
      title: "Action",
      render: (c: CommentRow) => (
        <Button variant="danger" onClick={() => setSelected(c)}>
          Delete
        </Button>
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
      console.error("Delete failed", err);
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
        title="date2"
          type="date"
          className="filter-date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
        />
        <input
        title="date"
          type="date"
          className="filter-date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table<CommentRow> columns={columns} data={comments} />

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
