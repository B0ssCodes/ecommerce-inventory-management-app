import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;
const { Content } = Layout;
let vendorFetchCount = localStorage.getItem("vendorFetchCount");

const VendorAnalytics = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      const vendorFetchCount = localStorage.getItem("vendorFetchCount");
      const url = `https://localhost:7200/api/analytics/getVendor/${vendorFetchCount}`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setVendors(data.result);
        } else {
          console.error("Failed to fetch vendors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const chartData = vendors.map((vendor) => ({
    name: vendor.vendorName,
    items: vendor.productsSold,
  }));

  return (
    <div>
      <Card
        style={{
          marginBottom: "20px",
        }}
      >
        <Row>
          <Col
            span={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <Title level={2}>Top Vendors</Title>
            <Text>
              Here are the top {vendorFetchCount} vendors with the most bought
              stock.
            </Text>
          </Col>
          <Col span={12}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="items" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card>
      <Row gutter={[16, 16]}>
        {vendors.map((vendor) => (
          <Col key={vendor.vendorID} xs={24} sm={24} md={12} lg={8}>
            <Card
              title={<Title level={3}>{vendor.vendorName}</Title>}
              style={{
                marginBottom: "16px",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              hoverable
              onClick={() =>
                navigate("/edit-vendor", {
                  state: { vendorID: vendor.vendorID },
                })
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Row>
                <Col span={24} style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: "1.5em" }}>
                    Quantity: {vendor.productsSold} items
                  </Text>
                </Col>
                <Col
                  span={24}
                  style={{ textAlign: "center", marginTop: "10px" }}
                >
                  <Text style={{ fontSize: "1.5em" }}>
                    Bought Items Cost: ${vendor.stockValue}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VendorAnalytics;
