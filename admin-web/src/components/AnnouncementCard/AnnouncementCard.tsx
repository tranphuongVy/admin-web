// AnnouncementCard.tsx
import type { Announcement } from "../../types/announcement";
import "./AnnouncementCard.css";

interface Props {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: Props) {
  return (
    <div className="announcement-card">
      <div className="announcement-header">
        <h3 className="announcement-title">{announcement.title}</h3>
        <span className="announcement-time">
          {new Date(announcement.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="announcement-content">{announcement.content}</p>
    </div>
  );
}
