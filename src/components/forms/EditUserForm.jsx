import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const EditUserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = location.state || {};
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://localhost:7200/api/user/get/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        form.setFieldsValue(data.result);
      } catch (error) {
        console.error("Failed to fetch User details:", error);
      }
    };

    const fetchRoles = async () => {
      const url = "https://localhost:7200/api/userRole/get";
      const token = localStorage.getItem("token");
      const payload = {
        pageNumber: 1,
        pageSize: 200,
        search: "",
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
          setRoles(data.result);
        } else {
          console.error("Failed to fetch roles:", data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (userID) {
      fetchUserDetails();
    }
    fetchRoles();
  }, [userID, form]);

  const handleSubmit = async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      userRoleID: values.userRoleID,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7200/api/user/update/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("User updated successfully");
        navigate("/users");
      } else {
        console.error("Failed to update user:", data);
        message.error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while updating user");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter the email" }]}
      >
        <Input disabled={true} />
      </Form.Item>
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "Please enter the first name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Please enter the description" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="userRoleID"
        label="Role"
        rules={[{ required: true, message: "Please select a role" }]}
      >
        <Select
          showSearch
          placeholder="Select a role"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {roles.map((role) => (
            <Option key={role.userRoleID} value={role.userRoleID}>
              {role.role}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update User
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditUserForm;
