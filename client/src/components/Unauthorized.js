import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        textAlign: "center",
        padding: "20px",
        margin: "0",
        fontSize: "1.5em",
        fontWeight: "bold",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
        animation: "fadeIn 1s",
        position: "relative",
        overflow: "hidden",
        zIndex: "1",
        border: "2px solid #333",
        width: "50%",
        height: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "10%",
        marginBottom: "10%",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        transform: "translateY(-10px)",
      }}
    >
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    </div>
  );
};

export default Unauthorized;
