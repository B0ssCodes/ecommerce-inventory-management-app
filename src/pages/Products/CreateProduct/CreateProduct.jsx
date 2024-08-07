import React from "react";
import { Typography } from "antd";
import CreateProductForm from "../../../components/forms/CreateProductForm";

const { Title } = Typography;

function CreateProduct() {
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Create a New Product</Title>
      <CreateProductForm />
    </div>
  );
}

export default CreateProduct;
