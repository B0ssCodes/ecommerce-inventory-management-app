import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import EditUserForm from "../../../components/forms/EditUserForm";

const { Title } = Typography;
function EditUser() {
  const location = useLocation();
  const { userID } = location.state;
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Edit User</Title>
      <EditUserForm userID={userID} />
    </div>
  );
}

export default EditUser;
