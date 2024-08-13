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
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import moment from "moment";
import "./AllTransactions.css";
import CreateTransactionButton from "../../../components/modals/CreateTransactionButton";
import { decodeToken } from "../../../components/utility/decodeToken";
import DeleteTransaction from "../../../components/modals/DeleteTransaction";

const { Title } = Typography;
const { Option } = Select;
function AllTransactions() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [claims, setClaims] = useState(null);
  const [passedEmail, setPassedEmail] = useState(null);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedClaims = decodeToken(token);
      setClaims(decodedClaims);
      const roleName = decodedClaims["RoleName"];
      const userEmail =
        decodedClaims[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      if (roleName === "Vendor" || roleName === "vendor") {
        setPassedEmail(userEmail);
      }
    }
  }, []);

  const fetchTransactions = async (payload) => {
    const url = "https://localhost:7200/api/transaction/get";
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendorEmail: passedEmail,
          paginationParams: payload,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch transactions:", data);
        alert(data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching transactions");
    }
  };

  useEffect(() => {
    if (claims) {
      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: searchText,
      };

      fetchTransactions(payload);
    }
  }, [pageNumber, pageSize, searchText, claims]);

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `$${text}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => {
        if (text === "inbound") {
          return <span style={{ color: "green" }}>Inbound</span>; // Green text for inbound
        } else if (text === "outbound") {
          return <span style={{ color: "red" }}>Outbound</span>; // Red text for outbound
        }
        return text;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => capitalizeFirstLetter(text),
    },
    {
      title: "Vendor",
      dataIndex: ["vendor", "name"],
      key: "vendor",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        record.status === "created" ? (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() =>
                navigate("/submit-transaction", {
                  state: {
                    transactionID: record.transactionID,
                    transactionTypeID: record.typeID,
                  },
                })
              }
            >
              Submit
            </Button>
            <DeleteTransaction transactionID={record.transactionID} />
          </Space>
        ) : (
          <Button
            type="primary"
            onClick={() =>
              navigate("/view-transaction", {
                state: { transactionID: record.transactionID },
              })
            }
          >
            <EyeOutlined />
          </Button>
        ),
    },
  ];

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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: "0.4em", lineHeight: "32px" }}>
          Transactions
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
              placeholder="Search Transactions..."
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
          dataSource={transactions}
          rowKey="transactionID"
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
        <CreateTransactionButton />
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

export default AllTransactions;
