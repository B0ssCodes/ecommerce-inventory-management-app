import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Layout, Tag } from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;

const ViewCategory = () => {
  const { categoryID } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const url = `https://localhost:7200/api/category/getProducts/${categoryID}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setCategory(data.result);
        } else {
          console.error("Failed to fetch category:", data.message);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [categoryID]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <Content style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Category: {category.categoryName}
      </Title>
      <Row gutter={[16, 16]}>
        {category.products.map((product) => (
          <Col key={product.productID} xs={24} sm={24} md={12} lg={8}>
            <Card
              hoverable
              onClick={() => navigate(`/view-product/${product.productID}`)}
              style={{
                marginBottom: "16px",
                transition: "transform 0.3s",
                cursor: "pointer",
                position: "relative",
              }}
              bodyStyle={{ textAlign: "center" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Tag
                color="blue"
                style={{ position: "absolute", top: 8, left: 8 }}
              >
                {product.category}
              </Tag>
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
                ${product.cost}/${product.price}
              </Text>
              <Tag
                color="magenta"
                style={{ position: "absolute", bottom: 8, left: 8 }}
              >
                {product.sku}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default ViewCategory;
