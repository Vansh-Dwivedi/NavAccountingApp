import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import SignatureCanvas from "react-signature-canvas";

const NotesAndSignatures = ({ clientId }) => {
  const [notes, setNotes] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [currentSignatureName, setCurrentSignatureName] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const sigCanvas = useRef({});

  useEffect(() => {
    fetchNotesAndSignatures();
  }, []);

  const fetchNotesAndSignatures = async () => {
    try {
      const notesResponse = await api.get(`/api/notes/${clientId}`);
      const signaturesResponse = await api.get("/api/signatures");
      setNotes(notesResponse.data);
      setSignatures(signaturesResponse.data);
    } catch (error) {
      console.error("Error fetching notes and signatures:", error);
    }
  };

  const handleSaveNote = async () => {
    try {
      await api.post(`/api/notes/${clientId}`, {
        content: currentNote,
        isInternal,
      });
      setCurrentNote("");
      setIsInternal(false);
      fetchNotesAndSignatures();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleSaveSignature = async () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please draw a signature before saving.");
      return;
    }

    try {
      const signatureData = sigCanvas.current.toDataURL();
      await api.post("/api/signatures", {
        name: currentSignatureName,
        data: signatureData,
      });
      setCurrentSignatureName("");
      sigCanvas.current.clear();
      fetchNotesAndSignatures();
    } catch (error) {
      console.error("Error saving signature:", error);
    }
  };

  return (
    <div className="notes-and-signatures">
      <div className="notes-section">
        <h3>Notes</h3>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Enter your note here"
        />
        <label>
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
          />
          Internal Note
        </label>
        <button onClick={handleSaveNote}>Save Note</button>
        <div className="saved-notes">
          {notes.map((note, index) => (
            <div key={index} className="note-item">
              <p>{note.content}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              {note.isInternal && (
                <span className="internal-note-tag">Internal</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="signatures-section">
        <h3>Signatures</h3>
        <input
          type="text"
          value={currentSignatureName}
          onChange={(e) => setCurrentSignatureName(e.target.value)}
          placeholder="Signature name"
        />
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 500,
            height: 200,
            className: "signature-canvas",
          }}
        />
        <button onClick={handleSaveSignature}>Save Signature</button>
        <button onClick={() => sigCanvas.current.clear()}>Clear</button>
        <div className="saved-signatures">
          {signatures.map((sig, index) => (
            <div key={index} className="signature-item">
              <p>{sig.name}</p>
              <img
                src={sig.data}
                alt={sig.name}
                className="signature-preview"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesAndSignatures;
