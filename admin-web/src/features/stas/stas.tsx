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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { adminApi } from "../../api/admin.api";
import "./stas.css";

type Stats = {
  users: {
    active: number;
    banned: number;
  };
  posts: {
    total: number;
    hidden: number;
    deleted: number;
  };
  comments: {
    total: number;
    hidden: number;
    deleted: number;
  };
};

const COLORS = ["#2563eb", "#f59e0b", "#dc2626"];

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  /* ===== BAR CHART DATA ===== */
  const barData = [
    { name: "Users", value: stats.users.active },
    { name: "Posts", value: stats.posts.total },
    { name: "Comments", value: stats.comments.total },
  ];

  /* ===== PIE CHART DATA ===== */
  const pieData = [
    {
      name: "Active Users",
      value: stats.users.active,
    },
    {
      name: "Hidden Posts",
      value: stats.posts.hidden,
    },
    {
      name: "Deleted Posts",
      value: stats.posts.deleted,
    },
  ];

  /* ===== LINE CHART DATA (mock trend – ready for real API) ===== */
  const lineData = [
    { name: "Mon", posts: 2, comments: 1 },
    { name: "Tue", posts: 3, comments: 2 },
    { name: "Wed", posts: 4, comments: 3 },
    { name: "Thu", posts: 5, comments: 4 },
    { name: "Fri", posts: stats.posts.total, comments: stats.comments.total },
  ];

  return (
    <div className="stas-page">
      {/* ===== HEADER ===== */}
      <div className="stas-header">
        <h2>
          <FiBarChart2 /> Statistics
        </h2>
        <p className="subtitle">Overview of system activity</p>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="stas-cards">
        <div className="stas-card">
          <div className="card-icon users">
            <FiUsers />
          </div>
          <div className="card-info">
            <span className="label">Active Users</span>
            <strong className="value">
              {stats.users.active}
            </strong>
            <span className="sub">
              Banned: {stats.users.banned}
            </span>
          </div>
        </div>

        <div className="stas-card">
          <div className="card-icon posts">
            <FiFileText />
          </div>
          <div className="card-info">
            <span className="label">Posts</span>
            <strong className="value">
              {stats.posts.total}
            </strong>
            <span className="sub">
              Hidden: {stats.posts.hidden} · Deleted:{" "}
              {stats.posts.deleted}
            </span>
          </div>
        </div>

        <div className="stas-card">
          <div className="card-icon comments">
            <FiMessageCircle />
          </div>
          <div className="card-info">
            <span className="label">Comments</span>
            <strong className="value">
              {stats.comments.total}
            </strong>
            <span className="sub">
              Hidden: {stats.comments.hidden} · Deleted:{" "}
              {stats.comments.deleted}
            </span>
          </div>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="stas-charts">
        {/* BAR */}
        <div className="chart-card">
          <h3>Overview Comparison</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="chart-card wide">
          <h3>Activity Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#2563eb"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#9333ea"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
