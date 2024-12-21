import { useState, useEffect } from "react";
import api from "../../utils/api";
import ChatComponent from "./ChatComponent";
import { Row, Col, Card, Tabs, Input, Button, List, Avatar, Badge, Typography, Space, Modal } from "antd";
import { SearchOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const EmployeeChatCenter = ({ employeeData }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    fetchAdminUser();
    fetchAvailableUsers();
  }, []);

  const fetchAdminUser = async () => {
    try {
      const response = await api.get("/api/users/admin");
      setAdminUser(response.data);
    } catch (error) {
      console.error("Error fetching admin user:", error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await api.get("/api/users/available-for-chat");
      setAvailableUsers(response.data);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  };

  const handleChatSelect = (user) => {
    setSelectedUser(user);
    setOpenChats((prev) => ({
      ...prev,
      [user._id]: true,
    }));
    setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
  };

  const handleCloseChat = (userId) => {
    setOpenChats((prev) => ({
      ...prev,
      [userId]: false,
    }));
    if (selectedUser?._id === userId) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="chat-section">
      <Title level={3}>Chat Center</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="users">
              <TabPane tab="Users" key="users">
                <Space style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="Search users..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    value={userSearchTerm}
                  />
                </Space>
                <List
                  dataSource={availableUsers.filter(user =>
                    user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
                  )}
                  renderItem={(user) => (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          icon={<MessageOutlined />}
                          onClick={() => handleChatSelect(user)}
                        >
                          Chat
                          {unreadCounts[user._id] > 0 && (
                            <Badge count={unreadCounts[user._id]} />
                          )}
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={user.username}
                        description={`Role: ${user.role}`}
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="Admin" key="admin">
                {adminUser && (
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={() => handleChatSelect(adminUser)}
                    block
                  >
                    Chat with Admin
                    {unreadCounts[adminUser._id] > 0 && (
                      <Badge count={unreadCounts[adminUser._id]} />
                    )}
                  </Button>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {selectedUser && openChats[selectedUser._id] && (
        <Modal
          visible={true}
          onCancel={() => handleCloseChat(selectedUser._id)}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          <ChatComponent
            currentUser={employeeData}
            otherUser={selectedUser}
            onClose={() => handleCloseChat(selectedUser._id)}
            chatId={`${employeeData._id}-${selectedUser._id}`}
            visible={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default EmployeeChatCenter; 