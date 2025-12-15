// import { useMemo, useState } from "react";
// import Table from "../../components/Table/Table";
// import Button from "../../components/Button/Button";
// import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
// import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";
// import type { Post } from "../../types/post";
// import "./PostListPage.css";

// /* ================= MOCK DATA ================= */

// const MOCK_POSTS: Post[] = [
//   {
//     id: "p1",
//     text: "Hello world 🌍",
//     privacy: "PUBLIC",
//     createdAt: new Date(),
//     author: {
//       id: "u1",
//       name: "User One",
//       email: "user1@gmail.com",
//     },
//     media: [],
//     aiStatus: "APPROVED",
//   },
//   {
//     id: "p2",
//     text: "Sharing a post",
//     privacy: "FRIENDS",
//     createdAt: new Date(),
//     author: {
//       id: "u2",
//       name: "User Two",
//       email: "user2@gmail.com",
//     },
//     media: [],
//     aiStatus: "APPROVED",
//   },
// ];

// /* ================= PAGE ================= */

// const PAGE_SIZE = 5;

// export default function PostListPage() {
//   const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

//   // delete
//   const [selected, setSelected] = useState<Post | null>(null);

//   // detail
//   const [detailPost, setDetailPost] = useState<Post | null>(null);

//   const [page, setPage] = useState(1);

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.ceil(posts.length / PAGE_SIZE);

//   const pagedPosts = useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     return posts.slice(start, start + PAGE_SIZE);
//   }, [posts, page]);

//   /* ================= TABLE ================= */

//   const columns = [
//     {
//       key: "text" as const,
//       title: "Content",
//       render: (p: Post) => (
//         <div
//           className="post-content clickable"
//           onClick={() => setDetailPost(p)}
//         >
//           <strong>{p.author.name}</strong>
//           <p>{p.text || "—"}</p>
//         </div>
//       ),
//     },
//     {
//       key: "privacy" as const,
//       title: "Privacy",
//       render: (p: Post) => (
//         <span className={`privacy privacy-${p.privacy.toLowerCase()}`}>
//           {p.privacy}
//         </span>
//       ),
//     },
//     {
//       key: "id" as const,
//       title: "Action",
//       render: (p: Post) => (
//         <Button
//           variant="danger"
//           onClick={() => setSelected(p)}
//         >
//           Delete
//         </Button>
//       ),
//     },
//   ];

//   /* ================= HANDLERS ================= */

//   const handleConfirmDelete = () => {
//     if (!selected) return;

//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === selected.id
//           ? { ...p, deletedAt: new Date() }
//           : p
//       )
//     );

//     // nếu đang mở detail của post này → đóng
//     setDetailPost((prev) =>
//       prev?.id === selected.id ? null : prev
//     );

//     setSelected(null);
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>Posts</h2>
//       </div>

//       <Table<Post>
//         columns={columns}
//         data={pagedPosts.filter((p) => !p.deletedAt)}
//       />

//       {/* Pagination */}
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
//           disabled={page === totalPages}
//           onClick={() => setPage((p) => p + 1)}
//         >
//           Next
//         </Button>
//       </div>

//       {/* Confirm Delete */}
//       <ConfirmDialog
//         open={!!selected}
//         title="Delete post"
//         message="Are you sure you want to delete this post?"
//         onCancel={() => setSelected(null)}
//         onConfirm={handleConfirmDelete}
//       />

//       {/* Post Detail Modal */}
//       <PostDetailModal
//         open={!!detailPost}
//         post={detailPost}
//         onClose={() => setDetailPost(null)}
//       />
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";
import type { Post } from "../../types/post";
import "./PostListPage.css";

/* ================= MOCK DATA ================= */

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    text: "Hello world 🌍",
    privacy: "PUBLIC",
    createdAt: new Date("2024-12-10"),
    author: {
      id: "u1",
      name: "User One",
      email: "user1@gmail.com",
    },
    media: [],
    aiStatus: "APPROVED",
  },
  {
    id: "p2",
    text: "Sharing a post",
    privacy: "FRIENDS",
    createdAt: new Date("2024-12-15"),
    author: {
      id: "u2",
      name: "User Two",
      email: "user2@gmail.com",
    },
    media: [],
    aiStatus: "APPROVED",
  },
];

/* ================= PAGE ================= */

const PAGE_SIZE = 5;

type PrivacyFilter = "ALL" | "PUBLIC" | "FRIENDS" | "PRIVATE";

export default function PostListPage() {
  /* ===== DATA ===== */
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  /* ===== UI STATE ===== */
  const [selected, setSelected] = useState<Post | null>(null);
  const [detailPost, setDetailPost] = useState<Post | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [privacyFilter, setPrivacyFilter] =
    useState<PrivacyFilter>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FILTER + SEARCH ================= */

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.deletedAt) return false;

      // search
      const keyword = search.toLowerCase();
      const matchSearch =
        p.text?.toLowerCase().includes(keyword) ||
        p.author.name.toLowerCase().includes(keyword) 

      // privacy
      const matchPrivacy =
        privacyFilter === "ALL" ||
        p.privacy === privacyFilter;

      // date
      const createdTime = p.createdAt.getTime();

      const matchFromDate = fromDate
        ? createdTime >= new Date(fromDate).getTime()
        : true;

      const matchToDate = toDate
        ? createdTime <=
          new Date(toDate + "T23:59:59").getTime()
        : true;

      return matchSearch && matchPrivacy && matchFromDate && matchToDate;
    });
  }, [posts, search, privacyFilter, fromDate, toDate]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);

  const pagedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, page]);

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
        </div>
      ),
    },
    {
      key: "privacy" as const,
      title: "Privacy",
      render: (p: Post) => (
        <span className={`privacy privacy-${p.privacy.toLowerCase()}`}>
          {p.privacy}
        </span>
      ),
    },
    {
      key: "id" as const,
      title: "Action",
      render: (p: Post) => (
        <Button variant="danger" onClick={() => setSelected(p)}>
          Delete
        </Button>
      ),
    },
  ];

  /* ================= HANDLERS ================= */

  const handleConfirmDelete = () => {
    if (!selected) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? { ...p, deletedAt: new Date() }
          : p
      )
    );

    setDetailPost((prev) =>
      prev?.id === selected.id ? null : prev
    );

    setSelected(null);
  };

  /* ================= RENDER ================= */

  return (
    <div className="page">
      <div className="page-header">
        <h2>Posts</h2>
      </div>

      {/* ===== Toolbar ===== */}
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by content, author or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
        title="filter"
          className="filter"
          value={privacyFilter}
          onChange={(e) => {
            setPrivacyFilter(e.target.value as PrivacyFilter);
            setPage(1);
          }}
        >
          <option value="ALL">All privacy</option>
          <option value="PUBLIC">Public</option>
          <option value="FRIENDS">Friends</option>
          <option value="PRIVATE">Private</option>
        </select>

        <input
          type="date"
          className="filter-date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          title="From date"
        />

        <input
          type="date"
          className="filter-date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          title="To date"
        />
      </div>

      {/* ===== Table ===== */}
      <Table<Post> columns={columns} data={pagedPosts} />

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

      {/* ===== Post Detail ===== */}
      <PostDetailModal
        open={!!detailPost}
        post={detailPost}
        onClose={() => setDetailPost(null)}
      />
    </div>
  );
}
