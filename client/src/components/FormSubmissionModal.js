import React from "react";
import "./FormSubmissionModal.css";

const FormSubmissionModal = ({ submission, onClose }) => {
  if (!submission) {
    return null;
  }

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/download/${fileName}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {submission.user && (
          <div className="user-info">
            {submission.user.profilePic && (
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${submission.user.profilePic}`}
                alt="User"
                className="user-avatar"
              />
            )}
            <h3>{submission.user.username || "Unknown User"}</h3>
          </div>
        )}
        <div className="submission-details">
          {submission.responses && submission.responses.map((response) => (
            <div key={response._id} className="response-item">
              <p className="question">{response.fieldLabel}</p>
              <p className="answer">
                {response.value.endsWith('.png') || response.value.endsWith('.jpg') || response.value.endsWith('.pdf') ? (
                  <button onClick={() => handleDownload(response.value)}>
                    Download {response.fieldLabel}
                  </button>
                ) : (
                  response.value
                )}
              </p>
            </div>
          ))}
          <p className="submission-date">Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionModal;
