-- Inicialização do banco PostgreSQL para NIOE
-- Este script será executado automaticamente na criação do container

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';