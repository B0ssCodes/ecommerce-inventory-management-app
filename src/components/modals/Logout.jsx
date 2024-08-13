import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsLoggedIn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("userPermissions");

      setIsLoggedIn(false);

      navigate("/login");
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleLogout();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" danger onClick={showModal}>
        Logout
      </Button>
      <Modal
        title="Confirm Logout"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
};

export default Logout;
