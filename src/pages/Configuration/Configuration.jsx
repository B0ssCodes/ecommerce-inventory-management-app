import React, { useState, useEffect } from "react";
import { Input, Button, Form, message, Row, Col, Divider } from "antd";

function Configuration() {
  const [minStockNumber, setMinStockNumber] = useState("");
  const [statisticsRefreshRate, setStatisticsRefreshRate] = useState("");

  const handleSave = () => {
    localStorage.setItem("minStockNumber", minStockNumber);
    localStorage.setItem("statisticsRefreshRate", statisticsRefreshRate);
    message.success("Changes saved successfully");
  };

  useEffect(() => {
    const savedMinStockNumber = localStorage.getItem("minStockNumber");
    if (savedMinStockNumber) {
      setMinStockNumber(savedMinStockNumber);
    }

    const savedStatisticsRefreshRate = localStorage.getItem(
      "statisticsRefreshRate"
    );
    if (savedStatisticsRefreshRate) {
      setStatisticsRefreshRate(savedStatisticsRefreshRate);
    }
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Form layout="vertical">
        <Form.Item>
          <Row align="middle">
            <Col span={12}>
              <label style={{ fontSize: "18px", fontWeight: "bold" }}>
                Low Stock Alert
              </label>
            </Col>
            <Col span={12}>
              <Input
                placeholder="Enter a minimum stock alert"
                value={minStockNumber}
                onChange={(e) => setMinStockNumber(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Item>
        <Divider />
        <Form.Item>
          <Row align="middle">
            <Col span={12}>
              <label style={{ fontSize: "18px", fontWeight: "bold" }}>
                Statistics Refresh Rate (days)
              </label>
            </Col>
            <Col span={12}>
              <Input
                placeholder="Enter a refresh rate"
                value={statisticsRefreshRate}
                onChange={(e) => setStatisticsRefreshRate(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Configuration;
