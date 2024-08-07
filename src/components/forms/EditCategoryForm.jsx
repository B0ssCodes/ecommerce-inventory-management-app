import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const EditCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryID } = location.state || {};
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const url = `https://localhost:7200/api/category/get/${categoryID}`;
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        form.setFieldsValue(data.result);
      } catch (error) {
        console.error("Failed to fetch category details:", error);
      }
    };

    if (categoryID) {
      fetchCategoryDetails();
    }
  }, [categoryID, form]);

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
    };
    try {
      const url = `https://localhost:7200/api/category/update/${categoryID}`;
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success("category updated successfully");
        navigate("/categories");
      } else {
        message.error("Failed to update category");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while updating the category");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the Category Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter the Description" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Edit category
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCategoryForm;
