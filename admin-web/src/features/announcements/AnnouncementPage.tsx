// import { useEffect, useState } from "react";
// import Table from "../../components/Table/Table";
// import Button from "../../components/Button/Button";
// import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
// import CreateAnnouncementForm from "../../components/CreateAnnouncementForm/CreateAnnouncementForm";
// import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";

// import type { PasswordResetRequest } from "../../types/passwordResetRequest";
// import type { Announcement } from "../../types/announcement";
// import { adminApi } from "../../api/admin.api";
// import "./AnnouncementListPage.css";

// /* ================= ROW TYPES ================= */
// type PasswordResetRow = PasswordResetRequest & {
//   [key: string]: unknown;
//   email: string;
//   userName: string;
//   createdAtText: string;
//   expiresAtText: string;
//   status: "PENDING" | "USED" | "EXPIRED";
// };

// export default function AdminRequestsPage() {
//   const [tab, setTab] = useState<"PASSWORD" | "ANNOUNCEMENTS">("PASSWORD");

//   /* ---------- PASSWORD RESET STATE ---------- */
//   const [rows, setRows] = useState<PasswordResetRow[]>([]);
//   const [filtered, setFiltered] = useState<PasswordResetRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selected, setSelected] = useState<PasswordResetRow | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

//   /* ---------- ANNOUNCEMENTS STATE ---------- */
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
//   const [openCreate, setOpenCreate] = useState(false);

//   const [successMsg, setSuccessMsg] = useState("");

//   /* ---------- FETCH PASSWORD RESET ---------- */
//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const res = await adminApi.listPasswordResetRequests();
//       const mapped: PasswordResetRow[] = res.data.data.items.map((r: PasswordResetRequest) => {
//         const expired = new Date(r.expiresAt).getTime() < Date.now();
//         let status: PasswordResetRow["status"] = "PENDING";
//         if (r.usedAt) status = "USED";
//         else if (expired) status = "EXPIRED";
//         return {
//           ...r,
//           email: r.user.email,
//           userName: r.user.name,
//           createdAtText: new Date(r.createdAt).toLocaleString(),
//           expiresAtText: new Date(r.expiresAt).toLocaleString(),
//           status,
//         };
//       });
//       setRows(mapped);
//       setFiltered(mapped);
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Fetch reset requests error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- FILTER PASSWORD RESET ---------- */
//   useEffect(() => {
//     if (tab !== "PASSWORD") return;
//     let result = [...rows];
//     if (search) {
//       const keyword = search.toLowerCase();
//       result = result.filter(
//         (r) => r.email.toLowerCase().includes(keyword) || r.userName.toLowerCase().includes(keyword)
//       );
//     }
//     if (fromDate) {
//       const from = new Date(fromDate).getTime();
//       result = result.filter((r) => new Date(r.createdAt).getTime() >= from);
//     }
//     if (toDate) {
//       const to = new Date(toDate + "T23:59:59").getTime();
//       result = result.filter((r) => new Date(r.createdAt).getTime() <= to);
//     }
//     setFiltered(result);
//     setCurrentPage(1);
//   }, [search, fromDate, toDate, rows, tab]);

//   /* ---------- FETCH ANNOUNCEMENTS ---------- */
//   const fetchAnnouncements = async () => {
//     setLoadingAnnouncements(true);
//     try {
//       const list = await adminApi.listAnnouncements();
//       setAnnouncements(list);
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Fetch announcements error:", err);
//     } finally {
//       setLoadingAnnouncements(false);
//     }
//   };

//   useEffect(() => {
//     if (tab === "PASSWORD") fetchRequests();
//     else fetchAnnouncements();
//   }, [tab]);

//   /* ---------- APPROVE PASSWORD RESET ---------- */
//   const handleApprove = async () => {
//     if (!selected) return;
//     try {
//       await adminApi.approvePasswordResetRequest(selected.token);
//       setSelected(null);
//       fetchRequests();
//     } catch (err) {
//       console.error("Approve reset error:", err);
//     }
//   };

//   /* ---------- TABLE COLUMNS ---------- */
//   const passwordColumns = [
//     { key: "email", title: "Email" },
//     { key: "userName", title: "User Name" },
//     { key: "createdAtText", title: "Requested At" },
//     { key: "expiresAtText", title: "Expires At" },
//     {
//       key: "status",
//       title: "Status",
//       render: (r: PasswordResetRow) => <span className={`status-${r.status.toLowerCase()}`}>{r.status}</span>,
//     },
//     {
//       key: "action",
//       title: "Action",
//       render: (r: PasswordResetRow) => (
//         <Button disabled={r.status !== "PENDING"} onClick={() => setSelected(r)}>
//           Approve
//         </Button>
//       ),
//     },
//   ];

//   /* ---------- PAGINATION DATA ---------- */
//   const totalPasswordPages = Math.ceil(filtered.length / pageSize);
//   const passwordPageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   const totalAnnouncementPages = Math.ceil(announcements.length / pageSize);
//   const announcementPageData = announcements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   /* ---------- RENDER ---------- */
//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>Admin Panel</h2>
//       </div>

//       {/* ===== SUBTABS ===== */}
//       <div className="subtabs">
//         <Button variant={tab === "PASSWORD" ? "primary" : "ghost"} onClick={() => setTab("PASSWORD")}>
//           Password Reset Requests
//         </Button>
//         <Button variant={tab === "ANNOUNCEMENTS" ? "primary" : "ghost"} onClick={() => setTab("ANNOUNCEMENTS")}>
//           Announcements
//         </Button>
//       </div>

//       {/* ===== SUCCESS MESSAGE ===== */}
//       {successMsg && (
//         <div className="toast-success">
//           <span className="toast-text">{successMsg}</span>
//           <button className="toast-close" onClick={() => setSuccessMsg("")}>
//             ×
//           </button>
//         </div>
//       )}

//       {/* ===== PASSWORD RESET TAB ===== */}
//       {tab === "PASSWORD" && (
//         <>
//           <div className="toolbar">
//             <input
//               className="search"
//               placeholder="Search by email or user name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <input title="date1" type="date" className="filter-date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//             <input title="date2" type="date" className="filter-date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//           </div>

//           <Table<PasswordResetRow> columns={passwordColumns} data={passwordPageData} loading={loading} />

//           {/* Pagination */}
//           {totalPasswordPages > 1 && (
//             <div className="pagination">
//               <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
//                 Prev
//               </Button>
//               <span className="page-info">
//                 Page {currentPage} / {totalPasswordPages || 1}
//               </span>
//               <Button
//                 variant="ghost"
//                 disabled={currentPage === totalPasswordPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           )}

//           <ConfirmDialog
//             open={!!selected}
//             title="Approve password reset"
//             message={selected ? `Approve password reset for ${selected.email}?` : ""}
//             onCancel={() => setSelected(null)}
//             onConfirm={handleApprove}
//           />
//         </>
//       )}

//       {/* ===== ANNOUNCEMENTS TAB ===== */}
//       {tab === "ANNOUNCEMENTS" && (
//         <>
//           <div className="toolbar">
//             <Button onClick={() => setOpenCreate(true)}>+ Create Announcement</Button>
//           </div>

//           <div className="announcement-list">
//             {loadingAnnouncements ? (
//               <p>Loading announcements...</p>
//             ) : announcementPageData.length === 0 ? (
//               <p>No announcements found.</p>
//             ) : (
//               announcementPageData.map((a) => <AnnouncementCard key={a.id} announcement={a} />)
//             )}
//           </div>

//           {/* Pagination */}
//           {totalAnnouncementPages > 1 && (
//             <div className="pagination">
//               <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
//                 Prev
//               </Button>
//               <span className="page-info">
//                 Page {currentPage} / {totalAnnouncementPages || 1}
//               </span>
//               <Button
//                 variant="ghost"
//                 disabled={currentPage === totalAnnouncementPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           )}

//           <CreateAnnouncementForm
//             open={openCreate}
//             onClose={() => setOpenCreate(false)}
//             onSuccess={() => {
//               setSuccessMsg("Tạo thông báo thành công !");
//               setTimeout(() => setSuccessMsg(""), 3000);
//               fetchAnnouncements();
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import CreateAnnouncementForm from "../../components/CreateAnnouncementForm/CreateAnnouncementForm";
import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";

import type { Announcement } from "../../types/announcement";
import { adminApi } from "../../api/admin.api";
import "./AnnouncementListPage.css";

export default function AdminAnnouncementsPage() {
  /* ---------- STATE ---------- */
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  /* ---------- FETCH ANNOUNCEMENTS ---------- */
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const list = await adminApi.listAnnouncements();
      setAnnouncements(list);
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch announcements error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(announcements.length / pageSize);
  const pageData = announcements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ---------- RENDER ---------- */
  return (
    <div className="page">
      <div className="page-header">
        <h2>Announcements</h2>
      </div>

      {/* ===== SUCCESS MESSAGE ===== */}
      {successMsg && (
        <div className="toast-success">
          <span className="toast-text">{successMsg}</span>
          <button className="toast-close" onClick={() => setSuccessMsg("")}>
            ×
          </button>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="toolbar">
        <Button onClick={() => setOpenCreate(true)}>+ Create Announcement</Button>
      </div>

      {/* ===== LIST ===== */}
      <div className="announcement-list">
        {loading ? (
          <p>Loading announcements...</p>
        ) : pageData.length === 0 ? (
          <p>No announcements found.</p>
        ) : (
          pageData.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="page-info">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* ===== CREATE FORM ===== */}
      <CreateAnnouncementForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          setSuccessMsg("Tạo thông báo thành công!");
          setTimeout(() => setSuccessMsg(""), 3000);
          fetchAnnouncements();
        }}
      />
    </div>
  );
}
