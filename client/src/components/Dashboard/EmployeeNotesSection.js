import React, { useState, useEffect } from 'react';
import { List, Card, Input, Button, Modal, message, Pagination, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const { TextArea } = Input;
const { Title } = Typography;

const EmployeeNotesSection = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    fetchNotes();
  }, [currentPage]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/api/employee/notes?page=${currentPage}&limit=${pageSize}`);
      setNotes(response.data.notes);
      setTotalNotes(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      message.error('Failed to fetch notes');
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      message.warning('Please enter a note');
      return;
    }

    try {
      const response = await api.post('/api/employee/notes', { content: newNote });
      setNotes([response.data, ...notes]);
      setNewNote('');
      message.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      message.error('Failed to add note');
    }
  };

  const handleUpdateNote = async () => {
    try {
      await api.put(`/api/employee/notes/${editingNote._id}`, {
        content: editingNote.content
      });
      setNotes(notes.map(note => 
        note._id === editingNote._id ? editingNote : note
      ));
      setIsModalVisible(false);
      setEditingNote(null);
      message.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      message.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.put(`/api/employee/notes/${noteId}`, {
        isDeleted: true,
        deletedAt: new Date()
      });
      setNotes(notes.filter(note => note._id !== noteId));
      message.success('Note moved to trash');
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note');
    }
  };

  const saveNote = async (noteId) => {
    try {
      const response = await api.put(`/api/employee/notes/${noteId}`, {
        isSaved: true
      });
      setNotes(notes.map(note => 
        note._id === noteId ? { ...note, isSaved: true } : note
      ));
      message.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      message.error('Failed to save note');
    }
  };

  return (
    <Card title={<Title level={4}>Personal Notes</Title>} style={{ height: '600px', overflow: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ marginBottom: 16 }}>
          <TextArea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            rows={4}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddNote}
            style={{ marginTop: 8 }}
          >
            Add Note
          </Button>
        </div>

        <List
          loading={loading}
          dataSource={notes}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button 
                  icon={<EditOutlined />} 
                  onClick={() => {
                    setEditingNote(note);
                    setIsModalVisible(true);
                  }}
                />,
                <Button 
                  icon={<DeleteOutlined />} 
                  danger 
                  onClick={() => handleDeleteNote(note._id)}
                />
              ]}
            >
              <List.Item.Meta
                title={new Date(note.createdAt).toLocaleString()}
                description={note.content}
              />
            </List.Item>
          )}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalNotes}
          onChange={setCurrentPage}
          style={{ marginTop: 16, textAlign: 'center' }}
        />
      </Space>

      <Modal
        title="Edit Note"
        visible={isModalVisible}
        onOk={handleUpdateNote}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNote(null);
        }}
      >
        <TextArea
          value={editingNote?.content}
          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
          rows={4}
        />
      </Modal>
    </Card>
  );
};

export default EmployeeNotesSection;
