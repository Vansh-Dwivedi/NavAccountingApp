import { useState, useEffect } from "react";
import api from "../../utils/api";
import ChatComponent from "./ChatComponent";
import { Row, Col, Card, Tabs, Input, Select, Button, Space, Modal, List, Avatar, Badge, Typography } from "antd";
import { SearchOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const ChatCenter = ({ managerData }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminUser, setAdminUser] = useState(null);
  const [assignedClients, setAssignedClients] = useState([]);

  useEffect(() => {
    fetchAdminUser();
    fetchAssignedClients();
  }, []);

  const fetchAdminUser = async () => {
    try {
      const response = await api.get("/api/users/admin");
      setAdminUser(response.data);
    } catch (error) {
      console.error("Error fetching admin user:", error);
    }
  };

  const fetchAssignedClients = async () => {
    try {
      const response = await api.get(
        `/api/users/${managerData._id}/assigned-clients`
      );
      setAssignedClients(response.data);
    } catch (error) {
      console.error("Error fetching assigned clients:", error);
    }
  };

  const handleChatSelect = (user) => {
    setSelectedClient(user);
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
    if (selectedClient?._id === userId) {
      setSelectedClient(null);
    }
  };

  return (
    <div className="chat-section">
      <Title level={3}>Chat Center</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="clients">
              <TabPane tab="Clients" key="clients">
                <Space style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="Search clients..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    value={clientSearchTerm}
                  />
                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by status"
                    onChange={(value) => setStatusFilter(value)}
                    value={statusFilter}
                  >
                    <Option value="all">All Clients</Option>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Space>

                <List
                  dataSource={
                    assignedClients?.filter(
                      (client) =>
                        client.username
                          .toLowerCase()
                          .includes(clientSearchTerm.toLowerCase()) &&
                        (statusFilter === "all" ||
                          client.status === statusFilter)
                    ) || []
                  }
                  renderItem={(client) => (
                    <List.Item
                      key={client._id}
                      actions={[
                        <Button
                          type="primary"
                          icon={<MessageOutlined />}
                          onClick={() => handleChatSelect(client)}
                        >
                          Chat
                          {unreadCounts[client._id] > 0 && (
                            <Badge count={unreadCounts[client._id]} />
                          )}
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={client.username}
                        description={`Status: ${client.status || "Active"}`}
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

      {/* Chat Modals */}
      {selectedClient && openChats[selectedClient._id] && (
        <Modal
          visible={true}
          onCancel={() => handleCloseChat(selectedClient._id)}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          <ChatComponent
            currentUser={managerData}
            otherUser={selectedClient}
            onClose={() => handleCloseChat(selectedClient._id)}
            chatId={`${managerData._id}-${selectedClient._id}`}
            visible={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChatCenter;