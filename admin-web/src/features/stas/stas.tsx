import { useEffect, useState } from "react";
import {
  FiUsers,
  FiFileText,
  FiMessageCircle,
  FiBarChart2,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { adminApi } from "../../api/admin.api";
import "./stas.css";
import type { Stats } from "../../types/stats";

type ChartType = "USERS" | "POSTS" | "COMMENTS";

/* ================= CONSTANTS ================= */

const USER_COLORS = ["#2563eb", "#dc2626"];

/* ================= COMPONENT ================= */

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartType, setChartType] =
    useState<ChartType>("USERS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        if (mounted) setStats(res.data.data);
      } catch (err) {
        console.error("Fetch stats failed", err);
        if (mounted) setError("Failed to load statistics");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return <p className="stats-empty">Loading statistics...</p>;
  if (error)
    return <p className="stats-empty error">{error}</p>;
  if (!stats) return null;

  /* ================= DATA ================= */

  const userPieData = [
    { name: "Active", value: stats.users.active },
    { name: "Banned", value: stats.users.banned },
  ];

  const postBarData = [
    { name: "Total", value: stats.posts.total },
    { name: "Hidden", value: stats.posts.hidden },
    { name: "Deleted", value: stats.posts.deleted },
  ];

  const commentBarData = [
    { name: "Total", value: stats.comments.total },
    { name: "Hidden", value: stats.comments.hidden },
    { name: "Deleted", value: stats.comments.deleted },
  ];

  /* ================= RENDER CHART ================= */

  const renderChart = () => {
    switch (chartType) {
      case "USERS":
        return (
          <div className="chart-card">
            <h3>User Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {userPieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={USER_COLORS[i]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case "POSTS":
        return (
          <div className="chart-card">
            <h3>Post Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "COMMENTS":
        return (
          <div className="chart-card">
            <h3>Comment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commentBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="stas-page">
      {/* ===== HEADER ===== */}
      <div className="stas-header">
        <h2>
          <FiBarChart2 /> Statistics
        </h2>
        <p className="subtitle">
          Select chart type to view details
        </p>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="stas-cards">
        <div className="stas-card">
          <FiUsers />
          <div>
            <strong>{stats.users.active}</strong>
            <span>Active Users</span>
          </div>
        </div>

        <div className="stas-card">
          <FiFileText />
          <div>
            <strong>{stats.posts.total}</strong>
            <span>Total Posts</span>
          </div>
        </div>

        <div className="stas-card">
          <FiMessageCircle />
          <div>
            <strong>{stats.comments.total}</strong>
            <span>Total Comments</span>
          </div>
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className="stas-filter">
        <label>
          Chart type:
          <select
            value={chartType}
            onChange={(e) =>
              setChartType(
                e.target.value as ChartType
              )
            }
          >
            <option value="USERS">
              Users
            </option>
            <option value="POSTS">
              Posts
            </option>
            <option value="COMMENTS">
              Comments
            </option>
          </select>
        </label>
      </div>

      {/* ===== CHART ===== */}
      {renderChart()}
    </div>
  );
}
