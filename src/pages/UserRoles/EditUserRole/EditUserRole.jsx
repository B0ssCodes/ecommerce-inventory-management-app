import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import EditUserRoleForm from "../../../components/forms/EditUserRoleForm";

const { Title } = Typography;
function EditUserRole() {
  const location = useLocation();
  const { userRoleID } = location.state;
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Edit User Role</Title>
      <EditUserRoleForm userRoleID={userRoleID} />
    </div>
  );
}

export default EditUserRole;
