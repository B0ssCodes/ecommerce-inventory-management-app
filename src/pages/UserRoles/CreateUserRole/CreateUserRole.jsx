import React from "react";
import { Typography } from "antd";
import CreateUserRoleForm from "../../../components/forms/CreateUserRoleForm";

const { Title } = Typography;

function CreateUserRole() {
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Create a New User Role</Title>
      <CreateUserRoleForm />
    </div>
  );
}

export default CreateUserRole;
