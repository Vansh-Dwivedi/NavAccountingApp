import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Input, Button, Select, Checkbox, DatePicker, Form, Card, Typography, Space } from "antd";

const { Title } = Typography;
const { Option } = Select;

const MakeFormTab = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [lastDate, setLastDate] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const addField = () => {
    setFormFields([
      ...formFields,
      {
        type: "text",
        label: "",
        required: false,
        options: [],
        signatureData: null,
      },
    ]);
  };

  const updateField = (index, field) => {
    const updatedFields = [...formFields];
    updatedFields[index] = field;
    setFormFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options.push("");
    setFormFields(updatedFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFormFields(updatedFields);
  };

  const saveForm = async () => {
    try {
      const response = await api.post("/api/forms/save", {
        title: formTitle,
        fields: formFields,
        isCompulsory,
        deadline: lastDate?.format('YYYY-MM-DD'),
        category,
      });
      alert("Form saved successfully");
      // Reset form after saving
      setFormFields([]);
      setFormTitle("");
      setIsCompulsory(false);
      setLastDate(null);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Error saving form. Please try again.");
    }
  };

  return (
    <Card style={{ margin: "2rem auto", maxWidth: 800 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Create New Form
      </Title>

      <Form layout="vertical">
        <Form.Item label="Form Title" required>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Enter form title"
          />
        </Form.Item>

        <Title level={3} style={{ marginBottom: "1rem" }}>
          Form Fields
        </Title>

        {formFields.map((field, index) => (
          <Card key={index} style={{ marginBottom: "1rem" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                value={field.label}
                onChange={(e) =>
                  updateField(index, { ...field, label: e.target.value })
                }
                placeholder="Field Label"
              />

              <Select
                value={field.type}
                onChange={(value) =>
                  updateField(index, { ...field, type: value })
                }
                style={{ width: "100%" }}
              >
                <Option value="text">Text</Option>
                <Option value="file">File</Option>
                <Option value="dropdown">Dropdown</Option>
                <Option value="digitalSignature">Digital Signature</Option>
              </Select>

              <Checkbox
                checked={field.required}
                onChange={(e) =>
                  updateField(index, { ...field, required: e.target.checked })
                }
              >
                Required
              </Checkbox>

              <Button danger onClick={() => removeField(index)}>
                Remove Field
              </Button>

              {field.type === "dropdown" && (
                <div>
                  <Title level={4}>Options:</Title>
                  {field.options.map((option, optionIndex) => (
                    <Input
                      key={optionIndex}
                      value={option}
                      onChange={(e) =>
                        updateOption(index, optionIndex, e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      style={{ marginBottom: "0.5rem" }}
                    />
                  ))}
                  <Button type="primary" onClick={() => addOption(index)}>
                    Add Option
                  </Button>
                </div>
              )}
            </Space>
          </Card>
        ))}

        <Button type="primary" onClick={addField} style={{ marginBottom: "1.5rem" }}>
          Add Field
        </Button>

        <Form.Item>
          <Checkbox
            checked={isCompulsory}
            onChange={(e) => setIsCompulsory(e.target.checked)}
          >
            Is Compulsory
          </Checkbox>
        </Form.Item>

        <Form.Item label="Last Date">
          <DatePicker
            value={lastDate}
            onChange={setLastDate}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Category" required>
          <Select
            value={category}
            onChange={setCategory}
            placeholder="Select a category"
          >
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" onClick={saveForm} block>
          Save Form
        </Button>
      </Form>
    </Card>
  );
};

export default MakeFormTab;
