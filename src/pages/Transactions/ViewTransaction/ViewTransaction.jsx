import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Typography, Table, Row, Col, Card, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import "./ViewTransaction.css";
const { Header, Content } = Layout;
const { Title, Text } = Typography;

function ViewTransaction() {
  const location = useLocation();
  const [transactionID, setTransactionID] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const componentRef = useRef();
  useEffect(() => {
    setTransactionID(location.state.transactionID);
  }, [location.state.transactionID]);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      const url = `https://localhost:7200/api/transaction/get/${transactionID}`;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTransactionDetails(data.result);
        } else {
          console.error("Failed to fetch transaction details:", data);
          alert(data.message || "Failed to fetch transaction details");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while fetching transaction details");
      }
    };
    if (transactionID) {
      fetchTransactionDetails();
    }
  }, [transactionID]);

  if (!transactionDetails) {
    return <div>Loading...</div>;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const columns = [
    {
      title: "Product SKU",
      dataIndex: ["product", "sku"],
      key: "sku",
    },
    {
      title: "Product Name",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", padding: "24px" }}>
      <Header style={{ background: "transparent", padding: 0 }}>
        <Title level={2}>Invoice</Title>
      </Header>
      <Content style={{ margin: "24px 16px 0" }}>
        <Row justify="end" style={{ marginBottom: "16px" }}>
          <Col>
            <ReactToPrint
              trigger={() => (
                <Button type="primary">
                  <PrinterOutlined />
                  Print Invoice
                </Button>
              )}
              content={() => componentRef.current}
            />
          </Col>
        </Row>
        <Card ref={componentRef}>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4}>
                Transaction ID: {transactionDetails.transactionID}
              </Title>
              <Text>
                Type:{" "}
                {capitalizeFirstLetter(transactionDetails.transactionType)}
              </Text>
              <br />
              <Text>
                Status:{" "}
                {capitalizeFirstLetter(transactionDetails.transactionStatus)}
              </Text>
              <br />
              <Text>
                Date: {new Date(transactionDetails.date).toLocaleDateString()}
              </Text>
            </Col>
            <Col span={12}>
              <Title level={4}>Vendor Details</Title>
              <Text>Name: {transactionDetails.vendor.name}</Text>
              <br />
              <Text>Email: {transactionDetails.vendor.email}</Text>
              <br />
              <Text>Phone: {transactionDetails.vendor.phone}</Text>
              <br />
              <Text>
                Commercial Phone: {transactionDetails.vendor.commercialPhone}
              </Text>
              <br />
              <Text>Address: {transactionDetails.vendor.address}</Text>
            </Col>
          </Row>
          <Table
            style={{ marginTop: "24px" }}
            dataSource={transactionDetails.transactionItems}
            columns={columns}
            pagination={false}
            rowKey="transactionItemID"
          />
          <Row justify="end" style={{ marginTop: "24px" }}>
            <Col>
              <Title level={4}>
                Total Amount: ${transactionDetails.amount}
              </Title>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
}

export default ViewTransaction;
