import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Input, Space, Spin, Avatar } from 'antd';
import { MessageOutlined, SendOutlined, CloseOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { sendMessageToOpenAI } from '../services/openaiService';
import './ChatButton.css';

const { TextArea } = Input;

const OPENAI_API_KEY = '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';

const ChatButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you with accounting, tax, or business matters today?",
      sender: 'bot'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isModalVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isModalVisible]);

  const showModal = () => {
    setIsModalVisible(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setError(null);
  };

  const handleSend = async () => {
    if (currentMessage.trim() && !isLoading) {
      const userMessage = currentMessage.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setCurrentMessage('');
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendMessageToOpenAI(userMessage, OPENAI_API_KEY);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      } catch (err) {
        setError('Sorry, I encountered an error. Please try again.');
        console.error('Error sending message:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Button
        type="primary"
        className="floating-chat-button"
        icon={<MessageOutlined />}
        onClick={showModal}
      />
      <Modal
        title={
          <div className="chat-header">
            <Space align="center">
              <Avatar icon={<UserOutlined />} className="bot-avatar" />
              <div className="chat-header-text">
                <h3>Nav Accounts Assistant</h3>
              </div>
            </Space>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="chat-modal"
        closeIcon={<CloseOutlined className="close-icon" />}
        width={400}
      >
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <Avatar 
                  icon={message.sender === 'user' ? <UserOutlined /> : <UserOutlined />}
                  className={`message-avatar ${message.sender}-avatar`}
                />
                <div className="message-content">
                  <div className="message-text" style={{ color: message.sender === 'user' ? 'white' : 'black' }}>{message.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <Avatar icon={<UserOutlined />} className="message-avatar bot-avatar" />
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <TextArea
              ref={inputRef}
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!currentMessage.trim() || isLoading}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatButton;
