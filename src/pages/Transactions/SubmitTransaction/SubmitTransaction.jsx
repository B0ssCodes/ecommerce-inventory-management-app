import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Typography,
  Card,
  Dropdown,
  Button,
  message,
} from "antd";
import { DownOutlined, DeleteOutlined } from "@ant-design/icons";
import SelectProducts from "../../../components/forms/SelectProducts";

const { Header, Content } = Layout;
const { Title } = Typography;

function SubmitTransaction() {
  const location = useLocation();
  const navigate = useNavigate();

  const [transactionID, setTransactionID] = useState(null);
  const [transactionTypeID, setTransactionTypeID] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [itemsToSubmit, setItemsToSubmit] = useState([]);

  useEffect(() => {
    setTransactionID(location.state.transactionID);
    setTransactionTypeID(location.state.transactionTypeID);
  }, [location.state.transactionID, location.state.transactionTypeID]);

  useEffect(() => {
    console.log("Transaction Items:", transactionItems);
  }, [transactionItems]);

  const handleDelete = (index) => {
    setTransactionItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleTransactionSubmit = async () => {
    if (transactionItems.length === 0) {
      alert("Please add items to the transaction before submitting");
      return;
    }
    const url = "https://localhost:7200/api/transaction/submit";
    const token = localStorage.getItem("token");
    const payload = {
      transactionID: transactionID,
      amount: itemsToSubmit.reduce((acc, item) => acc + item.price, 0),
      transactionItems: itemsToSubmit,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const error = data.message;
    if (response.ok) {
      message.success("Transaction submitted successfully");
      navigate("/transactions");
    } else {
      alert("Failed to submit transaction:", error);
    }
  };

  const itemCount = transactionItems.length;

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Transaction Items">
        {transactionItems.map((item, index) => (
          <Menu.Item key={index}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.productName}</strong> ({item.productSKU})<br />
                Quantity: {item.quantity}
                <br />
                Price: ${item.price}
              </div>
              <DeleteOutlined
                onClick={() => handleDelete(index)}
                style={{ color: "red", cursor: "pointer" }}
              />
            </div>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 24px",
          backgroundColor: "transparent",
        }}
      >
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="primary">
            Transaction Items {itemCount > 0 && `(${itemCount})`}{" "}
            <DownOutlined />
          </Button>
        </Dropdown>

        <Button onClick={handleTransactionSubmit}>Submit Transaction</Button>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Card>
          <SelectProducts
            transactionItems={transactionItems}
            setTransactionItems={setTransactionItems}
            itemsToSubmit={itemsToSubmit}
            setItemsToSubmit={setItemsToSubmit}
            transactionTypeID={transactionTypeID}
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default SubmitTransaction;
