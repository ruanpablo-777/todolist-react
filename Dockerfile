# Etapa 1: Build da aplicação
FROM node:20 AS build

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Build do Vite
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:stable-alpine

# Remove config padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo build
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx (para SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe porta
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
