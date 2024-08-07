import { Typography } from "antd";
import RegisterForm from "../components/forms/RegisterForm";

const { Title } = Typography;
const Register = () => {
  return (
    <div>
      <Title level={1} style={{ textAlign: "center" }}>
        Register
      </Title>
      <RegisterForm returnRoute={null} buttonText="Register" showLogin={true} />
    </div>
  );
};

export default Register;
