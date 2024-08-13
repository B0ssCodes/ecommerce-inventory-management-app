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
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import "./AllUserLogs.css"; // Import the CSS file

const { Title } = Typography;
const { Option } = Select;

function AllUserLogs() {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [itemCount, setItemCount] = useState(1);
  const [UserLogs, setUserLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchUserLogs = async (pageNumber, pageSize, searchText) => {
    const payload = {
      pageNumber,
      pageSize,
      search: searchText,
    };
    const url = `https://localhost:7200/api/userLog/get`;
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
        setUserLogs(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch user logs:", data);
        alert(data.message || "Failed to fetch user logs");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching user logs");
    }
  };

  useEffect(() => {
    fetchUserLogs(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

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

  const handleView = (userLogID) => {
    navigate("/view-user-log", { state: { logID: userLogID } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "logName",
      key: "logName",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record.logID)}
        ></Button>
      ),
    },
  ];

  const handleTableChange = (page, pageSize) => {
    setCurrentPage(page);
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
          User Logs
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
              placeholder="Search user logs..."
              style={{ marginRight: "8px", maxWidth: "80%" }}
            />
            {isLoading ? <Spin size="small" /> : null}
          </div>
        </div>
      </div>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table
          columns={columns}
          dataSource={UserLogs}
          rowKey="logID"
          bordered
          className="custom-table"
          pagination={false} // Disable built-in pagination
          onChange={handleTableChange}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={itemCount}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default AllUserLogs;
