import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CheckOutlined,
  AppstoreOutlined,
  TransactionOutlined,
  ShopOutlined,
  TagsOutlined,
  UserOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  SettingOutlined,
  DotChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

const permissionsList = [
  { name: "Dashboard", icon: <HomeOutlined /> },
  { name: "Inventory", icon: <AppstoreOutlined /> },
  { name: "Transactions", icon: <TransactionOutlined /> },
  { name: "Products", icon: <ShopOutlined /> },
  { name: "Categories", icon: <TagsOutlined /> },
  { name: "Users", icon: <UserOutlined /> },
  { name: "User Roles", icon: <UsergroupAddOutlined /> },
  { name: "Vendors", icon: <SolutionOutlined /> },
  { name: "Configuration", icon: <SettingOutlined /> },
  { name: "Product Analytics", icon: <PieChartOutlined /> },
  { name: "Category Analytics", icon: <DotChartOutlined /> },
  { name: "Vendor Analytics", icon: <AreaChartOutlined /> },
  { name: "User Logs", icon: <AreaChartOutlined /> },
];

function CreateUserRoleForm() {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const navigate = useNavigate();

  const handlePermissionClick = (permission) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permission)
        ? prevSelected.filter((perm) => perm !== permission)
        : [...prevSelected, permission]
    );
  };

  const handleFormSubmit = async (values) => {
    const url = "https://localhost:7200/api/userRole/create";
    const token = localStorage.getItem("token");
    const payload = {
      roleName: values.roleName,
      permissions: selectedPermissions,
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
        message.success("User role added successfully");
        navigate("/user-roles");
      } else {
        const error = data.message || "An unknown error occurred";
        console.error("Failed to add Category:", error);
        message.error(error);
      }
    } catch (error) {
      console.error("Error adding user role:", error);
      message.error("Error adding user role");
    }
  };

  return (
    <div>
      <Form
        name="addUserRole"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Role Name"
          name="roleName"
          rules={[{ required: true, message: "Please input the Role Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Permissions">
          <Row gutter={[16, 16]}>
            {permissionsList.map((permission) => (
              <Col span={6} key={permission.name}>
                <Button
                  type={
                    selectedPermissions.includes(permission.name)
                      ? "primary"
                      : "default"
                  }
                  icon={
                    selectedPermissions.includes(permission.name) ? (
                      <CheckOutlined />
                    ) : (
                      permission.icon
                    )
                  }
                  onClick={() => handlePermissionClick(permission.name)}
                  size="large"
                  style={{ width: "100%" }} // Make the button take full width of the column
                >
                  {permission.name}
                </Button>
              </Col>
            ))}
          </Row>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Role
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateUserRoleForm;
