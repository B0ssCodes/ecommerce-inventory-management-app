import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Typography, Spin, Button } from "antd";

const { Title } = Typography;

const ViewUserLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logID } = location.state;
  const [logData, setLogData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://localhost:7200/api/userLog/get/${logID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setLogData(data.result);
        } else {
          console.error("Failed to fetch log data:", data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogData();
  }, [logID]);

  const renderJsonTable = (jsonData) => {
    const columns = [
      {
        title: "Key",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
      },
    ];

    const dataSource = Object.entries(jsonData).map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
    }));

    return (
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    );
  };

  const handleViewUser = () => {
    navigate(`/view-user/${logData.userID}`);
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (!logData) {
    return <div>No log data available</div>;
  }

  return (
    <div>
      <Title className="site-page-header">{logData.logName}</Title>
      <Button
        type="primary"
        onClick={handleViewUser}
        style={{ marginBottom: 16 }}
      >
        View User
      </Button>
      <Title level={4}>User ID: {logData.userID}</Title>
      <Title level={4}>Model: {logData.model}</Title>
      <Title level={4}>Action: {logData.action}</Title>
      <Title level={4}>Before State:</Title>
      {renderJsonTable(logData.beforeState)}
      <Title level={4}>After State:</Title>
      {renderJsonTable(logData.afterState)}
    </div>
  );
};

export default ViewUserLog;
