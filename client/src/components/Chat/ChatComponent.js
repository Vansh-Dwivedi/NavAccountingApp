import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { getSocket } from "../../utils/socket";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaFileAlt, FaPaperPlane } from "react-icons/fa";
import {
  Modal,
  Input,
  Button,
  Upload,
  List,
  Avatar,
  Select,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const ChatComponent = ({
  visible,
  currentUser,
  otherUser,
  onClose,
  chatId,
}) => {
  const { user: authUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState("All");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [detailedSearchParams, setDetailedSearchParams] = useState({
    keyword: "",
    startDate: null,
    endDate: null,
    fileType: "All",
    sortBy: "date",
    sortOrder: "asc",
  });
  const [size, setSize] = useState({ width: 600, height: 700 });
  const chatMessagesRef = useRef(null);
  const [senderProfilePic, setSenderProfilePic] = useState(null);
  const [otherUserProfilePic, setOtherUserProfilePic] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  const fetchMessages = useCallback(async (chatId, pageNumber) => {
    if (!chatId) return;
    try {
      setLoading(true);
      const response = await api.get(`/api/chat/messages/${chatId}`);
      setTotalPages(response.data.totalPages);
      setMessages((prevMessages) => [
        ...response.data.messages,
      ]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (!visible || !currentUser || !otherUser) return;

    const socketInstance = getSocket();
    setSocket(socketInstance);

    socketInstance.emit("join", currentUser._id);

    const handleNewMessage = (newMessage) => {
      addMessage(newMessage);
      if (newMessage.sender !== currentUser._id) {
        toast.info(`New message from ${otherUser.username}`, {
          toastId: newMessage._id,
        });
      }
    };

    socketInstance.on("newMessage", handleNewMessage);

    const constructedChatId = `${currentUser._id}-${otherUser._id}`;
    fetchMessages(constructedChatId, 1);

    fetchProfilePics();
    fetchCategories();

    return () => {
      socketInstance.off("newMessage", handleNewMessage);
    };
  }, [visible, currentUser, otherUser, addMessage, fetchMessages, fetchProfilePics, fetchCategories]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchProfilePics = async () => {
    try {
      const currentUserResponse = await api.get(
        `/api/users/profile/${currentUser._id}`
      );
      setSenderProfilePic(currentUserResponse.data.profilePic);

      const otherUserResponse = await api.get(
        `/api/users/profile/${otherUser._id}`
      );
      setOtherUserProfilePic(otherUserResponse.data.profilePic);
    } catch (error) {
      console.error("Error fetching profile pictures:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories"); // Ensure this endpoint exists
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = ({ file }) => {
    setFile(file.originFileObj);
    setInputMessage(file.originFileObj ? file.originFileObj.name : "");
  };

  const removeSelectedFile = () => {
    setFile(null);
    setFileType("");
    setInputMessage("");
  };

  const sendMessage = async () => {
    if (!inputMessage && !file) return;

    try {
      let response;
      if (!file) {
        response = await api.post("/api/chat/send", {
          message: inputMessage,
          receiver: otherUser._id,
          sender: currentUser._id,
        });
      } else {
        const formData = new FormData();
        formData.append("message", inputMessage || file.name);
        formData.append("receiver", otherUser._id);
        formData.append("sender", currentUser._id);
        formData.append("file", file);
        formData.append("fileType", fileType || "File"); // Include fileType

        response = await api.post("/api/chat/send-with-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      addMessage(response.data);
      setInputMessage("");
      setFile(null);
      setFileType("");

      if (socket) {
        socket.emit("sendMessage", response.data);
      }

      // Scroll to bottom after sending message
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.error || "Error sending message");
    }
  };

  const handleFilterChange = (value) => {
    setFileTypeFilter(value);
  };

  useEffect(() => {
    setFilteredMessages(
      fileTypeFilter === "All"
        ? messages
        : messages.filter((msg) => msg.fileType === fileTypeFilter)
    );
  }, [fileTypeFilter, messages]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = messages.filter(
      (msg) =>
        msg.content.toLowerCase().includes(e.target.value.toLowerCase()) ||
        (msg.file &&
          msg.file.originalName
            .toLowerCase()
            .includes(e.target.value.toLowerCase()))
    );
    setFilteredMessages(filtered);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortMessages([...filteredMessages], value, newSortOrder);
    setFilteredMessages(sorted);
  };

  const sortMessages = (messages, sortBy, sortOrder) => {
    return messages.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === "fileType") {
        if (a.fileType && b.fileType) {
          return sortOrder === "asc"
            ? a.fileType.localeCompare(b.fileType)
            : b.fileType.localeCompare(a.fileType);
        }
        return a.fileType ? -1 : b.fileType ? 1 : 0;
      }
      return 0;
    });
  };

  const performDetailedSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/chat/search", {
        params: {
          chatId,
          ...detailedSearchParams,
        },
      });
      let sortedMessages = sortMessages(
        response.data.messages,
        sortBy,
        sortOrder
      );
      setFilteredMessages(sortedMessages);
      toast.success("Search completed!");
    } catch (error) {
      console.error("Error performing detailed search:", error);
      toast.error("Failed to perform detailed search");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent automatic upload
    onChange: handleFileChange,
    multiple: false,
    showUploadList: false,
  };

  const loadMoreMessages = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(chatId, nextPage);
    }
  };
  
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={isFullscreen ? "100%" : size.width}
      bodyStyle={
        isFullscreen
          ? { height: "100vh", padding: 0 }
          : { height: size.height, padding: 0 }
      }
      closable={false}
      maskClosable={false}
      className={`chat-modal ${isFullscreen ? "fullscreen-modal" : ""}`}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div
          style={{
            background: "#001529",
            color: "#fff",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={
                otherUserProfilePic
                  ? `${process.env.REACT_APP_API_URL}/uploads/${otherUserProfilePic}`
                  : null
              }
              icon={
                !otherUserProfilePic && (
                  <div
                    style={{
                      backgroundColor: "#808080",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <UserOutlined />
                  </div>
                )
              }
              size="small"
            />
            <span style={{ marginLeft: 10, fontSize: 18 }}>
              Chat with {otherUser.username}
            </span>
          </div>
          <div>
            <Tooltip title="Search Messages">
              <Button
                icon={<SearchOutlined />}
                style={{ marginRight: 8 }}
                onClick={() => {}}
              />
            </Tooltip>
            <Tooltip title="Filter Messages">
              <Select
                value={fileTypeFilter}
                onChange={handleFilterChange}
                style={{ width: 150, marginRight: 8 }}
                placeholder="Filter by File Type"
              >
                <Option value="All">All</Option>
                <Option value="Tax File">Tax File</Option>
                <Option value="Payroll File">Payroll File</Option>
                <Option value="Compliance File">Compliance File</Option>
                <Option value="File">File</Option>
              </Select>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <Button
                icon={
                  isFullscreen ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
                onClick={toggleFullscreen}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
            <Tooltip title="Close Chat">
              <Button icon={<CloseOutlined />} onClick={onClose} danger />
            </Tooltip>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "10px 20px", background: "#f0f2f5" }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search messages..."
            value={searchTerm}
            onChange={handleSearch}
            allowClear
          />
        </div>

        {/* Messages */}
        <div
          ref={chatMessagesRef}
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            background: "#e6f7ff",
          }}
        >
          {page < totalPages && (
            <Button
              onClick={loadMoreMessages}
              loading={loading}
              style={{ marginBottom: 10 }}
              block
            >
              Load More
            </Button>
          )}
          <List
            dataSource={filteredMessages}
            renderItem={(msg) => {
              const isCurrentUser = msg.sender._id === currentUser._id;
              return (
                <List.Item
                  key={msg._id}
                  style={{
                    justifyContent: isCurrentUser
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      background: isCurrentUser ? "#1890ff" : "#fff",
                      color: isCurrentUser ? "#fff" : "#000",
                      padding: "10px",
                      borderRadius: 10,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <Avatar
                        src={
                          msg.sender.profilePic
                            ? `${process.env.REACT_APP_API_URL}/uploads/${msg.sender.profilePic}`
                            : null
                        }
                        icon={<UserOutlined />}
                        size="small"
                      />
                      <span style={{ marginLeft: 8 }}>
                        {msg.sender.username}
                      </span>
                    </div>
                    <div style={{ fontSize: 19.5 }}>{msg.content}</div>
                    {msg.file && (
                      <div style={{ marginTop: 10 }}>
                        <FaFileAlt />{" "}
                        <a
                          href={`${process.env.REACT_APP_API_URL}/uploads/${msg.file.filename}`}
                          download={msg.file.originalName}
                          style={{
                            color: isCurrentUser ? "#fff" : "#1890ff",
                          }}
                        >
                          {msg.file.originalName}
                        </a>
                      </div>
                    )}
                    <Divider
                      style={{
                        margin: "8px 0",
                        borderColor: isCurrentUser ? "#fff" : "#d9d9d9",
                      }}
                    />
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "0.8em",
                        marginTop: 5,
                      }}
                    >
                      {moment(msg.timestamp).format("MMM DD, YYYY h:mm A")}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div style={{ padding: "10px 20px", background: "#f0f2f5" }}>
          <Input.Group compact>
            <Upload {...uploadProps} showUploadList={false} multiple={false}>
              <Button icon={<UploadOutlined />}>Attach</Button>
            </Upload>
            {file && (
              <>
                <Select
                  value={fileType}
                  onChange={(value) => setFileType(value)}
                  style={{ width: 150, marginRight: 8 }}
                  placeholder="Select file type"
                  required
                >
                  {categories.map((category) => (
                    <Option key={category.name} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    padding: "0 10px",
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                >
                  <span
                    style={{
                      marginRight: 8,
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </span>
                  <DeleteOutlined
                    onClick={removeSelectedFile}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                </div>
              </>
            )}
            <TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ width: "60%", marginRight: 8 }}
            />
            <Button
              type="primary"
              icon={<FaPaperPlane />}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Input.Group>
        </div>
      </div>
    </Modal>
  );
};

export default ChatComponent;
