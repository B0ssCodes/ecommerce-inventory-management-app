import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import EditVendorForm from "../../../components/forms/EditVendorForm";

const { Title } = Typography;
function EditVendor() {
  const location = useLocation();
  const { vendorID } = location.state;
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Edit Vendor</Title>
      <EditVendorForm vendorID={vendorID} />
    </div>
  );
}

export default EditVendor;
