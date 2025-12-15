import Button from "../Button/Button";
import "./UserDetailModal.css";
import type { User } from "../../types/user";

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onToggleBan: (user: User) => void;
}

export default function UserDetailModal({
  open,
  user,
  onClose,
  onToggleBan,
}: Props) {
  if (!open || !user) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <img
            src={user.avatarUrl || "/avatar-placeholder.png"}
            alt="avatar"
            className="avatar"
          />

          <div>
            <h3>{user.name || "Unnamed User"}</h3>
            <p className="email">{user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="info-grid">
          <Info label="User ID" value={user.id} />
          <Info label="Role" value={user.role} />

          <Info
            label="Email Verified"
            value={user.isEmailVerified ? "Yes" : "No"}
          />

          <Info
            label="Status"
            value={
              <span
                className={
                  user.isBanned ? "status-banned" : "status-active"
                }
              >
                {user.isBanned ? "BANNED" : "ACTIVE"}
              </span>
            }
          />

          <Info
            label="Online"
            value={
              user.isOnline === null
                ? "Unknown"
                : user.isOnline
                ? "Online"
                : "Offline"
            }
          />

          <Info
            label="Last seen"
            value={
              user.lastSeenAt
                ? new Date(user.lastSeenAt).toLocaleString()
                : "—"
            }
          />

          <Info
            label="Joined"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="bio">
            <label>Bio</label>
            <p>{user.bio}</p>
          </div>
        )}

        {/* Actions */}
<div className="actions">
  <Button
    variant={user.isBanned ? "primary" : "danger"}
    onClick={() => {
      onClose();          
      onToggleBan(user); 
    }}
  >
    {user.isBanned ? "Unban User" : "Ban User"}
  </Button>

  <Button variant="ghost" onClick={onClose}>
    Close
  </Button>
</div>

      </div>
    </div>
  );
}

/* ========== Sub component ========== */

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="info-item">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}
