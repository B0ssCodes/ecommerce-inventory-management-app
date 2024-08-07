import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

function CreateVendorForm() {
  const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
    const url = "https://localhost:7200/api/vendor/create";
    const token = localStorage.getItem("token");
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      commercialPhone: values.commercialPhone,
      address: values.address,
    };
    console.log(payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Vendor added successfully");
        navigate("/vendors");
      } else {
        const error = data.message || "An unknown error occurred";
        console.error("Failed to add vendor:", error);
        message.error(error);
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      message.error("Error adding vendor");
    }
  };

  return (
    <div>
      <Form
        name="addVendor"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Vendor Name"
          name="name"
          rules={[{ required: true, message: "Please input the Vendor Name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input the Email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please input the Phone Number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Commercial Phone Number"
          name="commercialPhone"
          rules={[
            {
              required: true,
              message: "Please input the Commercial Phone Number!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input the Address!" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Vendor
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateVendorForm;
