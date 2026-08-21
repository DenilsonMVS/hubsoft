# Hubsoft - Aplicação Web (Laravel + Angular)

## 📁 Estrutura do Projeto

* **Ambiente Híbrido por Padrão (DEV):** Isolamento apenas do PostgreSQL em container para manter o fluxo de desenvolvimento leve e rápido (hot-reload nativo do Angular e Laravel).
* **Containerização Total para Garantia de Ambiente:** Criação do arquivo `docker-compose.prod.yml` para empacotar toda a pilha (Frontend, Backend e Banco). A intenção deste modo é eliminar divergências de versão de PHP, Node ou dependências do sistema operacional, garantindo que qualquer avaliador consiga executar a aplicação idêntica ao ambiente original com apenas um comando.
* **Atualizações Otimistas (Optimistic UI):** Implementação do helper `withOptimisticUpdate` no Angular para refletir alterações na interface antes da resposta do servidor, com rollback automático em caso de erro na API.

## 💡 Decisões Tomadas e Diferenciais

* **Atualizações Otimistas (Optimistic UI):** Implementação da estratégia no helper `withOptimisticUpdate`. A interface reflete as ações (criar, editar, deletar) instantaneamente na UI antes da confirmação do servidor. Em caso de falha na API, o estado anterior é restaurado mantendo a consistência dos dados e entregando uma excelente experiência de usuário (UX).
* **Paginação Server-Side:** A listagem delega a paginação ao banco via backend (`currentPage`, `pageSize` e `totalPages`), otimizando o consumo de memória e a transferência de dados no cliente.
* **Recuperação Silenciosa (Silent Reload):** Re-sincronização automática dos dados com o servidor em segundo plano após operações otimistas, garantindo IDs reais gerados pelo banco e datas atualizadas.
* **Padronização e Qualidade de Código com ESLint:** Configuração e uso do ESLint no projeto Angular para garantir conformidade com as melhores práticas de estilo de código, captura antecipada de erros sintáticos e consistência do TypeScript no repositório.

---

## 🚀 Como Rodar em Desenvolvimento (DEV)

Neste modo, apenas o banco de dados PostgreSQL roda no Docker. O Laravel e o Angular rodam manualmente na sua máquina.

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

