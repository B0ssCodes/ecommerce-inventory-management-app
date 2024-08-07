import React, { useState } from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function DeleteUserRole({ userRoleID }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    console.log("Deleting UserRole with ID:", userRoleID);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7200/api/userRole/delete/${userRoleID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete user role");
        alert(response.message || "Failed to delete user role");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while deleting the user role");
    }
  };

  const showDeleteConfirm = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleDelete();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={showDeleteConfirm}
      ></Button>
      <Modal
        title="Are you sure you want to delete this user role?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        okType="danger"
        cancelText="No"
      >
        <div>
          <p style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
            Deleting this user role will remove all users related to it
          </p>
          <p>This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}

export default DeleteUserRole;
