import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, List, Input, Button, message, Form, DatePicker, Select, Progress, Tag } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, TrophyOutlined, TeamOutlined, ProjectOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const { Content, Sider } = Layout;
const { Option } = Select;

const AdminEmployeeDashboard = ({ employeeId }) => {
  const [passbook, setPassbook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [tasks, setTasks] = useState({ completed: [], pending: [] });
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium' });
  const [activeTab, setActiveTab] = useState('passbook');

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const [
        passbookRes,
        activeNotesRes,
        deletedNotesRes,
        savedNotesRes,
        tasksRes
      ] = await Promise.all([
        api.get(`/api/admin/employee-passbook/${employeeId}`),
        api.get(`/api/admin/employee-notes/${employeeId}`),
        api.get(`/api/admin/employee-notes/${employeeId}/deleted`),
        api.get(`/api/admin/employee-notes/${employeeId}/saved`),
        api.get(`/api/admin/employee-tasks/${employeeId}`)
      ]);

      setPassbook(passbookRes.data);
      setNotes(activeNotesRes.data); // Updated to access .data
      setDeletedNotes(deletedNotesRes.data);
      setSavedNotes(savedNotesRes.data);
      setTasks({
        completed: tasksRes.data.filter(task => task.status === "Completed"),
        pending: tasksRes.data.filter(task => task.status !== "Completed")
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
      message.error('Failed to fetch employee data');
    }
  };

  const updatePassbook = async (updatedPassbook) => {
    try {
      await api.put('/api/admin/employee-passbook', { employeeId, ...updatedPassbook });
      setPassbook(updatedPassbook);
      message.success('Passbook updated successfully');
    } catch (error) {
      console.error('Error updating passbook:', error);
      message.error('Failed to update passbook');
    }
  };

  const assignTask = async () => {
    try {
      await api.post('/api/admin/assign-task', { employeeId, ...newTask });
      message.success('Task assigned successfully');
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium' });
    } catch (error) {
      console.error('Error assigning task:', error);
      message.error('Failed to assign task');
    }
  };

  const updateNote = async (noteId, content) => {
    try {
      await api.put('/api/admin/employee-notes', { employeeId, noteId, content });
      setNotes(notes.map(note => note._id === noteId ? { ...note, content } : note));
      message.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      message.error('Failed to update note');
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/api/admin/employee-notes/${employeeId}/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
      message.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note');
    }
  };

  const handleSaveNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isSaved: true
      });
      await fetchEmployeeData(); // Refresh all notes
      message.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      message.error('Failed to save note');
    }
  };

  const handleUnsaveNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isSaved: false
      });
      await fetchEmployeeData();
      message.success('Note unsaved successfully');
    } catch (error) {
      console.error('Error unsaving note:', error);
      message.error('Failed to unsave note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isDeleted: true,
        deletedAt: new Date()
      });
      await fetchEmployeeData();
      message.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note');
    }
  };

  const handleRestoreNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isDeleted: false,
        deletedAt: null
      });
      await fetchEmployeeData();
      message.success('Note restored successfully');
    } catch (error) {
      console.error('Error restoring note:', error);
      message.error('Failed to restore note');
    }
  };

  const renderPassbookContent = () => (
    <Card title="Employee Passbook">
      <Form layout="vertical" onFinish={updatePassbook} initialValues={passbook}>
        <Form.Item name="achievements" label="Achievements">
          <List
            dataSource={passbook?.achievements || []}
            renderItem={(item, index) => (
              <List.Item>
                <Form.Item
                  name={['achievements', index, 'title']}
                  rules={[{ required: true, message: 'Please input the achievement title!' }]}
                >
                  <Input placeholder="Achievement title" />
                </Form.Item>
                <Form.Item
                  name={['achievements', index, 'date']}
                  rules={[{ required: true, message: 'Please select the achievement date!' }]}
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item
                  name={['achievements', index, 'description']}
                  rules={[{ required: true, message: 'Please input the achievement description!' }]}
                >
                  <Input.TextArea placeholder="Achievement description" />
                </Form.Item>
                <Button type="link" danger onClick={() => {
                  const newAchievements = passbook.achievements.filter((_, i) => i !== index);
                  updatePassbook({ ...passbook, achievements: newAchievements });
                }}>
                  Delete
                </Button>
              </List.Item>
            )}
          />
          <Button type="dashed" onClick={() => {
            const newAchievements = [...(passbook?.achievements || []), { title: '', date: null, description: '' }];
            updatePassbook({ ...passbook, achievements: newAchievements });
          }} block>
            Add Achievement
          </Button>
        </Form.Item>

        <Form.Item name="supportDirectory" label="Support Directory">
          <List
            dataSource={passbook?.supportDirectory || []}
            renderItem={(item, index) => (
              <List.Item>
                <Form.Item
                  name={['supportDirectory', index, 'name']}
                  rules={[{ required: true, message: 'Please input the name!' }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                  name={['supportDirectory', index, 'role']}
                  rules={[{ required: true, message: 'Please input the role!' }]}
                >
                  <Input placeholder="Role" />
                </Form.Item>
                <Form.Item
                  name={['supportDirectory', index, 'contact']}
                  rules={[{ required: true, message: 'Please input the contact information!' }]}
                >
                  <Input placeholder="Contact" />
                </Form.Item>
                <Button type="link" danger onClick={() => {
                  const newSupportDirectory = passbook.supportDirectory.filter((_, i) => i !== index);
                  updatePassbook({ ...passbook, supportDirectory: newSupportDirectory });
                }}>
                  Delete
                </Button>
              </List.Item>
            )}
          />
          <Button type="dashed" onClick={() => {
            const newSupportDirectory = [...(passbook?.supportDirectory || []), { name: '', role: '', contact: '' }];
            updatePassbook({ ...passbook, supportDirectory: newSupportDirectory });
          }} block>
            Add Support Contact
          </Button>
        </Form.Item>

        <Form.Item name="projectTrackers" label="Project Trackers">
          <List
            dataSource={passbook?.projectTrackers || []}
            renderItem={(item, index) => (
              <List.Item>
                <Form.Item
                  name={['projectTrackers', index, 'name']}
                  rules={[{ required: true, message: 'Please input the project name!' }]}
                >
                  <Input placeholder="Project name" />
                </Form.Item>
                <Form.Item
                  name={['projectTrackers', index, 'progress']}
                  rules={[{ required: true, message: 'Please input the project progress!' }]}
                >
                  <Progress
                    type="circle"
                    percent={item.progress}
                    format={(percent) => (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={percent}
                        onChange={(e) => {
                          const newProjectTrackers = [...passbook.projectTrackers];
                          newProjectTrackers[index].progress = parseInt(e.target.value);
                          updatePassbook({ ...passbook, projectTrackers: newProjectTrackers });
                        }}
                        style={{ width: 50 }}
                      />
                    )}
                  />
                </Form.Item>
                <Button type="link" danger onClick={() => {
                  const newProjectTrackers = passbook.projectTrackers.filter((_, i) => i !== index);
                  updatePassbook({ ...passbook, projectTrackers: newProjectTrackers });
                }}>
                  Delete
                </Button>
              </List.Item>
            )}
          />
          <Button type="dashed" onClick={() => {
            const newProjectTrackers = [...(passbook?.projectTrackers || []), { name: '', progress: 0 }];
            updatePassbook({ ...passbook, projectTrackers: newProjectTrackers });
          }} block>
            Add Project Tracker
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Passbook
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderNotesContent = () => (
    <div>
      <Card title="Active Notes" style={{ marginBottom: 16 }}>
        <List
          dataSource={notes}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button onClick={() => handleSaveNote(note._id)}>Save</Button>,
                <Button danger onClick={() => handleDeleteNote(note._id)}>Delete</Button>
              ]}
            >
              <List.Item.Meta
                title={new Date(note.createdAt).toLocaleString()}
                description={note.content || 'No content'}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Saved Notes" style={{ marginBottom: 16 }}>
        <List
          dataSource={savedNotes}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button onClick={() => handleUnsaveNote(note._id)}>Unsave</Button>,
                <Button danger onClick={() => handleDeleteNote(note._id)}>Delete</Button>
              ]}
            >
              <List.Item.Meta
                title={new Date(note.createdAt).toLocaleString()}
                description={note.content || 'No content'}
              />
              <Tag color="green">Saved</Tag>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Deleted Notes">
        <List
          dataSource={deletedNotes}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => handleRestoreNote(note._id)}>
                  Restore
                </Button>
              ]}
            >
              <List.Item.Meta
                title={new Date(note.createdAt).toLocaleString()}
                description={note.content || 'No content'}
              />
              <Tag color="red">Deleted on {new Date(note.deletedAt).toLocaleString()}</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderTasksContent = () => (
    <div>
      <Card title="Pending Tasks" style={{ marginBottom: 16 }}>
        <List
          dataSource={tasks.pending}
          renderItem={(task) => (
            <List.Item>
              <List.Item.Meta
                title={task.title}
                description={
                  <>
                    <p>{task.description}</p>
                    <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>
                      {task.priority}
                    </Tag>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Completed Tasks">
        <List
          dataSource={tasks.completed}
          renderItem={(task) => (
            <List.Item>
              <List.Item.Meta
                title={task.title}
                description={
                  <>
                    <p>{task.description}</p>
                    <p>Completed on: {new Date(task.completedAt).toLocaleDateString()}</p>
                    <Tag color="green">Completed</Tag>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  return (
    <Layout>
      <Sider width={200}>
        <Menu mode="inline" defaultSelectedKeys={['passbook']} onSelect={({ key }) => setActiveTab(key)}>
          <Menu.Item key="passbook" icon={<UserOutlined />}>Passbook</Menu.Item>
          <Menu.Item key="notes" icon={<EditOutlined />}>Notes</Menu.Item>
          <Menu.Item key="tasks" icon={<ProjectOutlined />}>Tasks Overview</Menu.Item>
          <Menu.Item key="assignTask" icon={<PlusOutlined />}>Assign Task</Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        {activeTab === 'passbook' && renderPassbookContent()}
        {activeTab === 'notes' && renderNotesContent()}
        {activeTab === 'tasks' && renderTasksContent()}
        {activeTab === 'assignTask' && (
          <Card title="Assign Task">
            <Form layout="vertical" onFinish={assignTask}>
              <Form.Item name="title" label="Task Title" rules={[{ required: true }]}>
                <Input value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              </Form.Item>
              <Form.Item name="description" label="Task Description" rules={[{ required: true }]}>
                <Input.TextArea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
              </Form.Item>
              <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
                <DatePicker onChange={(date) => setNewTask({...newTask, dueDate: date})} />
              </Form.Item>
              <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                <Select value={newTask.priority} onChange={(value) => setNewTask({...newTask, priority: value})}>
                  <Option value="Low">Low</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Assign Task</Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default AdminEmployeeDashboard;
