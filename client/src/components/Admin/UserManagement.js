import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Avatar,
  Tooltip,
  Modal,
  Pagination,
  message,
  Checkbox,
} from "antd";
import {
  DeleteOutlined,
  StopOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import api from "../../utils/api";
import ChatComponent from "../Chat/ChatComponent";

const { Search } = Input;
const { Option } = Select;

const UserManagement = ({ adminData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assignModalType, setAssignModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalManagers, setTotalManagers] = useState(0);
  const [openChats, setOpenChats] = useState({});
  const [visibleColumns, setVisibleColumns] = useState([
    "profilePic",
    "username",
    "email",
    "role",
    "status",
    "assignedManager",
    "assignedClients",
    "assignManager",
    "actions",
  ]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchManagers();
    fetchClients();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(
        response.data.map((user) => ({
          ...user,
          key: user._id,
          assignedManager: user.assignedManager?.username
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/api/users/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchManagers = async (page = 1) => {
    try {
      const response = await api.get("/api/users/managers");
      setAvailableManagers(response.data.managers);
      setTotalManagers(response.data.total);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = users.filter((user) => user.role === "client");
      setAvailableClients(
        response.map((client) => ({
          ...client,
          managerName: client.assignedManager
            ? client.assignedManager.username
            : "Unassigned",
        }))
      );
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/users/update-role/${userId}`, { role: newRole });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const action = isBlocked ? "unblock" : "block";
      await api.put(`/api/users/${userId}/${action}`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error(
        `Error ${isBlocked ? "unblocking" : "blocking"} user:`,
        error
      );
    }
  };

  const showAssignModal = (type, user) => {
    setAssignModalType(type);
    setSelectedUser(user);
    setIsAssignModalVisible(true);
    if (type === "manager") {
      fetchManagers();
    }
  };

  const handleAssign = async (assigneeId) => {
    try {
      if (assignModalType === "manager") {
        await api.put(`/api/users/${selectedUser._id}/assign-manager`, {
          managerId: assigneeId,
        });
      } else {
        await api.put(`/api/users/${selectedUser._id}/assign-client`, {
          clientId: assigneeId,
        });
      }
      setIsAssignModalVisible(false);
      fetchUsers(); // Refresh the user list
      message.success(`${assignModalType} assigned successfully`);
    } catch (error) {
      console.error(`Error assigning ${assignModalType}:`, error);
      message.error(`Failed to assign ${assignModalType}`);
    }
  };

  const handleChat = (userId) => {
    setOpenChats((prevChats) => ({
      ...prevChats,
      [userId]: true,
    }));
  };

  const assignManagerToClient = async (clientId, managerId) => {
    try {
      await api.post(`/api/users/${managerId}/assign-client`, { clientId });
      message.success("Manager assigned successfully");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error assigning manager to client:", error);
      message.error("Failed to assign manager");
    }
  };

  const handleCloseChat = (userId) => {
    setOpenChats((prevChats) => ({
      ...prevChats,
      [userId]: false,
    }));
  };

  const handleColumnVisibilityChange = (checkedValues) => {
    setVisibleColumns(checkedValues);
  };

  const columns = [
    {
      title: "Profile",
      dataIndex: "profilePic",
      key: "profilePic",
      render: (text, record) => (
        <Avatar
          src={
            record.profilePic
              ? `${process.env.REACT_APP_API_URL}/uploads/${record.profilePic}`
              : "/default-avatar.png"
          }
        />
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record._id, value)}
        >
          {roles.map((role) => (
            <Option key={role} value={role}>
              {role}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "isBlocked",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Assigned Manager",
      key: "assignedManager",
      dataIndex: "assignedManager",
      render: (text, record) =>
        record.role === "client" ? (
          text ? (
            text
          ) : (
            <Tag color="red">
              <ExclamationCircleOutlined /> Not Assigned
            </Tag>
          )
        ) : null,
    },
    {
      title: "Assigned Clients",
      key: "assignedClients",
      dataIndex: "assignedClients",
      render: (clients, record) =>
        record.role === "manager" ? (
          <Button onClick={() => fetchAssignedClients(record._id)}>
            View Assigned Clients
          </Button>
        ) : (
          <Tag color="red">
            <ExclamationCircleOutlined /> N/A
          </Tag>
        ),
    },
    {
      title: "Assign Manager",
      key: "assignManager",
      render: (text, record) =>
        record.role === "client" ? (
          <Select
            style={{ width: 120 }}
            placeholder="Select Manager"
            onChange={(value) => assignManagerToClient(record._id, value)}
          >
            {users
              .filter((user) => user.role === "manager")
              .map((manager) => (
                <Option key={manager._id} value={manager._id}>
                  {manager.username}
                </Option>
              ))}
          </Select>
        ) : null,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteUser(record._id)}
            />
          </Tooltip>
          <Tooltip title={record.isBlocked ? "Unblock" : "Block"}>
            <Button
              icon={<StopOutlined />}
              onClick={() => handleBlockUser(record._id, record.isBlocked)}
            />
          </Tooltip>
          {record.role === "manager" && (
            <Tooltip title="Assign Clients">
              <Button
                icon={<UsergroupAddOutlined />}
                onClick={() => showAssignModal("client", record)}
              />
            </Tooltip>
          )}
          <Tooltip title="Chat">
            <Button
              icon={<MessageOutlined />}
              onClick={() => handleChat(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const fetchAssignedClients = async (managerId) => {
    try {
      const response = await api.get(
        `/api/users/${managerId}/assigned-clients`
      );
      const assignedClients = response.data;
      Modal.info({
        title: "Assigned Clients",
        content: (
          <div>
            {assignedClients.length ? (
              assignedClients.map((client) => (
                <p key={client._id}>{client.username}</p>
              ))
            ) : (
              <Tag color="red">
                <ExclamationCircleOutlined /> N/A
              </Tag>
            )}
          </div>
        ),
        onOk() {},
      });
    } catch (error) {
      console.error("Error fetching assigned clients:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" ||
        (statusFilter === "Active" && !user.isBlocked) ||
        (statusFilter === "Blocked" && user.isBlocked))
  );

  return (
    <div style={{ padding: "24px" }}>
      <h1>User Management</h1>
      <Space style={{ marginBottom: 16 }} direction="vertical">
        <Space>
          <Search
            placeholder="Search users"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Select
            defaultValue="All"
            style={{ width: 120 }}
            onChange={(value) => setRoleFilter(value)}
          >
            <Option value="All">All Roles</Option>
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
          <Select
            defaultValue="All"
            style={{ width: 120 }}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="All">All Statuses</Option>
            <Option value="Active">Active</Option>
            <Option value="Blocked">Blocked</Option>
          </Select>
        </Space>
        <Checkbox.Group
          options={columns.map((col) => ({ label: col.title, value: col.key }))}
          defaultValue={visibleColumns}
          onChange={handleColumnVisibilityChange}
        />
      </Space>
      <Table
        columns={columns.filter((col) => visibleColumns.includes(col.key))}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
      />
      <Modal
        title={`Assign ${assignModalType === "manager" ? "Manager" : "Client"}`}
        visible={isAssignModalVisible}
        onCancel={() => setIsAssignModalVisible(false)}
        footer={null}
      >
        {assignModalType === "manager" ? (
          <>
            <Table
              dataSource={availableManagers}
              columns={[
                { title: "Username", dataIndex: "username", key: "username" },
                { title: "Email", dataIndex: "email", key: "email" },
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <Button onClick={() => handleAssign(record._id)}>
                      Assign
                    </Button>
                  ),
                },
              ]}
              pagination={false}
            />
            <Pagination
              total={totalManagers}
              pageSize={pageSize}
              current={currentPage}
              onChange={(page) => {
                setCurrentPage(page);
                fetchManagers(page);
              }}
              style={{ marginTop: "16px", textAlign: "right" }}
            />
          </>
        ) : (
          <Select
            style={{ width: "100%" }}
            placeholder="Select a client"
            onChange={handleAssign}
          >
            {availableClients.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.username}
              </Option>
            ))}
          </Select>
        )}
      </Modal>
      {Object.entries(openChats).map(([userId, isOpen]) => {
        if (!isOpen) return null;
        const user = users.find((u) => u._id === userId);
        if (!user) return null;
        return (
          <ChatComponent
            key={userId}
            currentUser={adminData}
            otherUser={user}
            onClose={() => handleCloseChat(userId)}
            chatId={`${adminData._id}-${userId}`}
            visible={isOpen}
          />
        );
      })}
    </div>
  );
};

export default UserManagement;
