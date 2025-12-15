import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import type { Comment } from "../../types/comment";
import {
  getHiddenComments,
  restoreComment,
} from "../../store/commentStore";
import "./CommentListPage.css";

const PAGE_SIZE = 6;

export default function CommentListPage() {
  /* ================= STATE ================= */
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= DATA ================= */
  const comments = useMemo(() => {
    return getHiddenComments();
  }, [refresh]);

  /* ================= SEARCH + FILTER ================= */
  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      // search theo content + author
      const keyword = search.toLowerCase();
      const matchSearch =
        c.content.toLowerCase().includes(keyword) ||
        c.author.name.toLowerCase().includes(keyword);

      // filter theo ngày
      const createdTime = c.createdAt.getTime();

      const matchFromDate = fromDate
        ? createdTime >= new Date(fromDate).getTime()
        : true;

      const matchToDate = toDate
        ? createdTime <= new Date(toDate + "T23:59:59").getTime()
        : true;

      return matchSearch && matchFromDate && matchToDate;
    });
  }, [comments, search, fromDate, toDate]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredComments.length / PAGE_SIZE);

  const pagedComments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredComments.slice(start, start + PAGE_SIZE);
  }, [filteredComments, page]);

  /* ================= TABLE ================= */
  const columns = [
    {
      key: "content" as const,
      title: "Content",
      render: (c: Comment) => <p>{c.content}</p>,
    },
    {
      key: "author" as const,
      title: "Author",
      render: (c: Comment) => c.author.name,
    },
    {
      key: "createdAt" as const,
      title: "Created At",
      render: (c: Comment) => c.createdAt.toLocaleString(),
    },
    {
      key: "id" as const,
      title: "Action",
      render: (c: Comment) => (
        <Button
          variant="primary"
          onClick={() => {
            restoreComment(c.id);
            setRefresh((r) => r + 1);
          }}
        >
          Restore
        </Button>
      ),
    },
  ];

  /* ================= HANDLERS ================= */
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFromDate = (e: ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    setPage(1);
  };

  const handleToDate = (e: ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    setPage(1);
  };

  /* ================= RENDER ================= */
  return (
    <div className="page">
      <div className="page-header">
        <h2>Hidden Comments</h2>
      </div>

      {/* ===== Toolbar ===== */}
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by content or author..."
          value={search}
          onChange={handleSearch}
        />

        <input
          type="date"
          className="filter-date"
          value={fromDate}
          onChange={handleFromDate}
          title="From date"
        />

        <input
          type="date"
          className="filter-date"
          value={toDate}
          onChange={handleToDate}
          title="To date"
        />
      </div>

      {/* ===== Table ===== */}
      <Table<Comment> columns={columns} data={pagedComments} />

      {/* ===== Pagination ===== */}
      <div className="pagination">
        <Button
          variant="ghost"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span>
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
    </div>
  );
}
