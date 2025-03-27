import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        throw new Error("No refresh token available. Please log in again.");
      }

      const response = await api.post("/api/token/refresh/", { refresh: refresh_token });
      localStorage.setItem("access_token", response.data.access);
      return response.data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      alert("Session expired. Please log in again.");
      localStorage.clear();
      navigate("/login");
    }
  };

  const getValidToken = async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      return await refreshToken();
    }
    return token;
  };

  const handleRequestWithRefresh = async (apiCall) => {
    try {
      return await apiCall();
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Unauthorized request. Attempting token refresh...");
        const newToken = await refreshToken();
        if (!newToken) return;
        return await apiCall();
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const role = localStorage.getItem("role");

      if (role !== "ADMIN") {
        alert("Access denied. Admins only.");
        navigate("/login");
        return;
      }

      await handleRequestWithRefresh(async () => {
        const token = await getValidToken();
        const response = await api.get("/admin/requests/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Requests:", response.data);
        setRequests(response.data);
      });
    };

    fetchRequests();
  }, [navigate]);

  const updateStatus = async (requestId, newStatus) => {
    await handleRequestWithRefresh(async () => {
      const token = await getValidToken();
      const response = await api.patch(
        `/admin/requests/${requestId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedRequest = response.data;
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === requestId ? updatedRequest : req))
      );

      alert("Request status updated successfully!");
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {requests.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {requests?.map(({ user, request }) => (
        <div
            key={request.id} // Ensure this key is unique
            style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h4 style={{ marginBottom: "10px", color: "#333" }}>Request ID: {request.id}</h4>
            <p>
            <strong>User:</strong> {user.username} ({user.email}) {/* Ensure only strings are rendered */}
            </p>
            <p>
            <strong>Request Type:</strong> {request.request_type}
            </p>
            <p>
            <strong>Details:</strong> {request.details}
            </p>
            <p>
            <strong>Status:</strong> {request.status}
            </p>
            {request.status !== "resolved" && (
            <button
                onClick={() => updateStatus(request.id, "resolved")}
                style={{
                padding: "5px 10px",
                backgroundColor: "#ffc107",
                border: "none",
                cursor: "pointer",
                borderRadius: "3px",
                marginTop: "10px",
                }}
            >
                Mark Resolved
            </button>
            )}
        </div>
        ))}

        </div>
      ) : (
        <p>No requests available.</p>
      )}

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
