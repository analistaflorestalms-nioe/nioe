import React from 'react';
import styled from 'styled-components';

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

const ComingSoon = styled.div`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  padding: 80px 40px;
  text-align: center;
  backdrop-filter: blur(10px);

  h2 {
    color: #00ffff;
    font-size: 24px;
    margin-bottom: 16px;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
  }
`;

const Colaboradores: React.FC = () => {
  return (
    <Container>
      <Header>
        <h1>Colaboradores</h1>
        <p>Análise de background e gestão de colaboradores</p>
      </Header>

      <ComingSoon>
        <h2>🚧 Em Desenvolvimento</h2>
        <p>
          Esta seção incluirá:<br />
          • CRUD completo de colaboradores<br />
          • Workflow de aprovação/rejeição<br />
          • Análise de antecedentes<br />
          • Normalização de CPF, telefone e datas<br />
          • Exportação em PDF, Excel e CSV
        </p>
      </ComingSoon>
    </Container>
  );
};

export default Colaboradores;