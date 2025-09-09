import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { AlertTriangle, Users, Newspaper, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { DashboardMetrics } from '../types';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00ffff, #0080ff);
  }

  .metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .title {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .icon {
      padding: 8px;
      background: rgba(0, 255, 255, 0.1);
      border-radius: 8px;
      color: #00ffff;
    }
  }

  .metric-value {
    font-size: 36px;
    font-weight: 700;
    color: #00ffff;
    line-height: 1;
    margin-bottom: 8px;
  }

  .metric-description {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`;

const ChartSection = styled.div`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);

  h3 {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
`;

const Dashboard: React.FC = () => {
  const { data: metrics, isLoading, error } = useQuery<{ data: DashboardMetrics }>(
    'dashboard-metrics',
    async () => {
      const response = await api.get('/metrics/dashboard');
      return response.data;
    },
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <Container>
        <Header>
          <h1>Dashboard</h1>
          <p>Visão geral do sistema NIOE</p>
        </Header>
        <LoadingState>Carregando métricas...</LoadingState>
      </Container>
    );
  }

  if (error || !metrics?.data) {
    return (
      <Container>
        <Header>
          <h1>Dashboard</h1>
          <p>Visão geral do sistema NIOE</p>
        </Header>
        <ErrorState>Erro ao carregar métricas do dashboard</ErrorState>
      </Container>
    );
  }

  const { contadores } = metrics.data;

  return (
    <Container>
      <Header>
        <h1>Dashboard</h1>
        <p>Visão geral do sistema NIOE em tempo real</p>
      </Header>

      <MetricsGrid>
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="metric-header">
            <span className="title">Ocorrências</span>
            <div className="icon">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-value">{contadores.totalOcorrencias}</div>
          <div className="metric-description">
            {contadores.ocorrenciasAbertas} abertas • {contadores.ocorrenciasCriticas} críticas
          </div>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="metric-header">
            <span className="title">Colaboradores</span>
            <div className="icon">
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">{contadores.totalColaboradores}</div>
          <div className="metric-description">
            {contadores.colaboradoresPendentes} pendentes de análise
          </div>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="metric-header">
            <span className="title">Notícias RSS</span>
            <div className="icon">
              <Newspaper size={20} />
            </div>
          </div>
          <div className="metric-value">{contadores.totalNoticias}</div>
          <div className="metric-description">
            {contadores.noticiasRelevantes} de alta relevância
          </div>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="metric-header">
            <span className="title">Sistema</span>
            <div className="icon">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value">Online</div>
          <div className="metric-description">
            Última atualização: {new Date(metrics.data.metadata.ultimaAtualizacao).toLocaleTimeString()}
          </div>
        </MetricCard>
      </MetricsGrid>

      <ChartSection>
        <h3>Análise Detalhada</h3>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '40px' }}>
          Gráficos e análises detalhadas serão implementados aqui
        </div>
      </ChartSection>
    </Container>
  );
};

export default Dashboard;