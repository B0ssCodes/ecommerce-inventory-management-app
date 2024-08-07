import React, { useState } from "react";
import { Button, Modal, Radio } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function CreateTransactionButton() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionTypeID, setTransactionTypeID] = useState(null);

  const showCreateTransactionModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    navigate("/select-vendor", { state: { transactionTypeID } });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showCreateTransactionModal}
      >
        Create Transaction
      </Button>
      <Modal
        title="Which type of transaction do you want to add?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Radio.Group onChange={(e) => setTransactionTypeID(e.target.value)}>
          <Radio value="1">Inbound</Radio>
          <Radio value="2">Outbound</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
}

export default CreateTransactionButton;
