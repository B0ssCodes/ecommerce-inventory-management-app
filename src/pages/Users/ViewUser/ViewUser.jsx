import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Typography, Row, Col } from "antd";

const { Title, Text } = Typography;

const ViewUser = () => {
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://localhost:7200/api/user/get/${userID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data.result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="center" style={{ marginTop: "50px" }}>
        <Col span={24}>
          <Title level={2}>{userData.firstName}'s Profile</Title>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>First Name:</Text>{" "}
                <Text>{userData.firstName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Last Name:</Text> <Text>{userData.lastName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Email:</Text> <Text>{userData.email}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Role:</Text> <Text>{userData.role}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewUser;
