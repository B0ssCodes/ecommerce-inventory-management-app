import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

function CreateCategoryForm() {
  const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
    const url = "https://localhost:7200/api/category/create";
    const token = localStorage.getItem("token");
    const payload = {
      name: values.name,
      description: values.description,
    };
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
        message.success("Category added successfully");
        navigate("/categories");
      } else {
        const error = data.message || "An unknown error occurred";
        console.error("Failed to add Category:", error);
        message.error(error);
      }
    } catch (error) {
      console.error("Error adding Category:", error);
      message.error("Error adding Category");
    }
  };

  return (
    <div>
      <Form
        name="addCategory"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the Category Name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the Description!" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateCategoryForm;
