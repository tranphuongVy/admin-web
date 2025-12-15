import { useMemo, useState } from "react";
import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";
import CreateAnnouncementForm from "../../components/CreateAnnouncementForm/CreateAnnouncementForm";
import Button from "../../components/Button/Button";
import type { Announcement } from "../../types/announcement";
import "./AnnouncementListPage.css";

/* ================= MOCK DATA ================= */

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Thông báo bảo trì hệ thống",
    content:
      "Hệ thống sẽ bảo trì từ 22:00 ngày 20/12 đến 02:00 ngày 21/12.",
    createdAt: new Date("2025-12-20T22:00:00"),
  },
  {
    id: "2",
    title: "Cập nhật chính sách nội dung",
    content:
      "Admin vừa cập nhật chính sách kiểm duyệt nội dung mới.",
    createdAt: new Date("2025-12-18T09:30:00"),
  },
];

/* ================= PAGE ================= */

export default function AnnouncementListPage() {
  /* ===== STATE ===== */
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  const [openCreate, setOpenCreate] = useState(false);

  /* ===== SORT ===== */
  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      ),
    [announcements]
  );

  /* ===== HANDLER CREATE ===== */
  const handleCreateAnnouncement = (data: {
    title: string;
    content: string;
  }) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      createdAt: new Date(),
    };

    setAnnouncements((prev) => [
      newAnnouncement,
      ...prev,
    ]);
  };

  /* ================= RENDER ================= */

  return (
    <div className="announcement-page">
      {/* ===== HEADER ===== */}
      <div className="announcement-page-header">
        <div>
          <h2>Admin Announcements</h2>
          <p>
            Quản lý và hiển thị các thông báo chính thức
            từ hệ thống dành cho người dùng
          </p>
        </div>

        <Button onClick={() => setOpenCreate(true)}>
          + Create Announcement
        </Button>
      </div>

      {/* ===== LIST ===== */}
      {sortedAnnouncements.length === 0 ? (
        <div className="announcement-empty">
          <p>Chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="announcement-list">
          {sortedAnnouncements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
            />
          ))}
        </div>
      )}

      {/* ===== CREATE FORM ===== */}
      <CreateAnnouncementForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateAnnouncement}
      />
    </div>
  );
}
