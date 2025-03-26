import axios from "axios";

const baseURL = "https://gas-utility-backend.onrender.com/api"; // Replace with your backend URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
