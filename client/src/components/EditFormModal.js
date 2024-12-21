import React, { useState } from 'react';
import './components.css';
import { Modal, Form, Input, Select, Switch, Button, Space, Divider } from 'antd';

const EditFormModal = ({ form, onClose, onSubmit }) => {
  const [editedForm, setEditedForm] = useState(form);
  const [formInstance] = Form.useForm();

  const handleChange = (name, value) => {
    setEditedForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleFieldChange = (index, name, value) => {
    const updatedFields = [...editedForm.fields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: updatedFields
    }));
  };

  const addField = () => {
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: [...prevForm.fields, { type: 'text', label: '', required: false, options: [] }]
    }));
  };

  const removeField = (index) => {
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: prevForm.fields.filter((_, i) => i !== index)
    }));
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...editedForm.fields];
    updatedFields[fieldIndex].options.push('');
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: updatedFields
    }));
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...editedForm.fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: updatedFields
    }));
  };

  const handleSubmit = () => {
    onSubmit(editedForm);
  };

  return (
    <Modal
      title="Edit Form"
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={formInstance}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={editedForm}
      >
        <Form.Item
          label="Form Title"
          name="title"
          rules={[{ required: true, message: 'Please input form title!' }]}
        >
          <Input 
            value={editedForm.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </Form.Item>

        <Divider>Form Fields</Divider>

        {editedForm.fields.map((field, index) => (
          <div key={index} style={{ marginBottom: 24, padding: 24, border: '1px solid #f0f0f0', borderRadius: 4 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                label="Field Label"
                required
              >
                <Input
                  value={field.label}
                  onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                  placeholder="Field Label"
                />
              </Form.Item>

              <Form.Item label="Field Type">
                <Select
                  value={field.type}
                  onChange={(value) => handleFieldChange(index, 'type', value)}
                  style={{ width: 200 }}
                >
                  <Select.Option value="text">Text</Select.Option>
                  <Select.Option value="file">File</Select.Option>
                  <Select.Option value="dropdown">Dropdown</Select.Option>
                  <Select.Option value="digitalSignature">Digital Signature</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Required">
                <Switch
                  checked={field.required}
                  onChange={(checked) => handleFieldChange(index, 'required', checked)}
                />
              </Form.Item>

              {field.type === 'dropdown' && (
                <div className="dropdown-options">
                  <h4>Options:</h4>
                  {field.options.map((option, optionIndex) => (
                    <Form.Item key={optionIndex}>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </Form.Item>
                  ))}
                  <Button type="dashed" onClick={() => addOption(index)} block>
                    Add Option
                  </Button>
                </div>
              )}

              <Button danger onClick={() => removeField(index)}>
                Remove Field
              </Button>
            </Space>
          </div>
        ))}

        <Form.Item>
          <Button type="dashed" onClick={addField} block>
            Add Field
          </Button>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFormModal;