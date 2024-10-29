import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./components.css";
import EditFormModal from "./EditFormModal";
import jsPDF from "jspdf";
import { Image, Button, Table, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, FileOutlined, DownloadOutlined } from "@ant-design/icons";

const FormsTab = () => {
  const [allForms, setAllForms] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [categories, setCategories] = useState({});
  const [formFields, setFormFields] = useState([]);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [formSubmissions, setFormSubmissions] = useState({});

  useEffect(() => {
    fetchAllForms();
    fetchCategories();
    fetchFormFields();
  }, []);

  const fetchAllForms = async () => {
    try {
      const response = await api.get("/api/forms");
      setAllForms(response.data);
    } catch (error) {
      console.error("Error fetching all forms:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");
      const categoryMap = {};
      response.data.forEach((category) => {
        categoryMap[category._id] = category.name;
      });
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFormFields = async () => {
    try {
      const response = await api.get("/api/forms");
      setFormFields(response.data);
    } catch (error) {
      console.error("Error fetching form fields:", error);
    }
  };

  const fetchFormSubmissions = async (formId) => {
    try {
      const response = await api.get(`/api/forms/${formId}/submissions`);
      setFormSubmissions(prevSubmissions => ({
        ...prevSubmissions,
        [formId]: response.data
      }));
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      setFormSubmissions(prevSubmissions => ({
        ...prevSubmissions,
        [formId]: []
      }));
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await api.delete(`/api/forms/${formId}`);
        setAllForms(allForms.filter((form) => form._id !== formId));
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  };

  const handleEdit = (form) => {
    setEditingForm(form);
  };

  const handleEditSubmit = async (updatedForm) => {
    try {
      const response = await api.put(
        `/api/forms/${updatedForm._id}`,
        updatedForm
      );
      setAllForms(
        allForms.map((form) =>
          form._id === updatedForm._id ? response.data : form
        )
      );
      setEditingForm(null);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const generatePDF = async (form) => {
    if (!form || !form.fields || form.fields.length === 0) {
      console.error("Form data is undefined or missing fields");
      return;
    }

    // Fetch submissions if not already fetched
    if (!formSubmissions[form._id]) {
      await fetchFormSubmissions(form._id);
    }

    const submissions = formSubmissions[form._id] || [];
    const latestSubmission = submissions.length > 0 ? submissions[0] : null;

    const doc = new jsPDF();

    // Add content to the PDF
    doc.text(form.title || "Untitled Form", 10, 10);

    let yPosition = 20;

    if (!latestSubmission) {
      doc.text("No submissions available for this form.", 10, yPosition);
    } else {
      form.fields.forEach((field) => {
        if (!field || !field.label || !field.type) {
          console.error(`Invalid field data`);
          return;
        }

        const fieldText = `${field.label}: `;
        doc.text(fieldText, 10, yPosition);

        const response = latestSubmission.responses.find(r => r.fieldId === field._id);
        const fieldValue = response ? response.value : "No answer provided";

        doc.text(
          fieldValue,
          10 + doc.getTextWidth(fieldText),
          yPosition
        );

        yPosition += 10;
      });
    }

    // Generate PDF blob and create URL
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setCurrentPdfUrl(pdfUrl);
    setPdfPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => categories[category] || category,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, form) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(form)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(form._id)}>
            Delete
          </Button>
          <Button icon={<FileOutlined />} onClick={() => generatePDF(form)}>
            View PDF
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="sended-forms-tab">
      <h3>All Forms</h3>
      <Table columns={columns} dataSource={allForms} rowKey="_id" />
      {editingForm && (
        <EditFormModal
          form={editingForm}
          onClose={() => setEditingForm(null)}
          onSubmit={handleEditSubmit}
        />
      )}
      <Modal
        title="PDF Preview"
        visible={pdfPreviewVisible}
        onCancel={() => setPdfPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPdfPreviewVisible(false)}>
            Close
          </Button>,
          <Button key="download" type="primary" href={currentPdfUrl} download="form.pdf">
            Download
          </Button>,
        ]}
        width={800}
      >
        <iframe src={currentPdfUrl} style={{ width: '100%', height: '500px' }} />
      </Modal>
    </div>
  );
};

export default FormsTab;
