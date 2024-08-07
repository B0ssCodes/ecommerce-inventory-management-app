import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import EditProductForm from "../../../components/forms/EditProductForm";

const { Title } = Typography;
function EditProduct() {
  const location = useLocation();
  const { productID } = location.state;
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Edit Product</Title>
      <EditProductForm productID={productID} />
    </div>
  );
}

export default EditProduct;
