import React, { useState } from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function DeleteTransaction({ transactionID }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    console.log("Deleting transaction with ID:", transactionID);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7200/api/transaction/delete/${transactionID}`,
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
        console.error("Failed to delete transaction");
        alert(response.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while deleting the transaction");
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
        title="Are you sure you want to delete this transaction?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        okType="danger"
        cancelText="No"
      >
        <div>
          <p>This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}

export default DeleteTransaction;
