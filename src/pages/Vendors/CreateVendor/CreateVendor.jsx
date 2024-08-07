import React from "react";
import { Typography } from "antd";
import CreateVendorForm from "../../../components/forms/CreateVendorForm";

const { Title } = Typography;

function CreateVendor() {
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Add a New Vendor</Title>
      <CreateVendorForm />
    </div>
  );
}

export default CreateVendor;
