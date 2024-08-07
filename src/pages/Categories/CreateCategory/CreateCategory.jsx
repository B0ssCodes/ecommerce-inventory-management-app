import React from "react";
import { Typography } from "antd";
import CreateCategoryForm from "../../../components/forms/CreateCategoryForm";

const { Title } = Typography;

function CreateCategory() {
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Create a New Category</Title>
      <CreateCategoryForm />
    </div>
  );
}

export default CreateCategory;
