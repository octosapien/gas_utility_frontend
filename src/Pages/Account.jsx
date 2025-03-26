import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const Account = () => {
  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Retrieved token from localStorage:", token);

    if (!token) {
      console.error("Token is null or undefined. Redirecting to login.");
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    api
      .get("/requests/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setUser(response.data.user);
        setRequests(response.data.requests);
      })
      .catch((error) => {
        console.error("Error fetching account details:", error);
        alert("Error fetching account details");
      });
  }, [navigate]);

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#333" }}>Welcome, {user?.name || "User"}</h2>
      <p style={{ color: "#555", fontSize: "14px" }}>Email: {user?.email || "N/A"}</p>

      <h3 style={{ marginTop: "20px", color: "#333" }}>Service Requests</h3>
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      >
        {requests?.length > 0 ? (
          requests.map((req) => (
            <div
              key={req.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              <p style={{ margin: "5px 0", color: "#444" }}>
                <strong>Request ID:</strong> {req.id} <br />
                <strong>Status:</strong> {req.status}
              </p>
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
