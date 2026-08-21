# ==========================================
# ETAPA 1: Build do Frontend (Angular)
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Copia os arquivos do pacote e instala as dependências
COPY frontend/package*.json ./
RUN npm install

# Copia todo o código fonte do Angular e gera o build estático
COPY frontend/ ./
RUN npm run build -- --configuration production

# ==========================================
# ETAPA 2: Runtime do Backend (PHP/Laravel)
# ==========================================
FROM php:8.3-cli-alpine

# Instala extensões e dependências do sistema necessárias para o Postgres
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-install pdo pdo_pgsql mbstring

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copia o código do backend Laravel
COPY backend/ .

# Copia os arquivos gerados no build do Angular direto para a pasta pública do Laravel
COPY --from=frontend-builder /app/frontend/dist/frontend/browser ./public

# Instala dependências do PHP otimizadas para produção
RUN composer install --no-dev --optimize-autoloader

EXPOSE 8000
