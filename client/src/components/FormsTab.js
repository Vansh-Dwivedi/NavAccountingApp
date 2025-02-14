import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./components.css";
import EditFormModal from "./EditFormModal";
import "jspdf-autotable"; // For auto-formatted tables
import pdfMake from "pdfmake/build/pdfmake"; // Professional PDF library
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Button, Table, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, FileOutlined } from "@ant-design/icons";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

// Add this helper function to convert image URL to base64
const getBase64Image = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

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

  const fetchFormSubmissions = async (formId) => {
    if (!formId) {
      console.warn('No form ID provided to fetchFormSubmissions');
      return [];
    }

    try {
      console.log('Fetching submissions for form:', formId);
      const response = await api.get(`/api/forms/${formId}/submissions`);
      console.log('Received submissions:', response.data);
      
      setFormSubmissions(prevSubmissions => {
        const newSubmissions = {
          ...prevSubmissions,
          [formId]: response.data
        };
        console.log('Updated submissions state:', newSubmissions);
        return newSubmissions;
        
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      setFormSubmissions(prevSubmissions => ({
        ...prevSubmissions,
        [formId]: []
      }));
      return [];
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

    try {
      // First fetch - wait for the data and state update
      const firstFetchData = await fetchFormSubmissions(form._id);
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Second fetch - wait for the data
      const submissions = await fetchFormSubmissions(form._id);

      // Get the logo as base64
      const logoUrl = process.env.REACT_APP_API_URL + "/uploads/full-white-app-logo.svg";
      const logoBase64 = await getBase64Image(logoUrl);

      // Use the directly returned submissions data instead of accessing state
      const submissionContent = submissions
        .map((submission, index) => [
          // Submission header
          {
            text: `Submission ${index + 1}`,
            style: "subheader",
            margin: [0, 15, 0, 5],
          },
          // Submission details
          {
            text: `Submitted by: ${submission.user?.username || "Unknown User"}`,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Submitted on: ${new Date(
              submission.submittedAt
            ).toLocaleString()}`,
            margin: [0, 0, 0, 10],
          },
          // Responses
          ...submission.responses.map((response) => ({
            columns: [
              {
                text: `${response.fieldLabel}:`,
                width: "30%",
                bold: true,
              },
              {
                ...(response.type === "digitalSignature" 
                  ? {
                      image: response.value ? JSON.parse(response.value).value : '',
                      width: 100,
                      height: 50,
                    }
                  : {
                      text: response.value || "No answer provided",
                      width: "70%",
                    }
                ),
              },
            ],
            margin: [0, 5, 0, 5],
          })),
          // Separator
          index < submissions.length - 1
            ? {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 5,
                    x2: 515,
                    y2: 5,
                    lineWidth: 1,
                    lineColor: "#CCCCCC",
                  },
                ],
              }
            : {},
        ])
        .flat();

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 120, 40, 60],
        header: {
          margin: [0, 0, 0, 20],
          fillColor: "#f8f9fa",
          table: {
            widths: ["*"],
            body: [
              [
                {
                  columns: [
                    {
                      // Logo on the left
                      image: logoBase64,
                      width: 50,
                      margin: [40, 20],
                    },
                    {
                      // Form title on the right
                      text: form.title || "Untitled Form",
                      alignment: "right",
                      margin: [0, 30, 40, 20],
                      fontSize: 16,
                      bold: true,
                      color: "#2980b9",
                    },
                  ],
                  fillColor: "#f8f9fa",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
        content: [
          {
            text: "Form Submissions",
            style: "header",
            margin: [0, 20, 0, 20],
          },
          ...submissionContent,
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            color: "#2980b9",
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
            color: "#34495e",
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: "#2c3e50",
            fillColor: "#ecf0f1",
          },
          tableRow: {
            fontSize: 12,
            color: "#2c3e50",
            margin: [0, 5, 0, 5],
          },
        },
      };

      // Generate PDF using pdfMake
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBlob((blob) => {
        const pdfUrl = URL.createObjectURL(blob);
        setCurrentPdfUrl(pdfUrl);
        setPdfPreviewVisible(true);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => categories[category] || category,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, form) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(form)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(form._id)}
          >
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
          <Button
            key="download"
            type="primary"
            href={currentPdfUrl}
            download="form.pdf"
          >
            Download
          </Button>,
        ]}
        width={800}
      >
        <iframe
          src={currentPdfUrl}
          style={{ width: "100%", height: "500px" }}
        />
      </Modal>
    </div>
  );
};

export default FormsTab;