import React, { useState, useEffect } from "react";
import { Card, Avatar, Typography, List, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import api from "../utils/api";
import "./components.css";

const { Title, Text } = Typography;

const FormSubmissionPage = ({ formId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formId) {
      fetchSubmissions(formId);
    } else {
      setLoading(false);
      setError("No form ID provided");
    }
  }, [formId]);

  const fetchSubmissions = async (id) => {
    try {
      console.log("Fetching submissions for form id:", id);
      const response = await api.get(`/api/forms/${id}/submissions`);
      console.log("Fetched submissions:", response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading submissions...</div>;
  if (error) return <div className="error">{error}</div>;
  if (submissions.length === 0) return <div>No submissions found</div>;

  return (
    <div className="form-submission-page">
      <Title level={2}>Form Submissions</Title>
      <List
        itemLayout="vertical"
        dataSource={submissions}
        renderItem={(submission, index) => (
          <Card
            key={submission._id || index}
            style={{ marginBottom: 16 }}
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={
                    submission.user.profilePic
                      ? `${process.env.REACT_APP_API_URL}/uploads/${submission.user.profilePic}`
                      : null
                  }
                  icon={!submission.user.profilePic && <UserOutlined />}
                />
                <Text strong style={{ marginLeft: 8 }}>
                  {submission.user.username}
                </Text>
              </div>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={submission.responses}
              renderItem={(response) => (
                <List.Item>
                  <List.Item.Meta
                    title={response.fieldLabel}
                    description={
                      response.type === "digitalSignature" ? (
                        <div>
                          <Text style={{ marginRight: 8 }}>
                            Digital Signature:
                          </Text>
                          <Image
                            width={200}
                            src={JSON.parse(response.value).value}
                            alt="Digital Signature"
                          />
                        </div>
                      ) : (
                        <Text>{response.value}</Text>
                      )
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Submitted at:{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </Text>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default FormSubmissionPage;
