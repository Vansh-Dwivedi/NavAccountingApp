import React, { useState } from 'react';
import { Card, Statistic, Input, Button, message, Space, InputNumber } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const EditableStatistic = ({ title, value, prefix, suffix, precision, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = async () => {
    try {
      await onSave(editValue);
      setIsEditing(false);
      message.success(`${title} updated successfully`);
    } catch (error) {
      message.error(`Failed to update ${title}`);
    }
  };

  return (
    <Card 
      extra={
        isEditing ? (
          <>
            <Button 
              icon={<SaveOutlined />} 
              type="link" 
              onClick={handleSave}
            />
            <Button 
              icon={<CloseOutlined />} 
              type="link" 
              onClick={() => setIsEditing(false)}
            />
          </>
        ) : (
          <Button 
            icon={<EditOutlined />} 
            type="link" 
            onClick={() => setIsEditing(true)}
          />
        )
      }
    >
      {isEditing ? (
        <InputNumber
          defaultValue={value}
          onChange={setEditValue}
          prefix={prefix}
          suffix={suffix}
          precision={precision}
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            precision={precision}
          />
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => setIsEditing(true)}
            />
            {onDelete && (
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={onDelete}
              />
            )}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default EditableStatistic; 