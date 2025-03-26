import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      alert("Access denied. Admins only.");
      navigate("/login");
      return;
    }

    api
      .get("/admin/requests/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRequests(response.data))
      .catch((error) => {
        console.error("Error fetching requests:", error);
        alert("Error fetching requests.");
      });
  }, [navigate, token, role]);

  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await api.patch(
        `/admin/requests/${requestId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedRequest = response.data; // ✅ Get the latest request data

      // ✅ Update only the modified request in state
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === requestId ? updatedRequest : req))
      );

      alert("Request status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update request status.");
    }
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
            {req.status !== "resolved" && ( // ✅ Hide button if already resolved
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
