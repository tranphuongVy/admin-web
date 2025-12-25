import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiFileText,
  FiMessageCircle,
  FiBell,
  FiLogOut,
  FiBarChart2,
} from "react-icons/fi";

import { adminApi } from "../../api/admin.api";
import type { PasswordResetRequest } from "../../types/passwordResetRequest";
import { storage } from "../../utils/storage";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [resetCount, setResetCount] = useState<number>(0);

  /* ===== FETCH RESET PASSWORD COUNT ===== */
  useEffect(() => {
    let mounted = true;

    const fetchResetCount = async () => {
      try {
        const res = await adminApi.listPasswordResetRequests();

        const pending = res.data.data.items.filter(
          (r: PasswordResetRequest) => {
            const expired =
              new Date(r.expiresAt).getTime() < Date.now();
            return !r.usedAt && !expired;
          }
        );

        if (mounted) {
          setResetCount(pending.length);
        }
      } catch (err) {
        console.error("Fetch reset count error", err);
      }
    };

    fetchResetCount();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===== MENU CONFIG ===== */
  const menus = [
    {
      label: "Statistics",
      path: "/statistics",
      icon: FiBarChart2,
    },
    { label: "Users", path: "/users", icon: FiUsers },
    { label: "Posts", path: "/posts", icon: FiFileText },
    { label: "Comments", path: "/comments", icon: FiMessageCircle },
    {
      label: "Announcements",
      path: "/announcements",
      icon: FiBell,
      badge: resetCount,
    },
  ];

  return (
    <aside className="sidebar">
      {/* ===== LOGO ===== */}
      <div className="sidebar-header">
        <div className="logo-circle">S</div>
        <div>
          <div className="logo-text">Social Admin</div>
          <div className="logo-sub">Management Panel</div>
        </div>
      </div>

      {/* ===== MENU ===== */}
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

              <div className="menu-icon-wrapper">
                <Icon className="menu-icon" />

                {m.badge !== undefined && m.badge > 0 && (
                  <span className="menu-badge">{m.badge}</span>
                )}
              </div>

              <span className="menu-text">{m.label}</span>
            </div>
          );
        })}
      </nav>

      {/* ===== FOOTER ===== */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={() => {
            storage.clearAdmin();
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
