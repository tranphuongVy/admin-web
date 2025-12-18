import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import CreateAnnouncementForm from "../../components/CreateAnnouncementForm/CreateAnnouncementForm";
import type { PasswordResetRequest } from "../../types/passwordResetRequest";
import { adminApi } from "../../api/admin.api";
import "./AnnouncementListPage.css";

/* ================= ROW TYPE ================= */
type PasswordResetRow = PasswordResetRequest & {
  [key: string]: unknown;
  email: string;
  userName: string;
  createdAtText: string;
  expiresAtText: string;
  status: "PENDING" | "USED" | "EXPIRED";
};

export default function PasswordResetRequestPage() {
  /* ---------- STATE ---------- */
  const [rows, setRows] = useState<PasswordResetRow[]>([]);
  const [filtered, setFiltered] = useState<PasswordResetRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selected, setSelected] =
    useState<PasswordResetRow | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [successMsg, setSuccessMsg] = useState(""); // 🔥 thông báo thành công

  /* ---------- FETCH ---------- */
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listPasswordResetRequests();

      const mapped: PasswordResetRow[] =
        res.data.data.items.map((r: PasswordResetRequest) => {
          const expired =
            new Date(r.expiresAt).getTime() < Date.now();

          let status: PasswordResetRow["status"] = "PENDING";
          if (r.usedAt) status = "USED";
          else if (expired) status = "EXPIRED";

          return {
            ...r,
            email: r.user.email,
            userName: r.user.name,
            createdAtText: new Date(r.createdAt).toLocaleString(),
            expiresAtText: new Date(r.expiresAt).toLocaleString(),
            status,
          };
        });

      setRows(mapped);
      setFiltered(mapped);
    } catch (err) {
      console.error("Fetch reset requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------- FILTER ---------- */
  useEffect(() => {
    let result = [...rows];

    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.email.toLowerCase().includes(keyword) ||
          r.userName.toLowerCase().includes(keyword)
      );
    }

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      result = result.filter(
        (r) => new Date(r.createdAt).getTime() >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate + "T23:59:59").getTime();
      result = result.filter(
        (r) => new Date(r.createdAt).getTime() <= to
      );
    }

    setFiltered(result);
  }, [search, fromDate, toDate, rows]);

  /* ---------- APPROVE ---------- */
  const handleApprove = async () => {
    if (!selected) return;
    try {
      await adminApi.approvePasswordResetRequest(selected.token);
      setSelected(null);
      fetchRequests();
    } catch (err) {
      console.error("Approve reset error:", err);
    }
  };

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "email", title: "Email" },
    { key: "userName", title: "User Name" },
    { key: "createdAtText", title: "Requested At" },
    { key: "expiresAtText", title: "Expires At" },
    {
      key: "status",
      title: "Status",
      render: (r: PasswordResetRow) => (
        <span className={`status-${r.status.toLowerCase()}`}>
          {r.status}
        </span>
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (r: PasswordResetRow) => (
        <Button
          disabled={r.status !== "PENDING"}
          onClick={() => setSelected(r)}
        >
          Approve
        </Button>
      ),
    },
  ];

  /* ---------- RENDER ---------- */
  return (
    <div className="page">
      <div className="page-header">
        <h2>Password Reset Requests</h2>
      </div>

      {/* ===== SUCCESS MESSAGE ===== */}
{successMsg && (
  <div className="toast-success">
    <span className="toast-text">{successMsg}</span>
    <button
      className="toast-close"
      onClick={() => setSuccessMsg("")}
    >
      ×
    </button>
  </div>
)}



      {/* ===== TOOLBAR ===== */}
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by email or user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
        title="date1"
          type="date"
          className="filter-date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
        title="date2"
          type="date"
          className="filter-date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <Button onClick={() => setOpenCreate(true)}>
          Create Announcement
        </Button>
      </div>

      <Table<PasswordResetRow>
        columns={columns}
        data={filtered}
        loading={loading}
      />

      <ConfirmDialog
        open={!!selected}
        title="Approve password reset"
        message={
          selected
            ? `Approve password reset for ${selected.email}?`
            : ""
        }
        onCancel={() => setSelected(null)}
        onConfirm={handleApprove}
      />

      {/* ===== CREATE ANNOUNCEMENT ===== */}
      <CreateAnnouncementForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          setSuccessMsg("Tạo thông báo thành công !");
          setTimeout(() => setSuccessMsg(""), 3000);
        }}
      />
    </div>
  );
}
