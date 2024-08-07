import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Typography,
  Descriptions,
  Carousel,
  Image,
  message,
  Modal,
  QRCode,
} from "antd";

const { Title } = Typography;
const backendUrl = "https://localhost:7200";

const ViewProduct = () => {
  const { productID } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/product/get/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setProduct(data.result);
        } else {
          message.error(data.message || "Failed to fetch product details");
        }
      } catch (error) {
        message.error("An error occurred while fetching product details");
      }
    };

    fetchProduct();
  }, [productID]);

  const handleTitleClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const currentUrl = `${window.location.origin}${location.pathname}`;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Title
          level={2}
          style={{ margin: 0, cursor: "pointer" }}
          onClick={handleTitleClick}
        >
          {product.name}
        </Title>
        <Descriptions
          bordered
          column={1}
          size="small"
          style={{ flex: 1, marginLeft: "20px" }}
        >
          <Descriptions.Item label="Description">
            {product.description}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
        <Descriptions.Item label="Price">${product.price}</Descriptions.Item>
        <Descriptions.Item label="Cost">${product.cost}</Descriptions.Item>
        <Descriptions.Item label="Category">
          {product.category.name}
        </Descriptions.Item>
      </Descriptions>
      <Title level={4} style={{ marginTop: "20px", textAlign: "center" }}>
        Images
      </Title>
      <Carousel
        autoplay
        style={{ width: "500px", height: "300px", margin: "0 auto" }}
      >
        {product.images.map((image) => (
          <div key={image.imageID}>
            <Image
              src={`${backendUrl}${image.url}`}
              alt={`Product Image ${image.imageID}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </Carousel>
      <Modal
        title="QR Code"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <QRCode value={currentUrl} size={256} />
      </Modal>
    </div>
  );
};

export default ViewProduct;
