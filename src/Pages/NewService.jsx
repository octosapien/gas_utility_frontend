import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const NewService = () => {
  const [requestType, setRequestType] = useState("");
  const [details, setDetails] = useState("");
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login"); // Redirect to login page
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

  // Automatically refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getValidToken(); // Ensure a valid token before making request

    const requestData = {
      request_type: requestType,
      details,
    };

    try {
      const response = await api.post("/requests/create/", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Service request created successfully!");
      console.log("Request Created:", response.data);
      navigate("/account"); // Redirect to account page after submission
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        width: "300px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>New Service Request</h2>

      <input
        type="text"
        placeholder="Enter Request Type"
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <textarea
        placeholder="Describe your request"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        required
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          resize: "none",
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007BFF",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default NewService;
