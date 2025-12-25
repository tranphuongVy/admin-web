// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { authApiClient } from "../../api/auth.api";
// import axios from "axios";

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//   try {
//     const res = await authApiClient.login(email, password);

//     const { accessToken, refreshToken, user } = res.data.data;

//     localStorage.setItem("adminAccessToken", accessToken);
//     localStorage.setItem("adminRefreshToken", refreshToken);

//     // optional: check role
//     if (user.role !== "ADMIN") {
//       alert("Không có quyền admin");
//       return;
//     }

//     navigate("/statistics");
//   } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         alert(err.response?.data?.message || "Đăng nhập thất bại");
//       } else {
//         alert("Đăng nhập thất bại");
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.box}>
//         <h2 style={styles.title}>Admin Login</h2>
//         <input
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           style={styles.input}
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button style={styles.button} onClick={handleLogin}>
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f8" },
//   box: { width: 320, padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
//   title: { textAlign: "center" as const, marginBottom: 20 },
//   input: { width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" },
//   button: { width: "100%", padding: 10, borderRadius: 4, border: "none", background: "#1677ff", color: "#fff", cursor: "pointer" },
// };

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authApiClient } from "../../api/auth.api";
import axios from "axios";
import { FiMail, FiLock } from "react-icons/fi";
import { storage } from "../../utils/storage";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      const res = await authApiClient.login(email, password);
      const { accessToken, refreshToken, user } = res.data.data;

      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);

      if (user.role !== "ADMIN") {
        alert("Không có quyền admin");
        return;
      }

      navigate("/statistics");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Đăng nhập thất bại");
      } else {
        alert("Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">S</div>
        <h2 className="login-title">Admin Panel</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
