import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config";

const Account = () => {
  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    api.get("/requests/", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUser(response.data.user);
        setRequests(response.data.requests);
      })
      .catch(() => alert("Error fetching account details"));
  }, [navigate]);

  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    if (width <= 480) {
      return { width: "90%", padding: "15px", fontSize: "12px" };
    } else if (width <= 768) {
      return { width: "70%", padding: "20px", fontSize: "14px" };
    }
    return { width: "400px", padding: "20px", fontSize: "16px" };
  };

  return (
    <div
      style={{
        ...getResponsiveStyles(),
        margin: "50px auto",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#333" }}>Welcome, {user?.name || "User"}</h2>
      <p style={{ color: "#555" }}>Email: {user?.email || "N/A"}</p>

      <h3 style={{ marginTop: "20px", color: "#333" }}>Service Requests</h3>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          border: "1px solid #ddd",
          textAlign: "left",
        }}
      >
        {requests?.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              {Object.entries(req).map(([key, value]) => (
                <p key={key} style={{ margin: "5px 0", color: "#444" }}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {String(value)}
                </p>
              ))}
            </div>
          ))
        ) : (
          <p style={{ color: "#777" }}>No service requests found.</p>
        )}
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#d9534f",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
