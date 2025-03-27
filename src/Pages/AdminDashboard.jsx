import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // Function to refresh the token
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

  // Function to get a valid access token
  const getValidToken = async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      return await refreshToken();
    }
    return token;
  };

  // Wrapper function to handle API requests with auto-refresh on 401
  const handleRequestWithRefresh = async (apiCall) => {
    try {
      return await apiCall();
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Unauthorized request. Attempting token refresh...");
        const newToken = await refreshToken();
        if (!newToken) return;
        return await apiCall(); // Retry request with new token
      } else {
        throw error;
      }
    }
  };

  // Automatically refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
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
        requests.map((req) => (
          <div
            key={req.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "10px auto",
              width: "300px",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            <p>
              <strong>Request ID:</strong> {req.id}
            </p>
            <p>
              <strong>Status:</strong> {req.status}
            </p>
            {req.status !== "resolved" && (
              <button
                onClick={() => updateStatus(req.id, "resolved")}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffc107",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))
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
