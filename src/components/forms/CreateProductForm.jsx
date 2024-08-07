import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

function CreateProductForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const url = "https://localhost:7200/api/category/get";
      const token = localStorage.getItem("token");
      const payload = {
        pageNumber: 1,
        pageSize: 200,
        search: "",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok) {
          setCategories(data.result);
        } else {
          console.error("Failed to fetch categories:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (values) => {
    const url = "https://localhost:7200/api/product/create";
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("SKU", values.SKU);
    formData.append("Name", values.Name);
    formData.append("Description", values.Description);
    formData.append("Price", values.Price);
    formData.append("Cost", values.Cost);
    formData.append("CategoryID", values.CategoryID);

    fileList.forEach((file) => {
      formData.append("Images", file.originFileObj);
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Product created successfully");
        navigate("/products");
      } else {
        const error = data.message || "An unknown error occurred";
        console.error("Failed to create product:", data);
        message.error(error);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Error creating product");
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div>
      <Form
        name="addProduct"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="SKU"
          name="SKU"
          rules={[{ required: true, message: "Please input the SKU!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Name"
          name="Name"
          rules={[{ required: true, message: "Please input the Name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="Description"
          rules={[{ required: true, message: "Please input the Description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Price"
          name="Price"
          rules={[{ required: true, message: "Please input the Price!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Cost"
          name="Cost"
          rules={[{ required: true, message: "Please input the Cost!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Category"
          name="CategoryID"
          rules={[{ required: true, message: "Please select a Category!" }]}
        >
          <Select
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryID}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Images"
          name="Images"
          rules={[{ required: true, message: "Please upload images!" }]}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateProductForm;
