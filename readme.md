# Hubsoft - Aplicação Web (Laravel + Angular)

Este projeto consiste em um ecossistema com backend em **Laravel** e frontend em **Angular**, utilizando **PostgreSQL** como banco de dados.

O projeto está estruturado para suportar dois fluxos de trabalho distintos:
1. **Desenvolvimento Local (DEV):** Banco de dados isolado no Docker, enquanto Backend e Frontend rodam diretamente no sistema operacional para hot-reload e debug rápido.
2. **Ambiente Completo em Containers:** Aplicação inteira empacotada em containers via Docker Compose, onde o Laravel serve a build estática do Angular na mesma porta (útil para testes de integração ou simulação de ambiente empacotado).

---

## 🚀 Como Rodar em Desenvolvimento (DEV)

Neste modo, apenas o banco de dados PostgreSQL roda no Docker. O Laravel e o Angular rodam diretamente na sua máquina.

### Pré-requisitos
* PHP 8.3+ e Composer
* Node.js 22+ e Angular CLI (`npm i -g @angular/cli`)
* Docker e Docker Compose

### Passo a Passo

1. **Subir o Banco de Dados (PostgreSQL)**
    Na raiz do projeto, suba o container do banco de desenvolvimento:

    ```
        docker compose up -d
    ```

2. **Configurar e Inicializar o Backend (Laravel)**
    Instale as dependências, gere a chave e execute as migrations:

    ```
        composer install
        php artisan key:generate
        php artisan migrate
        php artisan serve
    ```

    O backend estará disponível em: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

3. **Configurar e Inicializar o Frontend (Angular)**
    Em outro terminal, acesse a pasta do frontend, instale as dependências e inicie o servidor:

    ```
        cd frontend
        npm install
        npx ng serve
    ```

    O frontend estará disponível em: **http://localhost:4200**

## Rodar tudo em containers

Basta ir na raiz do projeto e rodar:

```
    docker compose -f docker-compose.prod.yml up
```

