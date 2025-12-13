# 🐳 Guia Docker - ViaSegura Frontend

Este guia explica como usar Docker para desenvolver e executar o ViaSegura Frontend.

## 📋 Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

> **Nota**: Este projeto usa **Yarn** como gerenciador de pacotes.

## 🚀 Comandos Principais

### Desenvolvimento Local

Para rodar o ambiente de desenvolvimento com hot-reload:

```bash
# Iniciar o serviço de desenvolvimento
docker-compose --profile dev up frontend-dev

# Ou em background
docker-compose --profile dev up -d frontend-dev
```

O servidor de desenvolvimento estará disponível em: `http://localhost:3001`

### Produção

Para build e execução do container de produção:

```bash
# Build da imagem
docker-compose build frontend

# Executar o container
docker-compose up frontend

# Ou em background
docker-compose up -d frontend
```

A aplicação de produção estará disponível em: `http://localhost:3000`

### Build Manual (sem Docker Compose)

Se preferir usar o Docker diretamente:

```bash
# Build da imagem
docker build -t viasegura-frontend .

# Executar o container
docker run -p 3000:3000 viasegura-frontend
```

## 🔧 Configuração de Variáveis de Ambiente

O projeto já está configurado para usar o arquivo **`.env`** existente.

### Durante o Build

Para variáveis necessárias durante o build, edite o `Dockerfile` e adicione:

```dockerfile
ENV NEXT_PUBLIC_API_URL=https://api.example.com
```

### Em Runtime

As variáveis de ambiente são carregadas automaticamente do arquivo `.env`:

```yaml
env_file:
  - .env
```

Você pode adicionar variáveis adicionais diretamente no `docker-compose.yml`:

```yaml
environment:
  - NEXT_PUBLIC_API_URL=https://api.example.com
  - NODE_ENV=production
```

## 📦 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f frontend

# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild sem cache
docker-compose build --no-cache frontend

# Acessar o shell do container
docker-compose exec frontend sh

# Listar containers em execução
docker ps

# Remover imagens não utilizadas
docker image prune -a
```

## 🔍 Troubleshooting

### Erro: "Cannot find module"

Rebuild a imagem sem cache:
```bash
docker-compose build --no-cache frontend
```

### Erro: Port already in use

Altere a porta no `docker-compose.yml` ou pare o processo usando a porta:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problemas com variáveis de ambiente

Verifique se as variáveis estão sendo carregadas:
```bash
docker-compose exec frontend env
```

## 📊 Otimizações

O Dockerfile usa uma estratégia multi-stage para:

1. **Stage deps**: Instala apenas dependências
2. **Stage builder**: Cria o build otimizado
3. **Stage runner**: Executa com imagem mínima Alpine

Isso resulta em:
- ✅ Imagem final ~150MB (sem node_modules completo)
- ✅ Build em camadas com cache
- ✅ Segurança com usuário não-root
- ✅ Performance otimizada

## 🌐 Deploy em Produção

### Docker Hub

```bash
# Login
docker login

# Tag
docker tag viasegura-frontend seu-usuario/viasegura-frontend:latest

# Push
docker push seu-usuario/viasegura-frontend:latest
```

### Cloud Providers

Este Dockerfile é compatível com:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Railway, Render, Fly.io, etc.

## 📝 Notas Importantes

- O modo `standalone` está habilitado no `next.config.ts` para otimizar builds Docker
- Arquivos de teste são excluídos no `.dockerignore` para reduzir tamanho
- O container roda como usuário `nextjs` (não-root) por segurança
- Porta padrão: 3000 (produção), 3001 (desenvolvimento)
