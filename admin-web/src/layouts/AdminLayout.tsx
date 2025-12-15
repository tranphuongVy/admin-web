import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="content">
        {/* <div className="topbar">
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div> */}

        <Outlet />
      </main>
    </div>
  );
}
