import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api"; // Replace with your backend URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
