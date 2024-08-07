import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Input,
  Pagination,
  Select,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { EditOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import "./AllProducts.css"; // Import the CSS file
import DeleteProduct from "../../../components/modals/DeleteProduct";

const { Title } = Typography;
const { Option } = Select;
function AllProducts() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async (payload) => {
    const url = "https://localhost:7200/api/product/get";
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
        setProducts(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch products:", data);
        alert(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching products");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchProducts(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleView = (productID) => {
    navigate("/view-product/" + productID);
  };

  const handleEdit = (productID) => {
    navigate("/edit-product", { state: { productID } });
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (text) => `$${text}`,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Image Count",
      dataIndex: "imageCount",
      key: "imageCount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.productID)}
          ></Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.productID)}
          ></Button>
          <DeleteProduct productID={record.productID} />
        </Space>
      ),
    },
  ];

  const handleTableChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

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
          Products
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
              placeholder="Search Products..."
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
          dataSource={products}
          rowKey="productID"
          bordered
          className="custom-table"
          pagination={false}
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
        <Button type="primary">
          <Link to="/create-product" style={{ color: "white" }}>
            Create Product
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

export default AllProducts;
