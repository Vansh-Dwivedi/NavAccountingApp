import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../utils/api';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! How can I help you with accounting, tax, or business matters today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat', { message: input.trim() });
      
      if (response.data.blocked) {
        const blockMessage = {
          type: 'bot',
          content: response.data.reply,
          isBlocked: true
        };
        setMessages(prev => [...prev, blockMessage]);
        // Disable further input
        setIsOpen(false);
      } else if (response.data && response.data.reply) {
        const botMessage = {
          type: 'bot',
          content: response.data.reply
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'bot',
        content: `I apologize, but I'm having trouble responding right now. Please try again later or contact us directly at +1 530-777-3265.`
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: '#002E6D',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
        </svg>
      </Button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '350px',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#002E6D',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={process.env.REACT_APP_API_URL + "/uploads/app-logo.png"}
            alt="App Logo"
            style={{ height: '24px', width: 'auto' }}
          />
          <h3 style={{ margin: 0, color: 'white' }}>Chat with Ivy</h3>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined style={{ color: 'white' }} />}
          onClick={() => setIsOpen(false)}
        />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: '#f5f5f5'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              backgroundColor: msg.type === 'user' ? '#002E6D' : 'white',
              color: msg.type === 'user' ? 'white' : 'black',
              padding: '12px 16px',
              borderRadius: msg.type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
              wordBreak: 'break-word',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'white',
            padding: '12px 16px',
            borderRadius: '12px 12px 12px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        gap: '10px',
        backgroundColor: 'white'
      }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          style={{ 
            flex: 1,
            borderRadius: '20px',
            padding: '8px 16px'
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          style={{ 
            backgroundColor: '#002E6D',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      </div>
    </div>
  );
};

export default ChatButton;
