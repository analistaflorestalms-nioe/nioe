# NIOE MVP

## Visão Geral

Este é o repositório MVP do projeto NIOE, contendo a estrutura inicial para desenvolvimento de uma aplicação full-stack com TypeScript.

## Estrutura do Projeto

```
nioe-mvp/
├── frontend/          # Aplicação React/Next.js
├── backend/           # API Node.js/Express
├── docker-compose.yml # Configuração dos serviços
├── .env.example      # Variáveis de ambiente de exemplo
└── README.md         # Este arquivo
```

## Tecnologias

- **Frontend**: TypeScript, React/Next.js
- **Backend**: TypeScript, Node.js, Express
- **Database**: PostgreSQL 15
- **Storage**: MinIO
- **Containerização**: Docker & Docker Compose
- **Database Admin**: Adminer

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Git

## Configuração Inicial

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd nioe-mvp
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Inicie os serviços**
   ```bash
   docker-compose up -d
   ```

## Serviços Disponíveis

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **MinIO Console**: http://localhost:9001
- **Adminer**: http://localhost:8080

## Desenvolvimento

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm start` - Inicia o servidor de produção

### Backend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor de produção

## Estrutura de Branches

- `main` - Branch principal
- `init-project-scaffold` - Scaffold inicial do projeto

## Próximos Passos

1. Implementar autenticação JWT
2. Configurar rotas da API
3. Implementar interface do usuário
4. Configurar integração com APIs externas
5. Implementar testes unitários e de integração

## Contribuição

1. Crie uma branch para sua feature
2. Faça suas alterações
3. Teste localmente
4. Abra um Pull Request

## Licença

[Adicionar licença conforme necessário]
