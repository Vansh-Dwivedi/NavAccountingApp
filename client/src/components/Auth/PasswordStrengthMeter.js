import React from 'react';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { checkPasswordStrength } from '../../utils/passwordStrength';

const PasswordStrengthMeter = ({ password }) => {
  const strength = checkPasswordStrength(password);
  
  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Progress bar */}
      <div style={{ 
        height: '4px', 
        background: '#f0f0f0', 
        marginBottom: '10px',
        borderRadius: '2px'
      }}>
        <div style={{
          width: `${strength.score * 20}%`,
          height: '100%',
          background: strength.color,
          transition: 'width 0.3s ease',
          borderRadius: '2px'
        }} />
      </div>

      {/* Strength Label */}
      <div style={{ 
        color: strength.color, 
        marginBottom: '10px',
        fontSize: '14px'
      }}>
        Password Strength: {strength.label}
      </div>

      {/* Requirements List */}
      <div>
        {strength.criteria.map((criterion, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '8px',
            color: criterion.met ? '#52c41a' : '#ff4d4f',
            fontSize: '14px'
          }}>
            {criterion.met ? (
              <CheckCircleFilled style={{ marginRight: '8px' }} />
            ) : (
              <CloseCircleFilled style={{ marginRight: '8px' }} />
            )}
            <span style={{ color: '#333' }}>{criterion.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
