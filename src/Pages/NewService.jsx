import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config"; // Import the configured axios instance

const NewService = () => {
  const [requestType, setRequestType] = useState("");
  const [details, setDetails] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      request_type: requestType,
      details,
      authorization: `Bearer ${token}`, // Include authorization in payload
    };

    try {
      const response = await api.post("/requests/create/", requestData);
      alert("Service request created successfully!");
      console.log("Request Created:", response.data);
      navigate("/account"); // Redirect to the account page after submission
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

      <select
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select Request Type</option>
        <option value="Gas Leak">Gas Leak</option>
        <option value="Pipeline Maintenance">Pipeline Maintenance</option>
        <option value="Billing Issue">Billing Issue</option>
      </select>

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
