import React, { useState, useEffect } from "react";
import { Form, Input, Button, List, Pagination, message, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import "antd/dist/reset.css";

const { TextArea } = Input;

const Notes = ({ userId }) => {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [newNote, setNewNote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId, currentPage]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/api/notes/${userId}`);
      setNotes(response.data.notes);
      setTotalNotes(response.data.total);
    } catch (error) {
      console.error('Error fetching notes:', error);
      message.error('Failed to fetch notes');
    }
  };

  const handleAddNote = async (values) => {
    try {
      await api.post(`/api/notes/${userId}`, { content: values.newNote });
      setNewNote("");
      fetchNotes();
      message.success("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      message.error("Failed to add note");
    }
  };

  const handleUpdateNote = async (noteId, content) => {
    try {
      await api.put(`/api/notes/${noteId}`, { content });
      fetchNotes();
      message.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      message.error("Failed to update note");
    }
  };

  const showDeleteConfirm = (note) => {
    setSelectedNote(note);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedNote) {
      try {
        await api.delete(`/api/notes/${selectedNote._id}`);
        fetchNotes();
        message.success("Note deleted successfully");
      } catch (error) {
        console.error("Error deleting note:", error);
        message.error("Failed to delete note");
      }
    }
    setIsModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Notes</h2>
      <Form onFinish={handleAddNote} style={{ marginBottom: "20px" }}>
        <Form.Item
          name="newNote"
          rules={[{ required: true, message: "Please enter a note" }]}
        >
          <TextArea
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter a new note"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Note
          </Button>
        </Form.Item>
      </Form>
      <List
        dataSource={notes}
        renderItem={(note) => (
          <List.Item
            key={note._id}
            actions={[
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  const newContent = prompt("Update note:", note.content);
                  if (newContent) handleUpdateNote(note._id, newContent);
                }}
              >
                Edit
              </Button>,
              <Button
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(note)}
                danger
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta description={note.content} />
          </List.Item>
        )}
      />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          current={currentPage}
          total={totalNotes}
          pageSize={10}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete this note?</p>
      </Modal>
    </div>
  );
};

export default Notes;
