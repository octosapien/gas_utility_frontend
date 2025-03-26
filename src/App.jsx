import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";  // ✅ Added Navigate import
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Account from "./Pages/Account";
import NewService from "./Pages/NewService";
import AdminDashboard from "./Pages/AdminDashboard";
import Navbar from "./Pages/Navbar";

function App() {
    return (
      <>
        
        <Router>
        <Navbar/>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />  {/* ✅ Redirect to /login */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/new-service" element={<NewService />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
        </>
    );
}

export default App;
