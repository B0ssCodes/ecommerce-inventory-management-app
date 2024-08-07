import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Modal, Pagination, Input } from "antd";

function SelectVendor() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionTypeID, setTransactionTypeID] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTransactionTypeID(location.state.transactionTypeID);
  }, [location.state.transactionTypeID]);

  useEffect(() => {
    const fetchVendors = async (payload) => {
      console.log(payload.search);
      const url = "https://localhost:7200/api/vendor/get";
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
          setVendors(data.result);
          setItemCount(data.itemCount);
        } else {
          console.error("Failed to fetch vendors:", data);
          alert(data.message || "Failed to fetch vendors");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while fetching vendors");
      }
    };

    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
    };

    fetchVendors(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleSelectVendor = async (confirm) => {
    if (confirm) {
      const url = "https://localhost:7200/api/transaction/create";
      const token = localStorage.getItem("token");
      const payload = {
        transactionTypeID: parseInt(transactionTypeID),
        vendorID: parseInt(selectedVendor.vendorID),
      };

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
          navigate("/submit-transaction", {
            state: {
              transactionID: data.result,
              transactionTypeID: transactionTypeID,
            },
          });
        } else {
          console.error("Failed to create transaction:", data);
          alert(data.message || "Failed to create transaction");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while creating transaction");
      }
    }
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const handleSearch = (e) => {
    setPageNumber(1);
    setSearchText(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <Input
        type="text"
        onChange={handleSearch}
        placeholder="Search Vendors..."
        style={{ marginRight: "8px", maxWidth: "50%" }}
      />
      <Row gutter={[16, 16]}>
        {vendors.map((vendor) => (
          <Col span={8} key={vendor.vendorID}>
            <Card
              title={vendor.name}
              bordered={true}
              onClick={() => handleVendorClick(vendor)}
              style={{ cursor: "pointer" }}
            >
              <p>{vendor.email}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={pageNumber}
        pageSize={pageSize}
        total={itemCount}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={["10", "20", "50"]}
        style={{ marginTop: 16, textAlign: "center" }}
      />
      <Modal
        title="Select Vendor"
        open={isModalOpen}
        onOk={() => handleSelectVendor(true)}
        onCancel={() => handleSelectVendor(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you want to select this vendor?</p>
      </Modal>
    </div>
  );
}

export default SelectVendor;
