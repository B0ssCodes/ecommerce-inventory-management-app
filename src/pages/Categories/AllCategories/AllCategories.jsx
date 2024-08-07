import React, { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  Typography,
  Table,
  Button,
  Space,
  Input,
  Spin,
  Select,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllCategories.css"; // Import the CSS file
import DeleteCategory from "../../../components/modals/DeleteCategory";

const { Title } = Typography;
const { Option } = Select;

function AllCategories() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemCount, setItemCount] = useState(1);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async (payload) => {
    const url = "https://localhost:7200/api/category/get";
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
        setCategories(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch Categories:", data);
        alert(data.message || "Failed to fetch Categories");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching Categories");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchCategories(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleEdit = (categoryID) => {
    navigate("/edit-category", { state: { categoryID } });
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
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.categoryID)}
          ></Button>
          <DeleteCategory categoryID={record.categoryID} />
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
          Categories
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
              placeholder="Search Categories..."
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
          dataSource={categories}
          rowKey="categoryID"
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
        <Button type="primary">
          <Link to="/create-category" style={{ color: "white" }}>
            Create Category
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

export default AllCategories;
