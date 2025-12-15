import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    //  MOCK LOGIN
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("adminAccessToken", "mock-admin-token");
      navigate("/users");
    } else {
      alert("Sai email hoặc mật khẩu (mock)");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Admin Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  box: {
    width: 320,
    padding: 24,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 4,
    border: "none",
    background: "#1677ff",
    color: "#fff",
    cursor: "pointer",
  },
};
