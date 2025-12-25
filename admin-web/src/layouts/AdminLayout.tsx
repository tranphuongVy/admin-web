import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
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
