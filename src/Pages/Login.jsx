import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/login/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("role", response.data.role || "USER");
      navigate(response.data.role === "ADMIN" ? "/admin-dashboard" : "/account");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "10px",
          borderRadius: "5px",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "10px",
          borderRadius: "5px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Login
      </button>
    </form>
  );
};

export default Login;
