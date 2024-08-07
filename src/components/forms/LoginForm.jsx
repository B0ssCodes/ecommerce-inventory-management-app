import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
    const url = "https://localhost:7200/api/auth/login";
    const payload = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);

      // Store JWT token and expiry in localStorage
      const token = data.result.token;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // Set expiry to 7 days from now

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", expiryDate.toISOString());
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto", padding: "50px" }}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginForm;
