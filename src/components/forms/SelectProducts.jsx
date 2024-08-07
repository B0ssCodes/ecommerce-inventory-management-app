import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Modal,
  Input,
  Button,
  Pagination,
  Typography,
  Tag,
} from "antd";

const { Title, Text } = Typography;

function SelectProducts({
  transactionItems,
  setTransactionItems,
  itemsToSubmit,
  setItemsToSubmit,
  transactionTypeID,
}) {
  const [products, setProducts] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async (payload) => {
      const url = "https://localhost:7200/api/product/getSelect";
      const token = localStorage.getItem("token");
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
        alert("Failed to fetch Products:", data.message);
      }
    };
    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
    };
    fetchData(payload);
  }, [pageNumber, pageSize, searchText]);

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (transactionTypeID == 2 && quantity > selectedProduct.quantity) {
      alert("Requested quantity is larger than the available quantity.");
      return;
    }

    if (selectedProduct && quantity > 0) {
      const newTransactionItem = {
        productID: selectedProduct.productID,
        productName: selectedProduct.name,
        productSKU: selectedProduct.sku,
        quantity: quantity,
        price: selectedProduct.cost * quantity,
      };

      const updatedTransactionItems = transactionItems.map((item) => {
        if (item.productID === newTransactionItem.productID) {
          return {
            ...item,
            quantity: item.quantity + newTransactionItem.quantity,
            price: item.price + newTransactionItem.price,
          };
        }
        return item;
      });

      const transactionItemExists = transactionItems.some(
        (item) => item.productID === newTransactionItem.productID
      );

      if (!transactionItemExists) {
        updatedTransactionItems.push(newTransactionItem);
      }

      setTransactionItems(updatedTransactionItems);

      const newItemToSubmit = {
        productID: selectedProduct.productID,
        quantity: quantity,
        price: selectedProduct.cost * quantity,
      };

      const updatedItemsToSubmit = itemsToSubmit.map((item) => {
        if (item.productID === newItemToSubmit.productID) {
          return {
            ...item,
            quantity: item.quantity + newItemToSubmit.quantity,
            price: item.price + newItemToSubmit.price,
          };
        }
        return item;
      });

      const itemExists = itemsToSubmit.some(
        (item) => item.productID === newItemToSubmit.productID
      );

      if (!itemExists) {
        updatedItemsToSubmit.push(newItemToSubmit);
      }

      setItemsToSubmit(updatedItemsToSubmit);
    }
    setIsModalVisible(false);
    setQuantity(0);
  };

  const handleSearchChange = (e) => {
    setPageNumber(1);
    setSearchText(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setQuantity(0);
  };

  return (
    <div>
      <Input
        placeholder="Search products"
        value={searchText}
        onChange={handleSearchChange}
        style={{ marginBottom: 16 }}
      />
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col span={8} key={product.productID}>
            <Card
              bordered={true}
              onClick={() => showModal(product)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <Tag
                color="blue"
                style={{ position: "absolute", top: 8, left: 8 }}
              >
                {product.category}
              </Tag>
              {product.quantity === 0 && (
                <Tag
                  color="red"
                  style={{ position: "absolute", top: 8, right: 8 }}
                >
                  Out Of Stock
                </Tag>
              )}
              <Title level={4} style={{ textAlign: "center", marginTop: 32 }}>
                {product.name}
              </Title>
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  display: "block",
                  textAlign: "center",
                  marginBottom: "1em",
                }}
              >
                ${product.cost}
              </Text>
              <Tag
                color="magenta"
                style={{ position: "absolute", bottom: 8, left: 8 }}
              >
                {product.sku}
              </Tag>
              <Tag
                color="green"
                style={{ position: "absolute", bottom: 8, right: 8 }}
              >
                {product.quantity}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={pageNumber}
        pageSize={pageSize}
        total={itemCount}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "center" }}
      />
      <Modal
        title="Enter Quantity"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
        />
      </Modal>
    </div>
  );
}

export default SelectProducts;
