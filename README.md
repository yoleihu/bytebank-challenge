# ByteBank | FIAP Challenge - Frontend

Um sistema para gerenciamento bancário desenvolvido com arquitetura de microfrontends usando Angular e Module Federation.

## 🚀 Tecnologias

- **Angular 20+** - Framework principal
- **Nx Workspace** - Gerenciamento de monorepo
- **Module Federation** - Arquitetura de microfrontends
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **Docker** - Containerização
- **Nginx** - Servidor web para produção

## 🏗️ Arquitetura de Microfrontends

O projeto utiliza **Module Federation** para implementar uma arquitetura de microfrontends:

### Aplicações

1. **Host App** (`host-app`)
   - Aplicação principal que atua como shell
   - Gerencia o roteamento principal
   - Carrega os microfrontends remotos
   - Porta: `4200`

2. **Resume Account MF** (`resume-account-mf`)
   - Microfrontend responsável pelo resumo de conta
   - Funcionalidades de dashboard e visualização de dados
   - Carregado dinamicamente pelo Host App
   - Porta: `4201`

## 🛠️ Como Executar

### Pré-requisitos

Para executar o projeto completo, você precisa do **repositório do backend**:

📁 **Backend Repository**: [bytebank-backend](https://github.com/GiovannaMelo/bytebank-backend)

Clone o repositório do backend em uma pasta separada:
```bash
git clone https://github.com/GiovannaMelo/bytebank-backend.git
```

### Desenvolvimento Local

#### Frontend (apenas microfrontends):
Para executar todos os microfrontends simultaneamente:

```bash
npm run serve:all
```

Este comando irá:
- Iniciar o Host App na porta `4200`
- Iniciar o Resume Account MF na porta `4201`
- Configurar automaticamente a comunicação entre os microfrontends

Acesse a aplicação em: http://localhost:4200

#### Backend (executar separadamente):
No repositório do backend:
```bash
cd bytebank-backend
npm install
npm start
```

O backend ficará disponível em: http://localhost:3000

### Docker (Stack Completa)

Para executar todo o sistema (frontend + backend + banco) via Docker:

#### 1. Configure o caminho do backend no docker-compose.yml:
Ajuste a linha `context` no serviço `backend-api` para apontar para o caminho correto do seu repositório backend.

#### 2. Subir todos os serviços:
```bash
docker compose up --build
```

#### 3. Derrubar todos os serviços:
```bash
docker compose down
```

#### Serviços disponíveis no Docker:
- **Frontend Host**: http://localhost:4200
- **Microfrontend**: http://localhost:4201
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## 📁 Estrutura do Projeto

```
bytebank-challenge/
├── apps/
│   ├── host-app/                    # Aplicação principal
│   │   ├── src/
│   │   │   ├── app/                # Componentes e serviços
│   │   │   ├── environments/       # Configurações de ambiente
│   │   │   └── ...
│   │   ├── module-federation.config.ts
│   │   └── project.json
│   │
│   └── resume-account-mf/           # Microfrontend de análise de conta
│       ├── src/
│       ├── module-federation.config.ts
│       └── project.json
│
├── docker-compose.yml              # Orquestração Docker
├── Dockerfile                      # Build da aplicação
├── nginx.conf                      # Configuração Nginx
├── package.json                    # Dependências
└── nx.json                         # Configuração Nx
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run serve:all           # Executa todos os microfrontends
npm run serve:host          # Executa apenas o host app
npm run serve:mf            # Executa apenas o microfrontend

# Build
npm run build:all           # Build de todas as aplicações
npm run build:host          # Build do host app
npm run build:mf            # Build do microfrontend

```

## 🐳 Docker

O projeto inclui configuração completa para Docker com:

- **Multi-stage build** para otimização de imagem
- **Nginx** configurado com CORS para Module Federation
- **Docker Compose** para orquestração completa
- **Volumes** para persistência de dados

### Configuração Docker

#### 1. Estrutura de pastas recomendada:
```
projetos/
├── bytebank-challenge/          # Este repositório (frontend)
└── bytebank-backend/            # Repositório do backend
```

#### 2. Ajustar docker-compose.yml:
No arquivo `docker-compose.yml`, ajuste o caminho do backend:
```yaml
backend-api:
  build:
    context: ../bytebank-backend  # Ajuste este caminho
```

### Arquivos Docker:
- `Dockerfile` - Build das aplicações Angular
- `docker-compose.yml` - Orquestração de todos os serviços
- `nginx.conf` - Configuração do servidor web

## 🌐 Integração com Backend

O frontend integra com a API ByteBank Backend através de:

- **Serviços Angular** para comunicação HTTP
- **Configuração de CORS** para desenvolvimento
- **Environment variables** para URLs da API
- **Autenticação JWT** para rotas protegidas

## 📝 Notas de Desenvolvimento

- O projeto utiliza **Nx** para gerenciamento de monorepo
- **Module Federation** permite desenvolvimento independente dos microfrontends
- **Environment files** são automaticamente substituídos durante o build
- **Docker** está configurado para produção com otimizações