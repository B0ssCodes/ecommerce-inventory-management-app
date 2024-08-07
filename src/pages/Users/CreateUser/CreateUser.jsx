import React from "react";
import { Typography } from "antd";
import RegisterForm from "../../../components/forms/RegisterForm";

const { Title } = Typography;

function CreateUser() {
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Create a New User</Title>
      <RegisterForm
        returnRoute={"/users"}
        buttonText="Add User"
        showLogin={false}
      />
    </div>
  );
}

export default CreateUser;
