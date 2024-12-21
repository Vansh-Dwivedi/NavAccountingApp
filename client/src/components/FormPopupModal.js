import React, { useState, useEffect } from "react";
import { FaTimes, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "./components.css";
import api from "../utils/api";
import DigitalSignature from "./DigitalSignatureField";
import { Form, Input, Select, Upload, Button, Space, Typography, message, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const FormPopupModal = ({ form, onClose, onSubmit, userId }) => {
  const [formValues, setFormValues] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
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
      message.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (values) => {
    // Merge form values with any values from controlled components
    const mergedValues = {
      ...values,
      ...formValues
    };

    // Check for required fields
    const emptyRequiredFields = form.fields.filter(field => 
      field.required && !mergedValues[field._id]
    );

    if (emptyRequiredFields.length > 0) {
      emptyRequiredFields.forEach(field => {
        message.error(`${field.label}: This field is required`);
      });
      return;
    }

    onSubmit(mergedValues);
  };

  const handleSignatureSelect = (fieldId, signatureData) => {
    handleInputChange(fieldId, signatureData);
    setShowSignatureModal(false);
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
            <Alert
              message="Compulsory Form"
              description={
                <Space direction="vertical">
                  <Text>This form is compulsory and must be completed.</Text>
                  <Text strong>
                    Last Date: {moment(form.deadline).format('MMMM Do YYYY, h:mm a')}
                  </Text>
                </Space>
              }
              type="error"
              showIcon
              icon={<FaExclamationTriangle />}
            />
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
              validateTrigger={['onChange', 'onBlur']}
            >
              {field.type === "text" && (
                <Input onChange={(e) => handleInputChange(field._id, e.target.value)} />
              )}
              {field.type === "file" && (
                <Upload
                  beforeUpload={() => false}
                  onChange={(info) => handleInputChange(field._id, info.file)}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              )}
              {field.type === "dropdown" && (
                <Select 
                  style={{ width: '100%' }}
                  onChange={(value) => handleInputChange(field._id, value)}
                >
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
            <Alert
              message="Category Information"
              description={
                <Text>
                  This form is regarding <strong>{categoryName}</strong>.
                </Text>
              }
              type="info"
              showIcon
              icon={<FaInfoCircle />}
            />
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
