import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 255, 255, 0.3);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Text = styled.p`
  color: #00ffff;
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <Container>
      <div>
        <Spinner />
        <Text>Carregando NIOE...</Text>
      </div>
    </Container>
  );
};

export default LoadingSpinner;