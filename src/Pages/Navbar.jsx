import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateRole = () => {
      setUserRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", updateRole); // Listen for localStorage changes
    return () => window.removeEventListener("storage", updateRole); // Cleanup
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null); // Immediately update UI
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "#007BFF",
        color: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ margin: 0 }}>Gas Utility</h2>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {userRole === "USER" && (
          <Link
            to="/new-service"
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              borderRadius: "5px",
              textDecoration: "none",
              color: "white",
              fontSize: "14px",
            }}
          >
            New Service
          </Link>
        )}

        {userRole ? (
          <>
            <Link
              to={userRole === "USER" ? "/account" : "/admin-dashboard"}
              style={{
                padding: "8px 15px",
                backgroundColor: "#17a2b8",
                borderRadius: "5px",
                textDecoration: "none",
                color: "white",
                fontSize: "14px",
              }}
            >
              Account
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 15px",
                backgroundColor: "#dc3545",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                color: "white",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: "8px 15px",
                backgroundColor: "#ffc107",
                borderRadius: "5px",
                textDecoration: "none",
                color: "black",
                fontSize: "14px",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: "8px 15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
                textDecoration: "none",
                color: "black",
                fontSize: "14px",
                border: "1px solid #ccc",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
