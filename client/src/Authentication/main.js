import React, { useEffect, useState } from "react";
import { Button, Typography, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";

const { Title, Text } = Typography;

const RoleChecker = ({ userRole, userEmail, children }) => {
  const [isRoleValid, setIsRoleValid] = useState(true);
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      // Check if this is the first load after navigation
      const hasRefreshed = sessionStorage.getItem('hasRefreshed');
      if (!hasRefreshed) {
        sessionStorage.setItem('hasRefreshed', 'true');
        window.location.reload();
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setIsRoleValid(false);
        return;
      }

      try {
        // First, fetch the current user's role from the API
        const response = await api.get("/api/users/profile");
        const dbRole = response.data.role;

        const decodedToken = jwtDecode(token);
        const tokenRole = decodedToken.user.role;

        console.log(`tokenRole: ${tokenRole}, dbRole: ${dbRole}`);

        if (tokenRole !== dbRole) {
          setIsRoleValid(false);
        }
      } catch (error) {
        console.error("Error checking role:", error);
        setIsRoleValid(false);
      }
    };

    checkRole();
  }, []);

  const loginUserAgain = async ({
    userEmailForLogin,
    userPasswordForLogin,
  }) => {
    const response = await api.post("/api/auth/login", {
      email: userEmailForLogin,
      password: userPasswordForLogin,
      firmId: null,
    });
  };

  const handleNavigateToOriginalDashboard = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!isRoleValid) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Title level={2}>Your user role has changed.</Title>
        <Text style={{ marginBottom: "20px" }}>
          Please return to the original dashboard to continue.
        </Text>
        <Button type="primary" onClick={handleNavigateToOriginalDashboard}>
          Navigate to Original Dashboard
        </Button>
      </div>
    );
  }
  return children;
};

export default RoleChecker;