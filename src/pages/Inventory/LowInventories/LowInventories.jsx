import React, { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  Typography,
  Table,
  Button,
  Space,
  Input,
  Select,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import "./LowInventories.css"; // Import the CSS file

const { Title } = Typography;
const { Option } = Select;

function LowInventories() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemCount, setItemCount] = useState(1);
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchInventories = async (payload) => {
    const minStockNumber = localStorage.getItem("minStockNumber");
    const url = `https://localhost:7200/api/inventory/getlow/${minStockNumber}`;
    const token = localStorage.getItem("token");
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
        setInventories(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch Inventories:", data);
        alert(data.message || "Failed to fetch Inventories");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching Inventories");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchInventories(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleTableChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setIsLoading(false);
    }, 1500),
    []
  );

  const handleSearchChange = (e) => {
    setIsLoading(true);
    debouncedSearch(e.target.value);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "SKU",
      dataIndex: "productSKU",
      key: "productSKU",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Cost",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (text) => `$${text}`,
    },
    {
      title: "Total Cost",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: "0.3em", lineHeight: "32px" }}>
          Low Stock Inventory
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div>
            <Input
              type="text"
              onChange={handleSearchChange}
              placeholder="Search Inventories..."
              style={{ marginRight: "8px", maxWidth: "80%" }}
            />
            {isLoading ? <Spin size="small" /> : null}
          </div>
          <Select
            defaultValue={10}
            style={{ width: 120 }}
            onChange={(value) => handleTableChange(1, value)}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>
        </div>
      </div>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table
          columns={columns}
          dataSource={inventories}
          rowKey="inventoryID"
          bordered
          className="custom-table"
          pagination={false} // Disable built-in pagination
          onChange={handleTableChange}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        >
          <Link to="/transactions" style={{ color: "white" }}>
            Create a transaction
          </Link>
        </Button>
        <Button
          type="default"
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          <Link to="/inventories" style={{ color: "white" }}>
            Inventories
          </Link>
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: "#f5222d",
            borderColor: "#f5222d",
            marginLeft: 16,
          }}
        >
          <Link to="/out-inventories" style={{ color: "white" }}>
            Out of Stock
          </Link>
        </Button>
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={itemCount}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default LowInventories;
