import React, { useState, useEffect } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import "./components.css";
import api from "../utils/api";
import DigitalSignature from "./DigitalSignatureField";
import { Form, Input, Select, Upload, Button, Space, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const FormPopupModal = ({ form, onClose, onSubmit, userId }) => {
  const [formValues, setFormValues] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [errors, setErrors] = useState({});
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);

  useEffect(() => {
    console.log("FormPopupModal received form:", form);
    fetchCategoryName();

    return () => clearInterval(timeLeft);
  }, [form]);

  const fetchCategoryName = async () => {
    try {
      const response = await api.get("/api/categories");
      const categories = response.data;
      const category = categories.find((cat) => cat._id === form.category);
      if (category) {
        setCategoryName(category.name);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
    if (errors[fieldId]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldId]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    form.fields.forEach((field) => {
      if (field.required) {
        if (field.type === "digitalSignature") {
          if (!formValues[field._id] || formValues[field._id] === "") {
            newErrors[field._id] = "This field is required";
          }
        } else if (!formValues[field._id] || formValues[field._id] === "") {
          newErrors[field._id] = "This field is required";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (values) => {
    if (validateForm()) {
      onSubmit(values);
    } else {
      console.log("Form validation failed");
    }
  };

  const handleSignatureSelect = (fieldId, signatureData) => {
    handleInputChange(fieldId, signatureData);
    setShowSignatureModal(false);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const updateField = (fieldId, value) => {
    setFormValues({ ...formValues, [fieldId]: value });
  };

  if (!form) {
    console.log("Form is null or undefined");
    return <div>Loading form...</div>;
  }

  console.log("Form fields:", form.fields);

  if (!form.fields || !Array.isArray(form.fields)) {
    console.log("Form fields is not an array or is undefined");
    return <div>Error: Form structure is invalid</div>;
  }

  return (
    <div className="form-popup-modal">
      <div className="form-popup-content">
        <Button icon={<FaTimes />} onClick={onClose} className="close-button" />
        <Title level={2}>{form.title || "Untitled Form"}</Title>
        {form.isCompulsory && (
          <Space direction="vertical" className="compulsory-warning-container">
            <Space className="compulsory-warning">
              <FaExclamationTriangle className="warning-icon" />
              <Text>This form is compulsory, the deadline is:</Text>
            </Space>
            <Text className="countdown">{form.deadline} days</Text>
          </Space>
        )}
        <Form onFinish={handleSubmit} layout="vertical">
          {form.fields.map((field) => (
            <Form.Item
              key={field._id}
              name={field._id}
              label={
                <Space>
                  <span>{field.label}</span>
                  {field.required && <span style={{ color: 'red' }}>*</span>}
                </Space>
              }
              rules={[{ required: field.required, message: 'This field is required' }]}
            >
              {field.type === "text" && (
                <Input />
              )}
              {field.type === "file" && (
                <Upload
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              )}
              {field.type === "dropdown" && (
                <Select style={{ width: '100%' }}>
                  <Option value="">Select an option</Option>
                  {field.options &&
                    field.options.map((option, index) => (
                      <Option key={index} value={option}>
                        {option}
                      </Option>
                    ))}
                </Select>
              )}
              {field.type === "digitalSignature" && (
                <DigitalSignature
                  required={field.required}
                  onChange={(signature) =>
                    handleInputChange(field._id, signature)
                  }
                  userId={userId}
                  field={field}
                  index={field._id}
                  updateField={updateField}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Space direction="vertical" className="category-warning">
              <FaExclamationTriangle className="warning-icon" />
              <Text>
                This form is regarding <strong>{categoryName}</strong>.
              </Text>
            </Space>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Submit Form
            </Button>
          </Form.Item>
        </Form>
      </div>
      {showSignatureModal && (
        <div className="signature-modal">
          <h3>Select a Signature</h3>
          <div className="signature-list">
            {savedSignatures.map((sig) => (
              <div
                key={sig._id}
                className="signature-item"
                onClick={() => handleSignatureSelect(field._id, sig.data)}
              >
                <p>{sig.name}</p>
                <img
                  src={sig.data}
                  alt={sig.name}
                  className="signature-preview"
                />
              </div>
            ))}
          </div>
          <button onClick={() => setShowSignatureModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default FormPopupModal;
