import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button, Dropdown, Menu, Modal, Pagination, message } from "antd";
import { UploadOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../utils/api";

const DigitalSignatureField = ({ field, index, updateField, userId }) => {
  const sigCanvas = useRef();
  const [isExpanded, setIsExpanded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 200 });
  const [signatureImage, setSignatureImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSignatures, setTotalSignatures] = useState(0);
  const pageSize = 10;
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (isExpanded) {
        setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
      } else {
        setCanvasSize({ width: 400, height: 200 });
      }
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [isExpanded]);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsPlaceholderVisible(true);
    }
    setSignatureImage(null);
    updateField(index, { ...field, value: null, filled: false });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageUpload = (info) => {
    const { status } = info.file;
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setSignatureImage(URL.createObjectURL(info.file.originFileObj));
      if (sigCanvas.current) {
        sigCanvas.current.clear();
      }
      setIsPlaceholderVisible(false);
      updateField(index, { ...field, value: URL.createObjectURL(info.file.originFileObj), filled: true });
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const fetchSignatures = async () => {
    try {
      const response = await api.get(
        `/api/signatures/${userId}?page=${currentPage}&limit=${pageSize}`
      );
      setSignatures(response.data.signatures);
      setTotalSignatures(response.data.total);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      message.error("Failed to fetch signatures");
    }
  };

  const handleMenuClick = (e) => {
    if (e.key === "image") {
      document.getElementById("imageUpload").click();
    } else if (e.key === "signature") {
      fetchSignatures();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="image">Upload Image</Menu.Item>
      <Menu.Item key="signature">Select Signature</Menu.Item>
    </Menu>
  );

  const handleSignatureSelect = (signature) => {
    setSignatureImage(signature.data);
    setIsModalVisible(false);
    updateField(index, { ...field, value: signature.data, filled: true });
    setIsPlaceholderVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSignatures();
  };

  const handleCanvasBegin = () => {
    setIsPlaceholderVisible(false);
  };

  const handleCanvasEnd = () => {
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setSignatureImage(signatureData);
    updateField(index, { ...field, value: signatureData, filled: true });
  };

  const handleSignatureChange = (newSignature) => {
    updateField(index, { ...field, value: newSignature });
  };

  const handleDrawingEnd = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();
      handleSignatureChange(signatureData);
    }
  };

  const handleExistingSignatureSelect = (signature) => {
    handleSignatureChange(signature.data);
  };

  return (
    <div
      style={{
        width: isExpanded ? "100vw" : `${canvasSize.width}px`,
        height: isExpanded ? "100vh" : `${canvasSize.height}px`,
        position: isExpanded ? "fixed" : "relative",
        top: isExpanded ? "0" : "auto",
        left: isExpanded ? "0" : "auto",
        zIndex: isExpanded ? "9999" : "auto",
        backgroundColor: "#f5f5f5",
        padding: isExpanded ? "0" : "10px",
        borderRadius: isExpanded ? "0" : "8px",
        boxShadow: isExpanded ? "none" : "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ position: "relative", height: "100%" }}>
        {signatureImage ? (
          <img
            src={signatureImage}
            alt="Signature"
            style={{
              maxWidth: "100%",
              maxHeight: isExpanded ? "calc(100% - 60px)" : "calc(100% - 40px)",
              objectFit: "contain",
              marginTop: isExpanded ? "60px" : "40px",
            }}
          />
        ) : (
          <div
            style={{
              position: "relative",
              width: isExpanded ? "100%" : canvasSize.width - 20,
              height: isExpanded ? "calc(100% - 60px)" : canvasSize.height - 60,
            }}
          >
            <SignatureCanvas
              ref={sigCanvas}
              onBegin={handleCanvasBegin}
              onEnd={handleCanvasEnd}
              canvasProps={{
                width: isExpanded ? window.innerWidth : canvasSize.width - 20,
                height: isExpanded ? window.innerHeight - 60 : canvasSize.height - 60,
                style: {
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                },
              }}
            />
            {isPlaceholderVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#999",
                  pointerEvents: "none",
                  fontStyle: "italic",
                  fontSize: "14px",
                }}
              >
                Enter Digital Signature Here
              </div>
            )}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            backgroundColor: "rgba(224, 224, 224, 0.7)",
          }}
        >
          <Dropdown overlay={menu}>
            <Button>
              Upload <DownOutlined />
            </Button>
          </Dropdown>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload({
                file: { status: "done", originFileObj: e.target.files[0] },
              })
            }
            style={{ display: "none" }}
          />
          <Button onClick={clear}>Clear</Button>
          <Button onClick={toggleExpand}>
            {isExpanded ? "Minimize" : "Expand"}
          </Button>
        </div>
      </div>
      <Modal
        title="Select Signature"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {signatures.length > 0 ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {signatures.map((signature) => (
                <div
                  key={signature._id}
                  onClick={() => handleSignatureSelect(signature)}
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  <img
                    src={signature.data}
                    alt={signature.name}
                    style={{
                      maxWidth: "100%",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <p>{signature.name}</p>
                </div>
              ))}
            </div>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalSignatures}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        ) : (
          <p>No signatures found.</p>
        )}
      </Modal>
    </div>
  );
};

export default DigitalSignatureField;
