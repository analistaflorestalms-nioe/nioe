# NIOE - Sistema de Inteligência Operacional Especial

NIOE is a comprehensive intelligence operational system developed with modern technologies for executive presentation and operational use. The system includes React frontend, Node.js backend, PostgreSQL database, Redis cache, RSS ingestion, real-time updates, and multiple deployment options.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Primary Deployment Method: Docker Compose (RECOMMENDED)

Bootstrap, build, and deploy the full system:

```bash
# Build all services - NEVER CANCEL: Takes ~3 minutes. Set timeout to 600+ seconds.
docker compose build

# Start all services (PostgreSQL + Redis + Backend + Frontend)
docker compose up -d

# Check service status
docker compose ps

# View logs for troubleshooting
docker compose logs backend
docker compose logs frontend
```

**CRITICAL TIMING NOTES:**
- **NEVER CANCEL**: Docker build takes 3+ minutes. Set timeout to 600+ seconds minimum.
- **Backend may fail initially**: PostgreSQL connection timing issue. If backend exits, restart with: `docker compose up backend`
- **Database initialization**: Takes ~30 seconds to create schema and seed data (2 users + 150 RSS articles)

### Access Points:
- **Frontend**: http://localhost:3000 (React app via nginx)  
- **Backend API**: http://localhost:3001 (Express server)
- **Health Check**: http://localhost:3001/api/health

### Demo Credentials:
- **Admin**: admin@nioe.com / nioe123 (role: admin, filial: SP)
- **Analyst**: g.silva@nioe.com / nioe123 (role: analista, filial: MS)

### Alternative Development Method: Local Node.js

For development without Docker:

```bash
# Fix dependency issue first
# Edit package.json: change "turf": "^6.5.0" to "@turf/turf": "^7.1.0"

# Install root dependencies - NEVER CANCEL: Takes ~5 minutes. Set timeout to 600+ seconds.
npm install

# Backend setup (requires PostgreSQL running separately)
cd backend
npm install  # ~9 seconds
npm start    # or npm run dev for development

# Frontend setup (in separate terminal)
cd frontend  
npm install  # ~49 seconds
CI=false npm run build  # ~11 seconds - MUST use CI=false due to ESLint warnings
npm start    # or npm run dev for development
```

### Windows XAMPP Alternative (MySQL-based)

For Windows development with XAMPP/MySQL:

```bash
# Run the provided batch script
INICIAR_NIOE.bat

# Or manually:
npm install  # Fix turf dependency first
npm start    # Uses server/index.js with MySQL configuration
```

**Note**: This approach requires XAMPP with MySQL running on localhost:3306.

## Validation

### Always validate your changes with these steps:

1. **Health Check**: `curl http://localhost:3001/api/health`
   - Should return JSON with status: "OK", database: "Connected", rss_ingestion: "Active"

2. **Frontend Access**: `curl http://localhost:3000`
   - Should return HTML for React app

3. **Database Verification**: Check backend logs for:
   - "✅ Conexão com PostgreSQL estabelecida com sucesso!"
   - "✅ Banco de dados sincronizado com sucesso!"
   - "🎉 Dados iniciais populados com sucesso!"
   - "RSS_INGESTION_COMPLETE: TOTAL - Processados: 150"

4. **Service Status**: `docker compose ps`
   - All services should show "Up" status

### Common Validation Scenarios

**After making changes to backend code:**
- Restart backend: `docker compose restart backend`
- Check logs: `docker compose logs backend`
- Test health endpoint

**After making changes to frontend code:**
- If using Docker: `docker compose build frontend && docker compose restart frontend`
- If local dev: Build with `CI=false npm run build`

**Database issues:**
- Reset database: `docker compose down && docker volume rm nioe_postgres_data && docker compose up -d`
- Check PostgreSQL logs: `docker compose logs postgres`

## Build Times and Timeouts

**CRITICAL**: Always set generous timeouts for build operations:

- **Docker Compose build**: 3+ minutes → Set timeout to 600+ seconds
- **npm install (root)**: 5+ minutes → Set timeout to 600+ seconds  
- **npm install (frontend)**: ~49 seconds → Set timeout to 120+ seconds
- **npm install (backend)**: ~9 seconds → Set timeout to 60+ seconds
- **Frontend build**: ~11 seconds → Set timeout to 60+ seconds
- **Docker startup**: ~6 seconds → Set timeout to 30+ seconds

**NEVER CANCEL builds or long-running commands.** Wait for completion.

## Project Structure

```
nioe/
├── backend/                 # Node.js API (Express + PostgreSQL + Redis)
│   ├── models/             # Sequelize models (User, Ocorrencia, Colaborador, Noticia)
│   ├── routes/             # REST API endpoints
│   ├── services/           # RSS parsing, business logic
│   ├── middleware/         # Auth, error handling
│   └── config/             # Database, logger configuration
├── frontend/               # React 18 + TypeScript app
│   ├── src/                # React components, pages, services
│   ├── Dockerfile          # Multi-stage build with nginx
│   └── nginx.conf          # Nginx configuration for serving React app
├── server/                 # Alternative Node.js server (MySQL-based)
├── app/                    # Laravel models (incomplete setup)
├── docker-compose.yml      # Primary deployment orchestration
├── package.json            # Root npm scripts (MySQL server approach)
├── composer.json           # Laravel dependencies (incomplete)
└── .env                    # Environment configuration
```

## Common Issues and Solutions

### "Frontend build fails with ESLint errors"
- **Cause**: CI mode treats warnings as errors
- **Solution**: Use `CI=false npm run build` or update frontend/Dockerfile with `RUN CI=false npm run build`

### "Backend container exits immediately"  
- **Cause**: PostgreSQL connection timing issue
- **Solution**: Restart backend service: `docker compose up backend`

### "Cannot find module 'turf'"
- **Cause**: Wrong package name in root package.json
- **Solution**: Change `"turf": "^6.5.0"` to `"@turf/turf": "^7.1.0"`

### "No tests found" error
- **Cause**: No test files exist in the project
- **Solution**: Use `npm test -- --passWithNoTests` or skip testing

### "Port already in use"
- **Solution**: Stop existing services: `docker compose down` or `pkill -f node`

## API Endpoints

Key API routes (all prefixed with `/api`):
- `GET /api/health` - System health check
- `POST /api/auth/login` - User authentication  
- `GET /api/metrics/dashboard` - Real-time metrics
- `GET /api/ocorrencias` - Incidents/occurrences
- `GET /api/colaboradores` - Personnel/collaborators
- `GET /api/noticias` - RSS news articles

## Features

### Implemented Features:
- ✅ JWT authentication with role-based access (admin/analista)
- ✅ Real-time dashboard with metrics and counters
- ✅ Automatic RSS ingestion from 6 sources (30-minute intervals)
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Redis caching and rate limiting
- ✅ WebSocket/Socket.IO for real-time updates
- ✅ Security middleware (CORS, Helmet, XSS protection)
- ✅ Request rate limiting and logging
- ✅ Docker containerization with multi-stage builds

### Pending Features:
- [ ] Complete React-Leaflet map implementation
- [ ] Visual CRUD operations for incidents
- [ ] File upload functionality  
- [ ] Advanced filtering and search
- [ ] PDF/Excel export capabilities
- [ ] Detailed analytics and reporting

## Technology Stack

### Backend:
- Node.js + Express + TypeScript
- PostgreSQL 15 with Sequelize ORM
- Redis for caching and sessions  
- JWT authentication
- RSS Parser for news ingestion
- Socket.IO for real-time communication
- Winston for structured logging

### Frontend:
- React 18 + TypeScript
- Styled Components with dark theme
- Framer Motion for animations
- React Router for navigation
- React Query for state management
- Axios with interceptors
- React-Leaflet for interactive maps

### Infrastructure:
- Docker + Docker Compose
- PostgreSQL 15 Alpine
- Redis 7 Alpine
- Nginx for serving React app
- Multi-stage Docker builds

## Environment Variables

Key configuration in `.env`:
```bash
NODE_ENV=development
PORT=3001
DB_HOST=postgres
DB_NAME=nioe_db
DB_USER=nioe_user
DB_PASSWORD=nioe123
JWT_SECRET=nioe_jwt_secret_2024_ultra_secure_key_with_complex_string
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:3001
```

## Security Considerations

- JWT tokens expire in 24 hours
- Password hashing with bcrypt (12 rounds)
- Account lockout after 5 failed login attempts
- CORS protection with specific origin allowlist
- XSS protection and content security policies
- Request rate limiting (100 requests per minute)
- SQL injection prevention via Sequelize ORM
- Input validation and sanitization