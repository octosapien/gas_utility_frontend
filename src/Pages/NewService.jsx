import { useState } from "react";
import axios from "axios";

const NewService = () => {
  const [requestType, setRequestType] = useState("");
  const [details, setDetails] = useState("");
  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = { request_type: requestType, details };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/requests/create/",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service request created successfully!");
      console.log("Request Created:", response.data);
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
