import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ocorrencias from './pages/Ocorrencias';
import Colaboradores from './pages/Colaboradores';
import Noticias from './pages/Noticias';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ocorrencias" element={<Ocorrencias />} />
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;