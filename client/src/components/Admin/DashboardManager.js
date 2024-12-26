// client/src/components/Admin/DashboardManager.js
import React, { useState, useEffect } from "react";
import { Card, Select, Tree, Switch, Button, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../../utils/api";

const { Option } = Select;

const DashboardManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dashboardConfig, setDashboardConfig] = useState({
    enabledComponents: [],
    tabs: [],
    componentsInTabs: {},
  });

  const availableComponents = {
    client: [
      { key: "dashboard", label: "Dashboard Overview" },
      { key: "submitInfo", label: "Submit Information" },
      { key: "notesAndSignatures", label: "Notes & Signatures" },
      { key: "dragAndDrop", label: "File Transfer" },
      { key: "forms", label: "Forms" },
      { key: "chat", label: "Chat" },
      { key: "financialInfo", label: "Financial Information" },
      { key: "personnelSettings", label: "Personnel Settings" },
    ],
    employee: [
      { key: "dashboard", label: "Dashboard" },
      { key: "profile", label: "Edit Profile" },
      { key: "settings", label: "Settings" },
      { key: "dragAndDrop", label: "File Transfer" },
      { key: "personnelSettings", label: "Personnel Settings" },
      { key: "chatCenter", label: "Chat Center"},
    ],
    manager: [
      { key: "dashboard", label: "Dashboard" },
      { key: "chat", label: "Chat Center" },
      { key: "clientData", label: "Client Data" },
      { key: "forms", label: "Forms" },
      { key: "dragAndDrop", label: "File Transfer" },
    ],
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    }
  };

  const fetchUserDashboardConfig = async (userId) => {
    try {
      const response = await api.get(
        `/api/dashboard-management/${userId}/dashboard-config`
      );
      setDashboardConfig(response.data);
    } catch (error) {
      console.error("Error fetching dashboard config:", error);
      message.error("Failed to fetch dashboard configuration");
    }
  };

  const handleUserSelect = (userId) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
    fetchUserDashboardConfig(userId);
  };

  const handleComponentToggle = async (componentKey, enabled) => {
    try {
      const response = await api.put(
        `/api/dashboard-management/${selectedUser._id}/dashboard-components`,
        {
          component: componentKey,
          enabled,
        }
      );
      
      // Update both dashboardConfig and user states
      setDashboardConfig(prev => ({
        ...prev,
        enabledComponents: response.data.config.enabledComponents,
      }));

      // Update the users array with new dashboardComponents
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === selectedUser._id
            ? { ...user, dashboardComponents: response.data.user.dashboardComponents }
            : user
        )
      );

      // Update selectedUser if it exists
      if (selectedUser) {
        setSelectedUser(prev => ({
          ...prev,
          dashboardComponents: response.data.user.dashboardComponents
        }));
      }

      message.success('Dashboard components updated successfully');
    } catch (error) {
      console.error('Error updating dashboard components:', error);
      message.error('Failed to update dashboard components');
    }
  };

  const handleTabsReorder = async (result) => {
    if (!result.destination) return;

    const items = Array.from(dashboardConfig.tabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      const response = await api.put(
        `/api/dashboard-management/${selectedUser._id}/dashboard-tabs`,
        {
          tabs: items,
        }
      );
      setDashboardConfig((prev) => ({
        ...prev,
        tabs: response.data.tabs,
      }));
      message.success("Tabs reordered successfully");
    } catch (error) {
      console.error("Error reordering tabs:", error);
      message.error("Failed to reorder tabs");
    }
  };

  return (
    <Card title="Dashboard Manager">
      <Select
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Select a user"
        onChange={handleUserSelect}
      >
        {users.filter(user => user.role !== 'admin').map((user) => (
          <Option key={user._id} value={user._id}>
            {user.username} ({user.role})
          </Option>
        ))}
      </Select>

      {selectedUser && (
        <>
          <Card title="Available Components" style={{ marginTop: 16 }}>
            {availableComponents[selectedUser.role]?.map((component) => (
              <div key={component.key} style={{ marginBottom: 8 }}>
                <Switch
                  checked={dashboardConfig.enabledComponents.includes(
                    component.key
                  )}
                  onChange={(checked) =>
                    handleComponentToggle(component.key, checked)
                  }
                />
                <span style={{ marginLeft: 8 }}>{component.label}</span>
              </div>
            ))}
          </Card>

          <Card title="Tab Order" style={{ marginTop: 16 }}>
            <DragDropContext onDragEnd={handleTabsReorder}>
              <Droppable droppableId="tabs">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {dashboardConfig.tabs.map((tab, index) => (
                      <Draggable
                        key={tab.key}
                        draggableId={tab.key}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: 8,
                              marginBottom: 8,
                              backgroundColor: "#f5f5f5",
                              borderRadius: 4,
                              ...provided.draggableProps.style,
                            }}
                          >
                            {tab.label}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </>
      )}
    </Card>
  );
};

export default DashboardManager;