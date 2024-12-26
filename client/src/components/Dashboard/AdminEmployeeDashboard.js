import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  List,
  Input,
  Button,
  message,
  Form,
  DatePicker,
  Select,
  Progress,
  Tag,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  ProjectOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import api from "../../utils/api";
import { formatDate, formatDateTime, isValidDate } from "../../utils/dateUtils";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const { Content, Sider } = Layout;
const { Option } = Select;

const AdminEmployeeDashboard = ({ employeeId }) => {
  const [passbook, setPassbook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [tasks, setTasks] = useState({ completed: [], pending: [] });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    priority: "Medium",
  });
  const [activeTab, setActiveTab] = useState("information");
  const [employeeStats, setEmployeeStats] = useState({
    taskCompletion: [],
    taskPriorities: { high: 0, medium: 0, low: 0 },
    taskStats: { completed: 0, pending: 0, completion: [] },
    performanceScore: 0,
    monthLabels: []
  });
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editedStats, setEditedStats] = useState({
    taskCompletion: [],
    taskPriorities: { high: 0, medium: 0, low: 0 },
    performanceScore: 0,
    monthLabels: []
  });

  useEffect(() => {
    fetchEmployeeData();
    fetchEmployeeStats();
  }, [employeeId]);

  useEffect(() => {
    if (employeeStats?.taskStats?.completion && employeeStats?.monthLabels) {
      setEditedStats({
        taskCompletion: [...employeeStats.taskStats.completion],
        taskPriorities: { ...(employeeStats.taskPriorities || { high: 0, medium: 0, low: 0 }) },
        performanceScore: employeeStats.performanceScore || 0,
        monthLabels: [...employeeStats.monthLabels]
      });
    }
  }, [employeeStats]);

  const fetchEmployeeData = async () => {
    try {
      const [
        passbookRes,
        activeNotesRes,
        deletedNotesRes,
        tasksRes,
      ] = await Promise.all([
        api.get(`/api/admin/employee-passbook/${employeeId}`),
        api.get(`/api/admin/employee-notes/${employeeId}`),
        api.get(`/api/admin/employee-notes/${employeeId}/deleted`),
        api.get(`/api/admin/employee-tasks/${employeeId}`),
      ]);

      const formattedPassbook = {
        ...passbookRes.data,
        dateOfJoining: formatDate(passbookRes.data.dateOfJoining),
        lastUpdated: formatDateTime(passbookRes.data.lastUpdated),
      };

      const formatNotes = (notes) =>
        notes.map((note) => ({
          ...note,
          createdAt: formatDateTime(note.createdAt),
          updatedAt: formatDateTime(note.updatedAt),
        }));

      const formattedTasks = tasksRes.data.map((task) => ({
        ...task,
        createdAt: formatDateTime(task.createdAt),
        dueDate: formatDate(task.dueDate),
        completedAt: task.completedAt ? formatDateTime(task.completedAt) : null,
      }));

      setPassbook(formattedPassbook);
      setNotes(formatNotes(activeNotesRes.data));
      setDeletedNotes(formatNotes(deletedNotesRes.data));
      setTasks({
        completed: formattedTasks.filter((task) => task.status === "Completed"),
        pending: formattedTasks.filter((task) => task.status !== "Completed"),
      });
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchEmployeeStats = async () => {
    try {
      const response = await api.get(`/api/admin/employee-stats/${employeeId}`);
      setEmployeeStats(response.data || {
        taskCompletion: [],
        taskPriorities: { high: 0, medium: 0, low: 0 },
        taskStats: { completed: 0, pending: 0, completion: [] },
        performanceScore: 0,
        monthLabels: []
      });
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      message.error("Failed to fetch employee statistics");
    }
  };

  const handleDateChange = (date) => {
    if (!date) return;
    setNewTask({
      ...newTask,
      dueDate: date.toISOString(),
    });
  };

  const updatePassbook = async (updatedPassbook) => {
    try {
      await api.put("/api/admin/employee-passbook", {
        employeeId,
        ...updatedPassbook,
      });
      setPassbook(updatedPassbook);
    } catch (error) {
      console.error("Error updating passbook:", error);
      message.error("Failed to update passbook");
    }
  };

  const assignTask = async () => {
    try {
      await api.post("/api/admin/assign-task", { employeeId, ...newTask });
      message.success("Task assigned successfully");
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
      });
    } catch (error) {
      console.error("Error assigning task:", error);
      message.error("Failed to assign task");
    }
  };

  const updateNote = async (noteId, content) => {
    try {
      await api.put("/api/admin/employee-notes", {
        employeeId,
        noteId,
        content,
      });
      setNotes(
        notes.map((note) => (note._id === noteId ? { ...note, content } : note))
      );
      message.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      message.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/api/admin/employee-notes/${employeeId}/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
      message.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      message.error("Failed to delete note");
    }
  };

  const handleSaveNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isSaved: true,
      });
      await fetchEmployeeData(); // Refresh all notes
      message.success("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      message.error("Failed to save note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isDeleted: true,
        deletedAt: new Date(),
      });
      await fetchEmployeeData();
      message.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      message.error("Failed to delete note");
    }
  };

  const handleRestoreNote = async (noteId) => {
    try {
      await api.put(`/api/admin/employee-notes/${employeeId}/${noteId}`, {
        isDeleted: false,
        deletedAt: null,
      });
      await fetchEmployeeData();
      message.success("Note restored successfully");
    } catch (error) {
      console.error("Error restoring note:", error);
      message.error("Failed to restore note");
    }
  };

  const handleUpdateStats = async () => {
    try {
      const response = await api.put(`/api/admin/employee-stats/${employeeId}`, editedStats);
      setEmployeeStats(response.data);
      setIsEditingStats(false);
      message.success('Employee stats updated successfully');
    } catch (error) {
      console.error('Error updating employee stats:', error);
      message.error('Failed to update employee statistics');
    }
  };

  const renderInformationContent = () => (
    <div>
      <Card 
        title="Employee Overview" 
        style={{ marginBottom: 16 }}
        extra={
          <Button 
            type={isEditingStats ? "primary" : "default"}
            onClick={() => {
              if (isEditingStats) {
                handleUpdateStats();
              } else {
                if (employeeStats?.taskStats?.completion && employeeStats?.monthLabels) {
                  setEditedStats({
                    taskCompletion: [...employeeStats.taskStats.completion],
                    taskPriorities: { ...(employeeStats.taskPriorities || { high: 0, medium: 0, low: 0 }) },
                    performanceScore: employeeStats.performanceScore || 0,
                    monthLabels: [...employeeStats.monthLabels]
                  });
                }
                setIsEditingStats(true);
              }
            }}
          >
            {isEditingStats ? "Save Changes" : "Edit Stats"}
          </Button>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <h3>Task Completion Rate</h3>
            {isEditingStats ? (
              <Form layout="vertical">
                {editedStats.taskCompletion.map((rate, index) => (
                  <Form.Item key={index} label={`Month ${index + 1}`}>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={rate}
                      onChange={(e) => {
                        const newCompletion = [...editedStats.taskCompletion];
                        newCompletion[index] = Number(e.target.value);
                        setEditedStats({
                          ...editedStats,
                          taskCompletion: newCompletion
                        });
                      }}
                    />
                  </Form.Item>
                ))}
              </Form>
            ) : (
              employeeStats?.monthLabels && (
                <Line
                  data={{
                    labels: employeeStats.monthLabels,
                    datasets: [{
                      label: "Tasks Completed (%)",
                      data: employeeStats.taskStats?.completion || [],
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.1,
                    }],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: (value) => `${value}%`
                        }
                      }
                    }
                  }}
                />
              )
            )}
          </div>
          <div>
            <h3>Task Priority Distribution</h3>
            {isEditingStats ? (
              <Form layout="vertical">
                <Form.Item label="High Priority">
                  <Input
                    type="number"
                    min={0}
                    value={editedStats.taskPriorities?.high || 0}
                    onChange={(e) => setEditedStats({
                      ...editedStats,
                      taskPriorities: {
                        ...(editedStats.taskPriorities || {}),
                        high: Number(e.target.value)
                      }
                    })}
                  />
                </Form.Item>
                <Form.Item label="Medium Priority">
                  <Input
                    type="number"
                    min={0}
                    value={editedStats.taskPriorities?.medium || 0}
                    onChange={(e) => setEditedStats({
                      ...editedStats,
                      taskPriorities: {
                        ...(editedStats.taskPriorities || {}),
                        medium: Number(e.target.value)
                      }
                    })}
                  />
                </Form.Item>
                <Form.Item label="Low Priority">
                  <Input
                    type="number"
                    min={0}
                    value={editedStats.taskPriorities?.low || 0}
                    onChange={(e) => setEditedStats({
                      ...editedStats,
                      taskPriorities: {
                        ...(editedStats.taskPriorities || {}),
                        low: Number(e.target.value)
                      }
                    })}
                  />
                </Form.Item>
              </Form>
            ) : (
              <Pie data={{
                labels: ["High", "Medium", "Low"],
                datasets: [{
                  data: [
                    employeeStats.taskPriorities?.high || 0,
                    employeeStats.taskPriorities?.medium || 0,
                    employeeStats.taskPriorities?.low || 0,
                  ],
                  backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"],
                }],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
              />
            )}
          </div>
          <div>
            <h3>Performance Score</h3>
            {isEditingStats ? (
              <Form.Item label="Performance Score">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editedStats.performanceScore}
                  onChange={(e) => setEditedStats({
                    ...editedStats,
                    performanceScore: Number(e.target.value)
                  })}
                />
              </Form.Item>
            ) : (
              <Progress
                type="dashboard"
                percent={employeeStats.performanceScore || 0}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{percent}%</div>
                    <div style={{ fontSize: '12px' }}>Overall Score</div>
                  </div>
                )}
              />
            )}
          </div>
        </div>
      </Card>

      {passbook && (
        <Card title="Basic Information">
          <p>
            <strong>Name:</strong> {passbook.name}
          </p>
          <p>
            <strong>Date of Joining:</strong> {passbook.dateOfJoining}
          </p>
          <p>
            <strong>Department:</strong> {passbook.department}
          </p>
          <p>
            <strong>Position:</strong> {passbook.position}
          </p>
        </Card>
      )}
    </div>
  );

  const renderPassbookContent = () => {
    return (
      <Card title="Employee Passbook">
        <Form
          layout="vertical"
          onFinish={updatePassbook}
          initialValues={passbook}
        >
          <Form.Item name="achievements" label="Achievements">
            <List
              dataSource={passbook?.achievements || []}
              renderItem={(item, index) => (
                <List.Item>
                  <Form.Item
                    name={["achievements", index, "title"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the achievement title!",
                      },
                    ]}
                  >
                    <Input placeholder="Achievement title" />
                  </Form.Item>
                  <Form.Item
                    name={["achievements", index, "date"]}
                    rules={[
                      {
                        required: true,
                        message: "Please select the achievement date!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY"
                      value={dayjs(item.date)}
                      onChange={(date) => {
                        const newAchievements = [...passbook.achievements];
                        newAchievements[index].date = date
                          ? date.toISOString()
                          : null;
                        updatePassbook({
                          ...passbook,
                          achievements: newAchievements,
                        });
                      }}
                    />
                    <p style={{ display: "none", fontSize: 0 }}>{item.date}</p>
                  </Form.Item>
                  <Form.Item
                    name={["achievements", index, "description"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the achievement description!",
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="Achievement description" />
                  </Form.Item>
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      const newAchievements = passbook.achievements.filter(
                        (_, i) => i !== index
                      );
                      updatePassbook({
                        ...passbook,
                        achievements: newAchievements,
                      });
                    }}
                  >
                    Delete
                  </Button>
                </List.Item>
              )}
            />
            <Button
              type="dashed"
              onClick={() => {
                const newAchievements = [
                  ...(passbook?.achievements || []),
                  { title: "", date: null, description: "" },
                ];
                updatePassbook({ ...passbook, achievements: newAchievements });
              }}
              block
            >
              Add Achievement
            </Button>
          </Form.Item>

          <Form.Item name="supportDirectory" label="Support Directory">
            <List
              dataSource={passbook?.supportDirectory || []}
              renderItem={(item, index) => (
                <List.Item>
                  <Form.Item
                    name={["supportDirectory", index, "name"]}
                    rules={[
                      { required: true, message: "Please input the name!" },
                    ]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                  <Form.Item
                    name={["supportDirectory", index, "role"]}
                    rules={[
                      { required: true, message: "Please input the role!" },
                    ]}
                  >
                    <Input placeholder="Role" />
                  </Form.Item>
                  <Form.Item
                    name={["supportDirectory", index, "contact"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the contact information!",
                      },
                    ]}
                  >
                    <Input placeholder="Contact" />
                  </Form.Item>
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      const newSupportDirectory =
                        passbook.supportDirectory.filter((_, i) => i !== index);
                      updatePassbook({
                        ...passbook,
                        supportDirectory: newSupportDirectory,
                      });
                    }}
                  >
                    Delete
                  </Button>
                </List.Item>
              )}
            />
            <Button
              type="dashed"
              onClick={() => {
                const newSupportDirectory = [
                  ...(passbook?.supportDirectory || []),
                  { name: "", role: "", contact: "" },
                ];
                updatePassbook({
                  ...passbook,
                  supportDirectory: newSupportDirectory,
                });
              }}
              block
            >
              Add Support Contact
            </Button>
          </Form.Item>

          <Form.Item name="projectTrackers" label="Project Trackers">
            <List
              dataSource={passbook?.projectTrackers || []}
              renderItem={(item, index) => (
                <List.Item>
                  <Form.Item
                    name={["projectTrackers", index, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the project name!",
                      },
                    ]}
                  >
                    <Input placeholder="Project name" />
                  </Form.Item>
                  <Form.Item
                    name={["projectTrackers", index, "progress"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the project progress!",
                      },
                    ]}
                  >
                    <Progress
                      type="circle"
                      percent={item.progress || 0}
                      format={(percent) => (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={percent}
                          onChange={(e) => {
                            const newProjectTrackers = [
                              ...passbook.projectTrackers,
                            ];
                            newProjectTrackers[index].progress = parseInt(
                              e.target.value
                            );
                            updatePassbook({
                              ...passbook,
                              projectTrackers: newProjectTrackers,
                            });
                          }}
                          style={{ width: 50 }}
                        />
                      )}
                    />
                  </Form.Item>
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      const newProjectTrackers =
                        passbook.projectTrackers.filter((_, i) => i !== index);
                      updatePassbook({
                        ...passbook,
                        projectTrackers: newProjectTrackers,
                      });
                    }}
                  >
                    Delete
                  </Button>
                </List.Item>
              )}
            />
            <Button
              type="dashed"
              onClick={() => {
                const newProjectTrackers = [
                  ...(passbook?.projectTrackers || []),
                  { name: "", progress: 0 },
                ];
                updatePassbook({
                  ...passbook,
                  projectTrackers: newProjectTrackers,
                });
              }}
              block
            >
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
  };

  const renderNotesContent = () => (
    <div>
      <Card title="Active Notes" style={{ marginBottom: 16 }}>
        <List
          dataSource={notes}
          renderItem={(note) => (
            <List.Item
              actions={[
                <Button onClick={() => handleSaveNote(note._id)}>Save</Button>,
                <Button danger onClick={() => handleDeleteNote(note._id)}>
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={note.createdAt}
                description={note.content || "No content"}
              />
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
                <Button
                  type="primary"
                  onClick={() => handleRestoreNote(note._id)}
                >
                  Restore
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={note.createdAt}
                description={note.content || "No content"}
              />
              <Tag color="red">Deleted on {note.deletedAt}</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderTasksContent = () => {
    // Calculate task analytics
    const calculateTaskAnalytics = () => {
      const completedTasks = tasks.completed || [];
      const pendingTasks = tasks.pending || [];

      const onTime = completedTasks.filter(task => 
        new Date(task.completedAt) <= new Date(task.dueDate)
      ).length;

      const delayed = completedTasks.filter(task => 
        new Date(task.completedAt) > new Date(task.dueDate)
      ).length;

      const critical = pendingTasks.filter(task => 
        new Date(task.dueDate) < new Date()
      ).length;

      return { onTime, delayed, critical };
    };

    const taskAnalytics = calculateTaskAnalytics();

    return (
      <div>
        <Card title="Task Analytics" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Bar
                data={{
                  labels: ["On Time", "Delayed", "Critical"],
                  datasets: [
                    {
                      label: "Task Completion Analysis",
                      data: [
                        taskAnalytics.onTime,
                        taskAnalytics.delayed,
                        taskAnalytics.critical
                      ],
                      backgroundColor: ["#52c41a", "#faad14", "#ff4d4f"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Task Completion Analysis'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </Col>
            <Col span={8}>
              <List
                size="small"
                header={<div>Task Statistics</div>}
                bordered
                dataSource={[
                  { title: 'Total Tasks', value: tasks.completed.length + tasks.pending.length },
                  { title: 'Completed Tasks', value: tasks.completed.length },
                  { title: 'Pending Tasks', value: tasks.pending.length },
                  { title: 'On Time Completion', value: `${taskAnalytics.onTime} tasks` },
                  { title: 'Delayed', value: `${taskAnalytics.delayed} tasks` },
                  { title: 'Critical', value: `${taskAnalytics.critical} tasks` },
                ]}
                renderItem={item => (
                  <List.Item>
                    <span>{item.title}:</span>
                    <span style={{ float: 'right' }}>{item.value}</span>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>

        <Card title="Pending Tasks" style={{ marginBottom: 16 }}>
          <List
            dataSource={tasks.pending}
            renderItem={(task) => (
              <List.Item
                actions={[
                  <Tag color={
                    new Date(task.dueDate) < new Date() ? 'red' : 'orange'
                  }>
                    {new Date(task.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                  </Tag>
                ]}
              >
                <List.Item.Meta
                  title={task.title}
                  description={
                    <>
                      <p>{task.description}</p>
                      <p>Due: {task.dueDate}</p>
                      <Tag
                        color={
                          task.priority === "High"
                            ? "red"
                            : task.priority === "Medium"
                            ? "orange"
                            : "green"
                        }
                      >
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
              <List.Item
                actions={[
                  <Tag color={
                    new Date(task.completedAt) <= new Date(task.dueDate) 
                      ? 'green' 
                      : 'orange'
                  }>
                    {new Date(task.completedAt) <= new Date(task.dueDate) 
                      ? 'On Time' 
                      : 'Delayed'}
                  </Tag>
                ]}
              >
                <List.Item.Meta
                  title={task.title}
                  description={
                    <>
                      <p>{task.description}</p>
                      <p>Completed on: {task.completedAt}</p>
                      <p>Due date: {task.dueDate}</p>
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
  };

  return (
    <Layout>
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["information"]}
          onSelect={({ key }) => setActiveTab(key)}
          style={{
            height: "100%",
            borderRight: 0,
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          }}
        >
          <Menu.Item key="information" icon={<InfoCircleOutlined />}>
            Information
          </Menu.Item>
          <Menu.Item key="passbook" icon={<UserOutlined />}>
            Passbook
          </Menu.Item>
          <Menu.Item key="notes" icon={<EditOutlined />}>
            Notes
          </Menu.Item>
          <Menu.Item key="tasks" icon={<ProjectOutlined />}>
            Tasks Overview
          </Menu.Item>
          <Menu.Item key="assignTask" icon={<PlusOutlined />}>
            Assign Task
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: "24px", minHeight: 280, background: "#fff" }}>
        {activeTab === "information" && renderInformationContent()}
        {activeTab === "passbook" && renderPassbookContent()}
        {activeTab === "notes" && renderNotesContent()}
        {activeTab === "tasks" && renderTasksContent()}
        {activeTab === "assignTask" && (
          <Card title="Assign Task">
            <Form layout="vertical" onFinish={assignTask}>
              <Form.Item
                name="title"
                label="Task Title"
                rules={[{ required: true }]}
              >
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Task Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true }]}
              >
                <DatePicker
                  onChange={handleDateChange}
                  value={newTask.dueDate ? new Date(newTask.dueDate) : null}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true }]}
              >
                <Select
                  value={newTask.priority}
                  onChange={(value) =>
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <Option value="Low">Low</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Assign Task
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default AdminEmployeeDashboard;
