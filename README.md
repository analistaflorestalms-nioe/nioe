# NIOE - Sistema de Inteligência Operacional Especial

Sistema completo de inteligência operacional desenvolvido com tecnologias modernas para apresentação executiva e uso operacional.

## 🚀 Tecnologias

### Backend
- **Node.js** + Express + TypeScript
- **PostgreSQL** com Sequelize ORM
- **Redis** para cache e rate limiting
- **JWT** para autenticação
- **RSS Parser** para ingestão automática de notícias
- **Socket.IO** para comunicação em tempo real
- **Winston** para logging estruturado

### Frontend
- **React 18** + TypeScript
- **Styled Components** com tema futurista
- **Framer Motion** para animações
- **React Router** para navegação
- **React Query** para gerenciamento de estado
- **Axios** com interceptors
- **React-Leaflet** para mapas interativos

### Infraestrutura
- **Docker** + Docker Compose
- **PostgreSQL 15** Alpine
- **Redis 7** Alpine
- **Multi-stage builds** para otimização

## 📋 Funcionalidades Implementadas

### ✅ Autenticação e Segurança
- Login com JWT e controle de tentativas
- Bloqueio temporário após 5 tentativas
- Middleware de autenticação com roles (admin/analista)
- CORS, Helmet, XSS protection, rate limiting

### ✅ Dashboard em Tempo Real
- Métricas dinâmicas de ocorrências, colaboradores e notícias
- Contadores e distribuições por filial
- Atualização automática a cada 30 segundos
- Interface responsiva com tema dark futurista

### ✅ API REST Completa
- **`/api/auth`** - Login, logout, verificação de token
- **`/api/ocorrencias`** - CRUD com filtros avançados
- **`/api/colaboradores`** - CRUD com workflow de aprovação
- **`/api/noticias`** - Listagem de notícias RSS
- **`/api/metrics/dashboard`** - Métricas em tempo real

### ✅ Ingestão RSS Automática
- Coleta de 6 fontes de notícias (G1, UOL, Band, InfoMoney, Valor, TecMundo)
- Análise inteligente de relevância por palavras-chave
- Categorização automática (incêndio, segurança, ambiental, etc.)
- Execução a cada 30 minutos com logging detalhado
- Deduplicação por URL

### ✅ Interface Moderna
- Tema dark com gradientes e efeitos neon
- Animações suaves com Framer Motion
- Sidebar navegação com estados ativos
- Notificações toast para feedback
- Layout responsivo

## 🗃️ Modelos de Dados

### User
- id (UUID), nome, email, senha (bcrypt)
- role (admin/analista), filial (SP/PORTO-SP/MS/BA)
- tentativas_login, bloqueado_ate
- timestamps + soft delete

### Ocorrencia
- id (UUID), titulo, descricao
- tipo (segurança, acidente, incêndio, etc.)
- prioridade (crítica, alta, média, baixa)
- status (aberta, em_andamento, resolvida, cancelada)
- coordenadas geográficas, anexos JSONB

### Colaborador
- id (UUID), dados pessoais completos
- tipo_contrato (orgânico/terceirizado)
- status de aprovação com workflow
- análise de antecedentes, referências

### Noticia
- id (UUID), título, conteúdo, URL única
- fonte, categoria, relevância
- tags automáticas, data de publicação

## 🐳 Como Executar

```bash
# Clonar repositório
git clone <repo-url>
cd nioe

# Iniciar sistema completo
docker compose up -d

# Acessar aplicação
Frontend: http://localhost:3000
Backend: http://localhost:3001
```

### Credenciais Demo
- **Email:** g.silva@nioe.com
- **Senha:** nioe123
- **Role:** analista
- **Filial:** MS

### Variáveis de Ambiente
```env
NODE_ENV=development
PORT=3001
DB_HOST=postgres
DB_NAME=nioe_db
DB_USER=nioe_user
DB_PASSWORD=nioe123
JWT_SECRET=<secret-key>
FRONTEND_URL=http://localhost:3000
```

## 📊 Estrutura do Projeto

```
nioe/
├── backend/                 # API Node.js
│   ├── models/             # Modelos Sequelize
│   ├── routes/             # Endpoints REST
│   ├── services/           # Serviços (RSS, etc.)
│   ├── middleware/         # Auth, ErrorHandler
│   └── config/             # Database, Logger
├── frontend/               # React App
│   ├── src/
│   │   ├── pages/          # Dashboard, Login, etc.
│   │   ├── components/     # Layout, Loading, etc.
│   │   ├── services/       # API calls
│   │   ├── contexts/       # Auth context
│   │   └── styles/         # Global styles, theme
├── docker-compose.yml      # Orquestração Docker
└── .env                    # Configurações
```

## 🔄 Próximos Passos

### Funcionalidades Pendentes
- [ ] Implementação completa do mapa React-Leaflet
- [ ] CRUD visual para Ocorrências com modal
- [ ] Upload de anexos com preview
- [ ] Filtros avançados e busca
- [ ] Exportação PDF/Excel/CSV
- [ ] Gráficos e análises detalhadas
- [ ] Notificações push em tempo real
- [ ] Relatórios personalizados

### Melhorias Técnicas
- [ ] Testes unitários e e2e
- [ ] CI/CD pipeline
- [ ] Monitoramento e métricas
- [ ] Backup automático
- [ ] SSL/HTTPS
- [ ] Otimizações de performance

## 📄 Licença

MIT License - Projeto desenvolvido para demonstração técnica.