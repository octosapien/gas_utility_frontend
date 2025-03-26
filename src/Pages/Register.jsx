import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const Register = () => { 
  const [userData, setUserData] = useState({ username: "", email: "", password: "", role: "USER" }); 
  const navigate = useNavigate(); 

  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value }); 

  const handleRegister = async (e) => { 
    e.preventDefault(); 
    try { 
      await axios.post("http://127.0.0.1:8000/api/register/", userData, { headers: { "Content-Type": "application/json" } }); 
      navigate("/"); 
    } catch (error) { 
      alert("Registration failed"); 
    } 
  }; 

  return ( 
    <form onSubmit={handleRegister} style={{ 
      display: "flex", flexDirection: "column", alignItems: "center", 
      justifyContent: "center", height: "100vh" 
    }}> 
      <h2 style={{ marginBottom: "20px" }}>Register</h2> 
      <input 
        name="username" type="text" placeholder="Username" onChange={handleChange} required 
        style={{ padding: "10px", width: "250px", marginBottom: "10px", borderRadius: "5px" }} 
      /> 
      <input 
        name="email" type="email" placeholder="Email" onChange={handleChange} required 
        style={{ padding: "10px", width: "250px", marginBottom: "10px", borderRadius: "5px" }} 
      /> 
      <input 
        name="password" type="password" placeholder="Password" onChange={handleChange} required 
        style={{ padding: "10px", width: "250px", marginBottom: "10px", borderRadius: "5px" }} 
      /> 
      <select name="role" onChange={handleChange} 
        style={{ padding: "10px", width: "250px", marginBottom: "10px", borderRadius: "5px" }}> 
        <option value="USER">User</option> 
        <option value="ADMIN">Admin</option> 
      </select> 
      <button type="submit" style={{ 
        padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", 
        borderRadius: "5px", cursor: "pointer" 
      }}>Register</button> 
    </form> 
  ); 
}; 

export default Register;
