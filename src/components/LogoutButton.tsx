import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "#f87171",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        cursor: "pointer",
        margin: "8px 0",
        boxShadow: "0 2px 8px rgba(248,113,113,0.15)",
        transition: "background 0.2s",
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#dc2626')}
      onMouseOut={e => (e.currentTarget.style.background = '#f87171')}
    >
      Log out
    </button>
  );
};

export default LogoutButton; 