import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const EditVendorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorID } = location.state || {};
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://localhost:7200/api/vendor/get/${vendorID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        form.setFieldsValue(data.result);
      } catch (error) {
        console.error("Failed to fetch vendor details:", error);
      }
    };

    if (vendorID) {
      fetchVendorDetails();
    }
  }, [vendorID, form]);

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      commercialPhone: values.commercialPhone,
      address: values.address,
    };
    try {
      const response = await fetch(
        `https://localhost:7200/api/vendor/update/${vendorID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        message.success("Vendor updated successfully");
        navigate("/vendors");
      } else {
        message.error("Failed to update vendor");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while updating the vendor");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the Vendor Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter the Email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Numhber"
        rules={[{ required: true, message: "Please enter the Phone Number" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="commercialPhone"
        label="Commercial Phone Number"
        rules={[
          {
            required: true,
            message: "Please enter the Commercial Phone Number",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please enter the address" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Edit Vendor
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditVendorForm;
