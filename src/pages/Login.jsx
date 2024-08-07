import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { Typography, Alert, Button, message } from "antd";
const { Title } = Typography;

function Login({ setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(
    !!location.state?.successMessage
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      message.info("You are already logged in");
      navigate("/");
    }
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // Hide the message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [showSuccessMessage]);

  return (
    <div>
      {showSuccessMessage && (
        <Alert
          message={location.state.successMessage}
          type="success"
          showIcon
        />
      )}
      <Title level={1} style={{ textAlign: "center" }}>
        Login
      </Title>

      <LoginForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

export default Login;
