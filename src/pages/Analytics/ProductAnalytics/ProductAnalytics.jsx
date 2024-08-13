import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Tag, Typography, Button } from "antd";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";
const ProductAnalytics = () => {
  const [productAnalytics, setProductAnalytics] = useState([]);
  const navigate = useNavigate();
  const { Text, Title } = Typography;

  useEffect(() => {
    const statisticsRefreshRate = localStorage.getItem("statisticsRefreshRate");
    const fetchProductAnalytics = async () => {
      const url = `https://localhost:7200/api/analytics/getProduct/${statisticsRefreshRate}`;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProductAnalytics(data.result);
        } else {
          console.error("Failed to fetch product analytics:", data);
          alert(data.message || "Failed to fetch product analytics");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while fetching product analytics");
      }
    };

    fetchProductAnalytics();
  }, []);

  const handleRefreshStatistics = async () => {
    const url = "https://localhost:7200/api/analytics/resetProduct";
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to refresh statistics:", data);
        alert(data.message || "Failed to refresh statistics");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while refreshing statistics");
    }
  };

  const totalProfit = productAnalytics.reduce(
    (acc, product) => acc + product.profit,
    0
  );

  const totalSold = productAnalytics.reduce(
    (acc, product) => acc + product.unitsSold,
    0
  );

  const totalEarned = productAnalytics.reduce(
    (acc, product) => acc + product.moneyEarned,
    0
  );

  const totalSpent = productAnalytics.reduce(
    (acc, product) => acc + product.moneySpent,
    0
  );

  const totalProfitColor =
    totalProfit > 0 ? "green" : totalProfit < 0 ? "red" : "gray";

  const handleCardClick = (productID) => {
    navigate("/view-product/" + productID);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card
            title="Weekly Analytics Result"
            style={{ width: "100%" }}
            bodyStyle={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Title level={5}>Analytics Period</Title>
              {productAnalytics.length > 0 && (
                <>
                  <Text>
                    From:{" "}
                    {moment(productAnalytics[0].fromDate).format(
                      "D/M/Y H:mm:ss"
                    )}
                  </Text>
                  <Text>
                    To:{" "}
                    {moment(productAnalytics[0].toDate).format("D/M/Y H:mm:ss")}
                  </Text>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{ color: "green", fontSize: "24px", fontWeight: "bold" }}
              >
                Total Earned: ${totalEarned}
              </Text>
              <Text
                style={{ color: "red", fontSize: "24px", fontWeight: "bold" }}
              >
                Total Spent: ${totalSpent}
              </Text>
              <Button
                type="primary"
                onClick={handleRefreshStatistics}
                style={{ marginTop: "10px" }}
              >
                Refresh Statistics
              </Button>
            </div>
            <div style={{ width: "150px" }}>
              <CircularProgressbar
                value={totalEarned}
                maxValue={totalEarned + totalSpent}
                text={`$${totalProfit}`}
                styles={buildStyles({
                  textColor: totalProfitColor,
                  pathColor: "green",
                  trailColor: "red",
                })}
                animate={true}
              />
            </div>
          </Card>
        </Col>
        {productAnalytics.map((product) => {
          const {
            productID,
            productName,
            productSKU,
            moneySpent,
            moneyEarned,
            profit,
            unitsBought,
            unitsSold,
          } = product;
          const totalMoney = moneySpent + moneyEarned;
          const spentPercentage = totalMoney
            ? (moneySpent / totalMoney) * 100
            : 0;
          const earnedPercentage = totalMoney
            ? (moneyEarned / totalMoney) * 100
            : 0;

          const profitColor =
            profit > 0 ? "green" : profit < 0 ? "red" : "gray";
          const circleColor = unitsSold > 0 ? "green" : "gray";
          const trailColor = unitsBought > 0 ? "red" : "gray";
          const displayProfit =
            unitsBought === 0 && unitsSold === 0 ? "N/A" : `$${profit}`;

          return (
            <Col key={productID} xs={24} sm={24} md={12} lg={8}>
              <Card
                title={productName}
                extra={<Tag>{productSKU}</Tag>}
                onClick={() => handleCardClick(productID)}
                hoverable
                style={{ transition: "transform 0.3s", cursor: "pointer" }}
                bodyStyle={{ transition: "transform 0.3s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ width: "100px", margin: "0 auto" }}>
                  <CircularProgressbar
                    value={earnedPercentage}
                    text={displayProfit}
                    styles={buildStyles({
                      textColor: profitColor,
                      pathColor: circleColor,
                      trailColor: trailColor,
                    })}
                    animate={true}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <div style={{ color: "green" }}>Earned: ${moneyEarned}</div>
                  <div style={{ color: "red" }}>Spent: ${moneySpent}</div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ProductAnalytics;
