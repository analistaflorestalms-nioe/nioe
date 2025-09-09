import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  AlertTriangle,
  Users,
  Newspaper,
  LogOut,
  Settings,
  Activity
} from 'lucide-react';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`;

const Sidebar = styled(motion.aside)`
  width: 280px;
  background: rgba(26, 26, 26, 0.9);
  border-right: 1px solid rgba(0, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  padding: 24px 0;
`;

const Logo = styled.div`
  padding: 0 24px 32px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    margin: 0;
  }

  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin: 4px 0 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0 16px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 16px 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    transform: translateX(4px);
  }

  &.active {
    background: linear-gradient(90deg, rgba(0, 255, 255, 0.2), transparent);
    color: #00ffff;
    border-left: 3px solid #00ffff;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 2px;
      background: #00ffff;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    }
  }

  svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }

  span {
    font-weight: 500;
    font-size: 14px;
  }
`;

const UserSection = styled.div`
  padding: 24px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00ffff, #0080ff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-weight: 600;
    margin-right: 12px;
  }

  .info {
    flex: 1;

    .name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 2px;
    }

    .role {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: capitalize;
    }
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: #ff6b6b;
  }

  svg {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ocorrencias', label: 'Ocorrências', icon: AlertTriangle },
    { path: '/colaboradores', label: 'Colaboradores', icon: Users },
    { path: '/noticias', label: 'Notícias RSS', icon: Newspaper },
  ];

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <Container>
      <Sidebar
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Logo>
          <h1>NIOE</h1>
          <p>Inteligência Operacional</p>
        </Logo>

        <Nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <Icon />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </Nav>

        <UserSection>
          <UserInfo>
            <div className="avatar">
              {user ? getUserInitials(user.nome) : 'U'}
            </div>
            <div className="info">
              <div className="name">{user?.nome}</div>
              <div className="role">{user?.role} • {user?.filial}</div>
            </div>
          </UserInfo>

          <LogoutButton onClick={logout}>
            <LogOut />
            Sair
          </LogoutButton>
        </UserSection>
      </Sidebar>

      <Main className="animate-fade-in">
        {children}
      </Main>
    </Container>
  );
};

export default Layout;