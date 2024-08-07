import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Typography } from "antd";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
const { Title } = Typography;
const { Option } = Select;

const dateFormatList = ["YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"];

function RegisterForm({ returnRoute, buttonText, showLogin }) {
  const [userRoles, setUserRoles] = useState([]);
  const [birthDate, setBirthDate] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserRoles = async () => {
      const token = localStorage.getItem("token");
      const payload = {
        pageNumber: 1,
        pageSize: 100,
        search: "",
      };
      try {
        const response = await fetch(
          "https://localhost:7200/api/userRole/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        setUserRoles(data.result);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };

    fetchUserRoles();
  }, []);

  const onFinish = async (values) => {
    const formattedDate = birthDate ? birthDate.format("YYYY-MM-DD") : null;
    const formattedValues = {
      ...values,
      Birthday: formattedDate,
      UserRoleID: parseInt(values.userRole),
    };

    try {
      const response = await fetch("https://localhost:7200/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
      } else {
        const data = await response.json();
        console.log("Response: ", data);
        if (returnRoute) {
          navigate(returnRoute);
        } else {
          navigate("/login", {
            state: {
              successMessage: "Registration successful! Please log in.",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const onDateChange = (date, dateString) => {
    const parsedDate = dayjs(dateString, dateFormatList, true);
    setBirthDate(parsedDate.isValid() ? parsedDate : null);
  };

  return (
    <div>
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Birth Date"
          name="birthDate"
          rules={[{ required: true, message: "Please input your birth date!" }]}
        >
          <DatePicker onChange={onDateChange} />
        </Form.Item>
        <Form.Item
          label="User Role"
          name="userRole"
          rules={[{ required: true, message: "Please select your user role!" }]}
        >
          <Select
            showSearch
            placeholder="Select a role"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {userRoles.map((roleObj) => (
              <Option key={roleObj.userRoleID} value={roleObj.userRoleID}>
                {roleObj.role}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {buttonText}
          </Button>
        </Form.Item>
        {showLogin && (
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </Form>
    </div>
  );
}

export default RegisterForm;
