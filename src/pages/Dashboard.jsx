// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { decodeToken } from "../components/utility/decodeToken";
import { Card, Typography, Row, Col, Button, Tag, Space } from "antd";

const { Title } = Typography;

function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outStockCount, setOutStockCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your actual JWT token
    const claims = decodeToken(token);
    console.log(claims); // Log the claims to inspect the structure
    if (
      claims &&
      claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    ) {
      setFirstName(
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );
    }

    const minStockNumber = localStorage.getItem("minStockNumber");

    const fetchLowStockCount = async () => {
      const response = await fetch(
        `https://localhost:7200/api/inventory/getlowCount/${minStockNumber}`
      );
      const data = await response.json();
      setLowStockCount(data.result);
    };

    const fetchOutStockCount = async () => {
      const response = await fetch(
        `https://localhost:7200/api/inventory/getoutCount`
      );
      const data = await response.json();
      setOutStockCount(data.result);
    };

    fetchLowStockCount();
    fetchOutStockCount();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Welcome, {firstName}</Title>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        {lowStockCount > 0 && (
          <Col span={12}>
            <Card title="Low Stock Inventories" bordered={true}>
              <Space direction="vertical" size="middle">
                <Tag color="orange" style={{ fontSize: "16px" }}>
                  Low Stock: {lowStockCount}
                </Tag>
                <Button type="primary" danger>
                  <Link to="/low-inventories">View Low Stock Inventory</Link>
                </Button>
              </Space>
            </Card>
          </Col>
        )}
        {outStockCount > 0 && (
          <Col span={12}>
            <Card title="Out of Stock Inventories" bordered={true}>
              <Space direction="vertical" size="middle">
                <Tag color="red" style={{ fontSize: "16px" }}>
                  Out of Stock: {outStockCount}
                </Tag>
                <Button type="primary" danger>
                  <Link to="/out-inventories">View Out of Stock Inventory</Link>
                </Button>
              </Space>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default Dashboard;
