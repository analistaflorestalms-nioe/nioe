# Dockerfile placeholder para backend
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta
EXPOSE 3001

# Comando placeholder
CMD ["npm", "start"]
