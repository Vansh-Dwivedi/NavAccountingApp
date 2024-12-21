import React from "react";
import "./components.css";

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
          <h2>{submission.formTitle || 'Untitled Form'}</h2>
          {submission.responses.map((response, index) => {
            const field = submission.form.fields.find(f => f._id.toString() === response.fieldId.toString());
            if (!field) {
              return null; // Skip if field is not found
            }
            return (
              <div key={index} className="response-item">
                <p className="question">{field.label}</p>
                <p className="answer">
                  {field.type === 'digitalSignature' ? (
                    <img src={response.value} alt="Digital Signature" style={{maxWidth: '200px'}} />
                  ) : field.type === 'file' ? (
                    <button onClick={() => handleDownload(response.value)}>
                      Download {field.label}
                    </button>
                  ) : (
                    <span>{response.value}</span>
                  )}
                </p>
              </div>
            );
          })}
          <p className="submission-date">Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionModal;
