import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import UserDetailModal from "../../components/UserDetailModal/UserDetailModal";
import type { User } from "../../types/user";
import "./UserListPage.css";

/* ================= TYPES ================= */

type FilterType = "all" | "active" | "banned";

/* ================= MOCK DATA ================= */

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "User One",
    email: "user1@gmail.com",
    avatarUrl: null,
    bio: "Frontend developer",
    role: "USER",
    isEmailVerified: true,
    isBanned: false,
    isOnline: true,
    lastSeenAt: new Date(),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "User Two",
    email: "user2@gmail.com",
    avatarUrl: null,
    bio: null,
    role: "USER",
    isEmailVerified: false,
    isBanned: true,
    isOnline: false,
    lastSeenAt: new Date(),
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "User Three",
    email: "user3@gmail.com",
    avatarUrl: null,
    bio: null,
    role: "USER",
    isEmailVerified: false,
    isBanned: false,
    isOnline: false,
    lastSeenAt: new Date(),
    createdAt: new Date("2024-03-01"),
  },
];

/* ================= PAGE ================= */

const PAGE_SIZE = 6;

export default function UserListPage() {
  /* ===== DATA ===== */
  const [usersData, setUsersData] = useState<User[]>(MOCK_USERS);

  /* ===== UI STATE ===== */
  const [selected, setSelected] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);

  /* ================= FILTER + SEARCH ================= */

  const filteredUsers = useMemo(() => {
    return usersData.filter((u) => {
      const matchSearch = u.email
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ||
        (filter === "active" && !u.isBanned) ||
        (filter === "banned" && u.isBanned);

      return matchSearch && matchFilter;
    });
  }, [usersData, search, filter]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const users = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  /* ================= TABLE ================= */

  const columns = [
    {
      key: "email" as const,
      title: "Email",
      render: (u: User) => (
        <button className="link" onClick={() => setDetailUser(u)}>
          {u.email}
        </button>
      ),
    },
    {
      key: "isBanned" as const,
      title: "Status",
      render: (u: User) => (
        <span className={u.isBanned ? "status-banned" : "status-active"}>
          {u.isBanned ? "BANNED" : "ACTIVE"}
        </span>
      ),
    },
    {
      key: "id" as const,
      title: "Action",
      render: (u: User) => (
        <Button
          variant={u.isBanned ? "primary" : "danger"}
          onClick={() => setSelected(u)}
        >
          {u.isBanned ? "Unban" : "Ban"}
        </Button>
      ),
    },
  ];

  /* ================= HANDLERS ================= */

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as FilterType);
    setPage(1);
  };

  const handleConfirmBan = () => {
    if (!selected) return;

    setUsersData((prev) =>
      prev.map((u) =>
        u.id === selected.id
          ? { ...u, isBanned: !u.isBanned }
          : u
      )
    );

    // đóng dialog + sync modal detail
    setDetailUser((prev) =>
      prev && prev.id === selected.id
        ? { ...prev, isBanned: !prev.isBanned }
        : prev
    );

    setSelected(null);
  };

  /* ================= RENDER ================= */

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by email..."
          value={search}
          onChange={handleSearch}
        />

        <select
          title="filter"
          className="filter"
          value={filter}
          onChange={handleFilter}
        >
          <option value="all">All users</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <Table<User> columns={columns} data={users} />

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

      {/* Confirm Ban / Unban */}
      <ConfirmDialog
        open={!!selected}
        title="Confirm action"
        message={
          selected
            ? `Are you sure you want to ${
                selected.isBanned ? "unban" : "ban"
              } this user?`
            : ""
        }
        onCancel={() => setSelected(null)}
        onConfirm={handleConfirmBan}
      />

      {/* User Detail Modal */}
      {detailUser && (
        <UserDetailModal
          open={!!detailUser}
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onToggleBan={(u) => setSelected(u)}
        />
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import type { ChangeEvent } from "react";
// import Table from "../../components/Table/Table";
// import Button from "../../components/Button/Button";
// import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
// import UserDetailModal from "../../components/UserDetailModal/UserDetailModal";
// import type { User } from "../../types/user";
// import { adminApi } from "../../api/admin.api";
// import "./UserListPage.css";

// /* ================= TYPES ================= */

// type FilterType = "all" | "active" | "banned";

// /* ================= PAGE ================= */

// const PAGE_SIZE = 6;

// export default function UserListPage() {
//   /* ===== DATA ===== */
//   const [usersData, setUsersData] = useState<User[]>([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);

//   /* ===== UI STATE ===== */
//   const [selected, setSelected] = useState<User | null>(null);
//   const [detailUser, setDetailUser] = useState<User | null>(null);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState<FilterType>("all");
//   const [page, setPage] = useState(1);

//   /* ================= FETCH USERS ================= */

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const { items, total } = await adminApi.listUsers({
//         page,
//         limit: PAGE_SIZE,
//         search: search || undefined,
//         status:
//           filter === "all"
//             ? undefined
//             : filter === "active"
//             ? "ACTIVE"
//             : "BANNED",
//       });

//       setUsersData(items);
//       setTotal(total);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [search, filter, page]);

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.ceil(total / PAGE_SIZE);

//   /* ================= TABLE ================= */

//   const columns = [
//     {
//       key: "email" as const,
//       title: "Email",
//       render: (u: User) => (
//         <button className="link" onClick={() => setDetailUser(u)}>
//           {u.email}
//         </button>
//       ),
//     },
//     {
//       key: "isBanned" as const,
//       title: "Status",
//       render: (u: User) => (
//         <span className={u.isBanned ? "status-banned" : "status-active"}>
//           {u.isBanned ? "BANNED" : "ACTIVE"}
//         </span>
//       ),
//     },
//     {
//       key: "id" as const,
//       title: "Action",
//       render: (u: User) => (
//         <Button
//           variant={u.isBanned ? "primary" : "danger"}
//           onClick={() => setSelected(u)}
//         >
//           {u.isBanned ? "Unban" : "Ban"}
//         </Button>
//       ),
//     },
//   ];

//   /* ================= HANDLERS ================= */

//   const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
//     setFilter(e.target.value as FilterType);
//     setPage(1);
//   };

//   const handleConfirmBan = async () => {
//     if (!selected) return;

//     if (selected.isBanned) {
//       await adminApi.unbanUser(selected.id);
//     } else {
//       await adminApi.banUser(selected.id);
//     }

//     setSelected(null);
//     setDetailUser(null);
//     fetchUsers();
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>Users</h2>
//       </div>

//       <div className="toolbar">
//         <input
//           className="search"
//           placeholder="Search by email..."
//           value={search}
//           onChange={handleSearch}
//         />

//         <select
//           title="filter"
//           className="filter"
//           value={filter}
//           onChange={handleFilter}
//         >
//           <option value="all">All users</option>
//           <option value="active">Active</option>
//           <option value="banned">Banned</option>
//         </select>
//       </div>

//       <Table<User>
//         columns={columns}
//         data={usersData}
//         loading={loading}
//       />

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

//       {/* Confirm Ban / Unban */}
//       <ConfirmDialog
//         open={!!selected}
//         title="Confirm action"
//         message={
//           selected
//             ? `Are you sure you want to ${
//                 selected.isBanned ? "unban" : "ban"
//               } this user?`
//             : ""
//         }
//         onCancel={() => setSelected(null)}
//         onConfirm={handleConfirmBan}
//       />

//       {/* User Detail Modal */}
//       {detailUser && (
//         <UserDetailModal
//           open={!!detailUser}
//           user={detailUser}
//           onClose={() => setDetailUser(null)}
//           onToggleBan={(u) => setSelected(u)}
//         />
//       )}
//     </div>
//   );
// }
