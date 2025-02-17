import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #B3E3FF;
  overflow: hidden;
  z-index: -1;
`;

const Shape = styled.div`
  position: absolute;
  opacity: 0.1;
  animation: ${float} 6s ease-in-out infinite;
  
  &.shape1 {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.shape2 {
    top: 60%;
    right: 15%;
    animation-delay: 1s;
  }
  
  &.shape3 {
    bottom: 10%;
    left: 20%;
    animation-delay: 2s;
  }

  svg {
    width: 100%;
    height: 100%;
    animation: ${rotate} 20s linear infinite;
  }
`;

const AuthBackground = () => {
  return (
    <Container>
      <Shape className="shape1">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <path fill="#002E6D" d="M50 0 L100 50 L50 100 L0 50 Z" />
        </svg>
      </Shape>
      <Shape className="shape2">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#1890ff" />
        </svg>
      </Shape>
      <Shape className="shape3">
        <svg width="180" height="180" viewBox="0 0 100 100">
          <polygon fill="#002E6D" points="50,0 100,25 100,75 50,100 0,75 0,25" />
        </svg>
      </Shape>
    </Container>
  );
};

export default AuthBackground;
