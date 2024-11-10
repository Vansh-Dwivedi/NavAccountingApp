import React, { useState, useEffect } from 'react';
import { Upload, Card, List, Button, Modal, Input, message, Typography } from 'antd';
import { InboxOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RecipientSearchModal from './RecipientSearchModal';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import CSVReader from './Dashboard/CSVReader';
import TextEditor from './Dashboard/TextEditor';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';

const { Title } = Typography;

const DragAndDropScreen = ({ userRole }) => {
  const [items, setItems] = useState([]);
  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [receivedFiles, setReceivedFiles] = useState([]);

  useEffect(() => {
    const fetchReceivedFiles = async () => {
      try {
        const userId = jwtDecode(localStorage.getItem('token')).user.id;
        const response = await api.get(`/api/files/${userId}/files`);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setReceivedFiles(response.data.data.map(file => ({
            ...file,
            key: file._id
          })));
        } else {
          setReceivedFiles([]);
        }
      } catch (error) {
        console.error('Error fetching received files:', error);
        message.error('Error loading received files');
        setReceivedFiles([]);
      }
    };

    fetchReceivedFiles();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setItems(reorderedItems);
  };

  const convertImageToSVG = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Simple SVG conversion - creates path from image edges
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let svgPaths = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">`;
        
        // Add image data as base64 to preserve quality
        svgPaths += `<image width="100%" height="100%" href="${img.src}"/>`;
        svgPaths += '</svg>';
        
        resolve(svgPaths);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const handleFileDrop = async (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!['pdf', 'csv', 'txt', 'jpg', 'jpeg', 'png'].includes(extension)) {
      message.error('Only PDF, CSV, TXT, and image files are allowed');
      return false;
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      let content = e.target.result;
      let type = extension;

      // Convert images to SVG
      if (['jpg', 'jpeg', 'png'].includes(extension)) {
        try {
          content = await convertImageToSVG(file);
          type = 'svg';
        } catch (error) {
          console.error('Error converting to SVG:', error);
          message.error('Error converting image to SVG');
          return;
        }
      }

      const newItem = {
        id: `file-${Date.now()}`,
        name: file.name,
        content: content,
        type: type,
        file: file
      };

      setItems(prevItems => [...prevItems, newItem]);
    };

    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      reader.readAsDataURL(file);
    } else if (extension === 'pdf') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }

    return false; // Prevent default upload behavior
  };

  const handleSendFile = async (item) => {
    try {
      setSelectedFile(item.file);
      setRecipientModalVisible(true);
    } catch (error) {
      console.error('Error preparing file for sending');
      message.error('Error preparing file for sending');
    }
  };

  const handleRecipientSelect = async (recipient) => {
    try {
      const formData = new FormData();
      if (selectedFile.type.includes('image')) {
        // Convert to SVG before sending if it's an image
        const svgContent = await convertImageToSVG(selectedFile);
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgFileName = selectedFile.name.replace(/\.[^/.]+$/, '.svg');
        const svgFile = new File([svgBlob], svgFileName, { type: 'image/svg+xml' });
        formData.append('file', svgFile);
      } else {
        formData.append('file', selectedFile);
      }
      formData.append('recipientId', recipient._id);

      await api.post('/api/files/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      message.success(`File sent to ${recipient.username}`);
      setRecipientModalVisible(false);
      setSelectedFile(null);
    } catch (error) {
      message.error('Error sending file');
      console.error('Error:', error);
    }
  };

  const renderFilePreview = (item) => {
    switch (item.type) {
      case 'pdf':
        return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div style={{ height: '200px' }}>
              <Viewer fileUrl={item.content} />
            </div>
          </Worker>
        );
      case 'csv':
        return <CSVReader data={item.content} />;
      case 'txt':
        return <TextEditor content={item.content} readOnly />;
      case 'svg':
        return <div dangerouslySetInnerHTML={{ __html: item.content }} style={{ maxWidth: '100%', maxHeight: '200px' }} />;
      case 'jpg':
      case 'jpeg': 
      case 'png':
        return <img src={item.content} alt={item.name} style={{ maxWidth: '100%', maxHeight: '200px' }} />;
      default:
        return <p>No preview available</p>;
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
      <Upload.Dragger
        accept=".pdf,.csv,.txt,.jpg,.jpeg,.png"
        beforeUpload={(file) => {
          handleFileDrop(file);
          return false;
        }}
        style={{ marginBottom: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag files to this area
        </p>
      </Upload.Dragger>

      <Title level={4}>Files to Send</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="files">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ marginBottom: 16 }}
                      actions={[
                        <Button onClick={() => handleSendFile(item)}>
                          Send to Recipient
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        title={item.name}
                        description={renderFilePreview(item)}
                      />
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Title level={4} style={{ marginTop: 24 }}>Received Files</Title>
      <List
        dataSource={receivedFiles}
        renderItem={file => (
          <List.Item
            key={file.key}
            actions={[
              <Button 
                onClick={() => window.open(`${api.defaults.baseURL}/api/files/download/${file.filePath}`, '_blank')}
                icon={<DownloadOutlined />}
              >
                Download
              </Button>
            ]}
          >
            <List.Item.Meta
              title={file.fileName}
              description={`From: ${file.senderName} | Sent: ${new Date(file.createdAt).toLocaleString()}`}
            />
          </List.Item>
        )}
      />

      <RecipientSearchModal
        visible={recipientModalVisible}
        onClose={() => setRecipientModalVisible(false)}
        onSelect={handleRecipientSelect}
        userRole={userRole}
      />
    </div>
  );
};

export default DragAndDropScreen;