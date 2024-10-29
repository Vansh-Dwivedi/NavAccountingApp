import React, { useState, useEffect } from 'react';
import { List, Input, Button, Modal, message, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const { TextArea } = Input;

const NotesSection = ({ clientId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    fetchNotes();
  }, [clientId, currentPage]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/api/notes/${clientId}?page=${currentPage}&limit=${pageSize}`);
      setNotes(response.data.notes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    try {
      const response = await api.post('/api/notes', { 
        clientId, 
        content: newNote, 
        isInternal: true 
      });
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
      await api.put(`/api/notes/${editingNote._id}`, {
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
      await api.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
      message.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note');
    }
  };

  return (
    <div className="notes-section" style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ marginBottom: 16 }}>
        <TextArea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          rows={4}
        />
        <Button 
          type="primary" 
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
              description={note.content}
              title={new Date(note.createdAt).toLocaleString()}
            />
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={notes.length}
        onChange={setCurrentPage}
        style={{ marginTop: 16, textAlign: 'center' }}
      />

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
    </div>
  );
};

export default NotesSection;
