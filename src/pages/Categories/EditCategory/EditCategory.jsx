import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import EditCategoryForm from "../../../components/forms/EditCategoryForm";

const { Title } = Typography;
function EditCategory() {
  const location = useLocation();
  const { categoryID } = location.state;
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Edit Category</Title>
      <EditCategoryForm categoryID={categoryID} />
    </div>
  );
}

export default EditCategory;
