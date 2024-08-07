import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const backendUrl = "https://localhost:7200";
const EditProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productID } = location.state || {};
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/product/get/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        // Prefix image URLs with backend URL
        const updatedImages = (data.result.images || []).map((image) => ({
          ...image,
          url: `${backendUrl}${image.url}`,
        }));

        form.setFieldsValue({ ...data.result, images: updatedImages });
        setFileList(updatedImages);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

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

    if (productID) {
      fetchProductDetails();
    }
    fetchCategories();
  }, [productID, form]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("SKU", values.sku);
    formData.append("Name", values.name);
    formData.append("Description", values.description);
    formData.append("Price", values.price);
    formData.append("Cost", values.cost);
    formData.append("CategoryID", values.categoryID);

    const fetchImageAsFile = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = url.split("/").pop(); // Extract file name from URL
      return new File([blob], fileName, { type: blob.type });
    };

    for (const file of fileList) {
      if (file.originFileObj) {
        formData.append("Images", file.originFileObj);
      } else if (file.url) {
        const imageFile = await fetchImageAsFile(file.url);
        formData.append("Images", imageFile);
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7200/api/product/update/${productID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Product updated successfully");
        navigate("/products");
      } else {
        message.error("Failed to update product");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while updating the product");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="sku"
        label="SKU"
        rules={[{ required: true, message: "Please enter the SKU" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Product Name"
        rules={[{ required: true, message: "Please enter the product name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter the description" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please enter the price" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="cost"
        label="Cost"
        rules={[{ required: true, message: "Please enter the cost" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="categoryID"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
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
      <Form.Item label="Images">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          {fileList.length >= 8 ? null : (
            <div>
              <UploadOutlined /> Upload
            </div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProductForm;
