import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Input,
  Button,
  List,
  Avatar,
  Progress,
  Tag,
  Tooltip,
  Spin,
  Form,
  Upload,
  Alert,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AuthContext } from "../../context/AuthContext";
import Header from "../Header";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ToolOutlined,
  UserOutlined,
  EditOutlined,
  SettingOutlined,
  CheckOutlined,
  FilePdfOutlined,
  ProjectOutlined,
  CalculatorOutlined,
  CustomerServiceOutlined,
  SaveOutlined,
  TrophyOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import api from "../../utils/api";
import "antd/dist/reset.css";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import CSVReader from "./CSVReader";
import TextEditor from "./TextEditor";
import EmployeeNotesSection from "./EmployeeNotesSection";
import DragAndDropScreen from '../DragAndDropScreen';
import { getProfilePicUrl } from "../../utils/profilePicHelper";
import RoleChecker from "../../Authentication/main";


const { Content, Sider } = Layout;
const { Title, Text } = Typography;

// Define styles at the top of the file, after imports
const COMMON_STYLES = {
  CARD: {
    width: "100%",
    height: "400px",
    marginBottom: 16,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "auto"
  },
  WALLPAPER_CARD: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    height: 'auto',
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }
};

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: "taskOfTheDay", title: "Task of the Day", content: <TaskOfTheDay /> },
    {
      id: "softwareShortcuts",
      title: "Software Shortcuts",
      content: <SoftwareShortcuts />,
    },
    {
      id: "employeePassbook",
      title: "Employee Passbook",
      content: <EmployeePassbook />,
    },
    {
      id: "dragAndDrop",
      title: "Drag and Drop Screen",
      content: <DragAndDropScreen />,
    },
    {
      id: "personalWriting",
      title: "Personal Writing Space",
      content: <NotesSection />,
    },
  ]);
  const [wallpaper, setWallpaper] = useState("default.jpg");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passbook, setPassbook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState(null);
  const [notesPage, setNotesPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const [pageSize] = useState(5);
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
    fetchPassbook();
    fetchNotes();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await api.get("/api/employee/dashboard");
      setUser(response.data);
      setEmail(response.data.email);
      setUsername(response.data.username);
      setProfilePic(response.data.getProfilePicUrl(profilePic));
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to fetch employee data. Please try again.");
    }
  };

  const fetchPassbook = async () => {
    try {
      const response = await api.get("/api/employee/passbook");
      setPassbook(response.data);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching passbook:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get("/api/employee/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    try {
      const response = await api.post("/api/employee/notes", {
        content: newNote,
      });
      setNotes([...notes, response.data]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async (noteId, content) => {
    try {
      const response = await api.put(`/api/employee/notes/${noteId}`, {
        content,
      });
      setNotes(
        notes.map((note) => (note._id === noteId ? response.data : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/api/employee/notes/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleWallpaperChange = (newWallpaper) => {
    setWallpaper(newWallpaper);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("getProfilePicUrl(profilePic)", file);

    try {
      const response = await api.post("/api/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(response.data.getProfilePicUrl(profilePic));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture. Please try again.");
    }
  };

  const handleProfilePicDelete = async () => {
    try {
      await api.delete("/api/users/profile-pic");
      setProfilePic(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Error deleting profile picture. Please try again.");
    }
  };

  const menuItems = [
    { key: "dashboard", icon: <UserOutlined />, label: "Dashboard" },
    { key: "profile", icon: <EditOutlined />, label: "Edit Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "dragAndDrop", icon: <InboxOutlined />, label: "File Transfer" },
  ];

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={!isSidebarOpen}
          onCollapse={(collapsed) => setIsSidebarOpen(!collapsed)}
          style={{ marginTop: "60px" }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            onClick={({ key }) => setActiveTab(key)}
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundImage: `url(/wallpapers/${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Title level={2}>Welcome, {user?.username || "Employee"}</Title>
              {activeTab === "dashboard" && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="widgets">
                    {(provided) => (
                      <Row
                        gutter={[16, 16]}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {widgets.map((widget, index) => (
                          <Draggable
                            key={widget.id}
                            draggableId={widget.id}
                            index={index}
                          >
                            {(provided) => (
                              <Col
                                xs={24}
                                sm={12}
                                lg={8}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  title={widget.title}
                                  style={COMMON_STYLES.CARD}
                                >
                                  {widget.content}
                                </Card>
                              </Col>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Row>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
              {activeTab === "profile" && (
                <Card
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Avatar
                    size={64}
                    src={
                      getProfilePicUrl(profilePic)
                        ? `${process.env.REACT_APP_API_URL}/uploads/${getProfilePicUrl(profilePic)}`
                        : null
                    }
                    icon={<UserOutlined />}
                  />
                  <input
                    type="file"
                    onChange={handleProfilePicUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-pic-upload"
                  />
                  <label htmlFor="profile-pic-upload">
                    <Button
                      icon={<UploadOutlined />}
                      style={{ marginLeft: 16 }}
                    >
                      Upload Picture
                    </Button>
                  </label>
                  {getProfilePicUrl(profilePic) && (
                    <Button
                      onClick={handleProfilePicDelete}
                      style={{ marginLeft: 16 }}
                    >
                      Delete Picture
                    </Button>
                  )}
                  <Title level={4} style={{ marginTop: 16 }}>
                    Profile Information
                  </Title>
                  <Form layout="vertical">
                    <Form.Item
                      label="Username"
                      validateStatus={usernameError ? "error" : ""}
                      help={usernameError}
                    >
                      <Input value={username} onChange={handleUsernameChange} />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      validateStatus={emailError ? "error" : ""}
                      help={emailError}
                    >
                      <Input value={email} onChange={handleEmailChange} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={updateProfile}>
                        Update Profile
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              )}
              <WallpaperSelector onWallpaperChange={handleWallpaperChange} />
              {activeTab === "dragAndDrop" && (
                <div className="drag-and-drop-section">
                  <Title level={3}>File Transfer</Title>
                  <DragAndDropScreen userRole="employee" />
                </div>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
      <RoleChecker userRole={user?.role} userEmail={user?.email}>
      </RoleChecker>
    </Layout>
  );
};

const WallpaperSelector = ({ onWallpaperChange }) => {
  const wallpapers = ["default.jpg", "nature.jpg", "city.jpg", "abstract.jpg"];

  return (
    <Card 
      title="Wallpaper Selection" 
      style={COMMON_STYLES.WALLPAPER_CARD}
    >
      <Row gutter={[8, 8]}>
        {wallpapers.map((wallpaper) => (
          <Col key={wallpaper} span={12}>
            <div 
              style={{
                height: '80px',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
              onClick={() => onWallpaperChange(wallpaper)}
            >
              <img
                src={`/wallpapers/${wallpaper}`}
                alt={wallpaper}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

const TaskOfTheDay = () => {
  const [task, setTask] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get("/api/employee/task-of-the-day");
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task of the day:", error);
      }
    };
    fetchTask();
  }, []);

  const completeTask = async () => {
    if (!task) return;

    setCompleting(true);
    try {
      await api.post(`/api/employee/${task._id}/complete`);
      setTask({ ...task, completed: true });
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setCompleting(false);
    }
  };

  if (!task) return <Spin />;

  return (
    <div>
      <Title level={4}>{task.title}</Title>
      <Text>{task.description}</Text>
      <br />
      <Text type="secondary">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </Text>
      <br />
      <Button
        type="primary"
        icon={<CheckOutlined />}
        onClick={completeTask}
        loading={completing}
        disabled={task.completed}
        style={{ marginTop: 16 }}
      >
        {task.completed ? "Completed" : "Mark as Complete"}
      </Button>
    </div>
  );
};

const SoftwareShortcuts = () => {
  const shortcuts = [
    {
      name: "Office 365",
      icon: <FilePdfOutlined />,
      url: "https://www.office.com",
    },
    {
      name: "Adobe PDF",
      icon: <FilePdfOutlined />,
      url: "https://acrobat.adobe.com",
    },
    {
      name: "Project Management",
      icon: <ProjectOutlined />,
      url: "https://trello.com",
    },
    { name: "Timeclock", icon: <ClockCircleOutlined />, url: "#" },
    { name: "Notepad", icon: <FileTextOutlined />, url: "#" },
    { name: "Calculator", icon: <CalculatorOutlined />, url: "#" },
    { name: "Music Stress Detox", icon: <CustomerServiceOutlined />, url: "#" },
  ];

  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={shortcuts}
      renderItem={(item) => (
        <List.Item>
          <Tooltip title={item.name}>
            <Button
              icon={item.icon}
              onClick={() => window.open(item.url, "_blank")}
              style={{ width: "100%", height: "100%" }}
            />
          </Tooltip>
        </List.Item>
      )}
    />
  );
};

const EmployeePassbook = () => {
  const [passbook, setPassbook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPassbook();
  }, []);

  const fetchPassbook = async () => {
    try {
      const response = await api.get("/api/employee/passbook");
      setPassbook(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching passbook:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  if (!passbook) {
    return <Alert message="Unable to load passbook data" type="error" />;
  }

  return (
    <div>
      <Title level={4}>Recent Achievements</Title>
      <List
        dataSource={passbook.achievements}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<TrophyOutlined />} />}
              title={item.title}
              description={item.date}
            />
          </List.Item>
        )}
      />
      <Title level={4}>Support Directory</Title>
      <List
        dataSource={passbook.supportDirectory}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.name}
              description={`${item.role} - ${item.contact}`}
            />
          </List.Item>
        )}
      />
      <Title level={4}>Project Trackers</Title>
      {passbook.projectTrackers.map((project) => (
        <div key={project.id}>
          <Text>{project.name}</Text>
          <Progress percent={project.progress} status="active" />
        </div>
      ))}
    </div>
  );
};

const PersonalWritingSpace = () => {
  const [notes, setNotes] = useState("");

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <div>
      <Input.TextArea
        rows={4}
        value={notes}
        onChange={handleNotesChange}
        placeholder="Write your personal notes here..."
      />
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={() => {
          /* Save notes logic */
        }}
        style={{ marginTop: 16 }}
      >
        Save Notes
      </Button>
    </div>
  );
};

const NotesSection = () => (
  <div style={{ padding: "24px" }}>
    <EmployeeNotesSection />
  </div>
);

export default EmployeeDashboard;
