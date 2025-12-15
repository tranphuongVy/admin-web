import type { Announcement } from "../../types/announcement";
import "./AnnouncementCard.css";

interface Props {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: Props) {
  return (
    <div className="announcement-card">
      <div className="announcement-header">
        <h4 className="announcement-title">
          {announcement.title}
        </h4>

        <span className="announcement-time">
          {announcement.createdAt.toLocaleString()}
        </span>
      </div>

      <p className="announcement-content">
        {announcement.content}
      </p>
    </div>
  );
}
