import React, { useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import api from '../../utils/api';
import { Input, Button, List, Pagination, message, Form, Modal } from 'antd';
import 'antd/dist/reset.css';

const Signatures = ({ userId }) => {
  const [signatures, setSignatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSignatures, setTotalSignatures] = useState(0);
  const [newSignatureName, setNewSignatureName] = useState('');
  const [sigPad, setSigPad] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchSignatures();
    }
  }, [userId, currentPage]);

  const fetchSignatures = async () => {
    try {
      const response = await api.get(`/api/signatures/${userId}`);
      setSignatures(response.data.signatures);
      setTotalSignatures(response.data.total);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      message.error('Failed to fetch signatures');
    }
  };
  const handleAddSignature = async () => {
    if (sigPad.isEmpty()) {
      message.warning('Please provide a signature');
      return;
    }
    try {
      const signatureData = sigPad.toDataURL();
      await api.post(`/api/signatures/${userId}`, { name: newSignatureName, data: signatureData });
      setNewSignatureName('');
      sigPad.clear();
      fetchSignatures();
      message.success('Signature added successfully');
    } catch (error) {
      console.error('Error adding signature:', error);
      message.error('Failed to add signature');
    }
  };

  const showDeleteConfirm = (signature) => {
    setSelectedSignature(signature);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedSignature) {
      try {
        await api.delete(`/api/signatures/${selectedSignature._id}`);
        fetchSignatures();
        message.success('Signature deleted successfully');
      } catch (error) {
        console.error('Error deleting signature:', error);
        message.error('Failed to delete signature');
      }
    }
    setIsModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Signatures</h2>
      <Form layout="vertical" onFinish={handleAddSignature}>
        <Form.Item label="Signature Name" required>
          <Input
            value={newSignatureName}
            onChange={(e) => setNewSignatureName(e.target.value)}
            placeholder="Enter signature name"
          />
        </Form.Item>
        <Form.Item label="Signature" required>
          <SignatureCanvas
            ref={(ref) => { setSigPad(ref) }}
            canvasProps={{width: 500, height: 200, style: { border: '1px solid #d9d9d9', borderRadius: '2px' }}}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
            Add Signature
          </Button>
          <Button onClick={() => sigPad.clear()}>Clear</Button>
        </Form.Item>
      </Form>
      <List
        dataSource={signatures}
        renderItem={(signature) => (
          <List.Item
            key={signature._id}
            actions={[
              <Button onClick={() => showDeleteConfirm(signature)} danger>
                Delete
              </Button>
            ]}
          >
            <List.Item.Meta
              title={signature.name}
              description={<img src={signature.data} alt={signature.name} style={{ maxWidth: '100%', height: 'auto' }} />}
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        total={totalSignatures}
        pageSize={10}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
      />
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete this signature?</p>
      </Modal>
    </div>
  );
};

export default Signatures;
