import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(0, 128, 255, 0.1) 0%, transparent 50%);
  }
`;

const LoginCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(0, 255, 255, 0.1);
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;

    svg {
      margin-right: 12px;
      color: #00ffff;
    }
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #00ffff;
    margin: 0 0 8px;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
  position: relative;

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
  }

  .input-wrapper {
    position: relative;
    
    svg {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      width: 20px;
      height: 20px;
    }
  }

  input {
    width: 100%;
    padding: 16px 16px 16px 48px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 12px;
    color: #fff;
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #00ffff;
      box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.3s ease;

    &:hover {
      color: #00ffff;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #00ffff, #0080ff);
  border: none;
  border-radius: 12px;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) return;
    
    await login({ email, senha });
  };

  return (
    <Container>
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <div className="logo">
            <Shield size={40} />
            <h1>NIOE</h1>
          </div>
          <p>Sistema de Inteligência Operacional Especial</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Lock />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                disabled={isLoading}
              />
            </div>
          </InputGroup>

          <InputGroup>
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <Lock />
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading || !email || !senha}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
        </Form>
      </LoginCard>
    </Container>
  );
};

export default Login;