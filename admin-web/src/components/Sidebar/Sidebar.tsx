import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiFileText,
  FiMessageCircle,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { label: "Users", path: "/users", icon: FiUsers },
    { label: "Posts", path: "/posts", icon: FiFileText },
    { label: "Comments", path: "/comments", icon: FiMessageCircle },
    { label: "Announcements", path: "/announcements", icon: FiBell },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-circle">S</div>
        <div>
          <div className="logo-text">Social Admin</div>
          <div className="logo-sub">Management Panel</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menus.map((m) => {
          const active = location.pathname.startsWith(m.path);
          const Icon = m.icon;

          return (
            <div
              key={m.path}
              className={`menu-item ${active ? "active" : ""}`}
              onClick={() => navigate(m.path)}
            >
              <span className="active-indicator" />
              <Icon className="menu-icon" />
              <span className="menu-text">{m.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("adminAccessToken");
            navigate("/login");
          }}
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}
