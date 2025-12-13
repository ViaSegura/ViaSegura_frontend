# ViaSegura 📍

Bem-vindo ao **ViaSegura**!

## 📝 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 🌟 Visão Geral

O ViaSegura tem como objetivo fornecer uma interface intuitiva e eficiente para visualização de dados de sinistro da cidade do Recife.

## 🛠 Pré-requisitos

Antes de começar, garanta que você tenha o Node.js instalado na sua máquina.

- **Node.js**: Versão 22.11.0 ou superior. Você pode verificar sua versão com `node -v`.

## ⚙️ Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/sugayamidori/ViaSegura_frontend.git
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd ViaSegura/Frontend
    ```
3.  3.  **Instale as dependências:**
    ```bash
    yarn install
    # ou
    npm install
    ```

## 🔧 Configuração

Após a instalação, é necessário configurar as variáveis de ambiente:

1.  Crie um arquivo chamado `.env.local` na raiz do projeto (fora da pasta `src`).
2.  Adicione as seguintes variáveis ao arquivo:

    ```env
    NEXT_PUBLIC_API_URL="http://localhost:8080"
    NODE_ENV=development
    NEXT_PUBLIC_MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ```

    **Observação:** `NODE_ENV` geralmente é `development` para desenvolvimento local e `production` para builds de produção.

## ▶️ Como Usar

Para iniciar o servidor de desenvolvimento:

1.  Abra seu terminal no diretório do projeto.
2.  Execute o comando:
    ```bash
    yarn dev
    # ou
    npm run dev
    ```
    Abra http://localhost:3000 (ou a porta indicada no seu terminal) no seu navegador para ver a aplicação.

## 🧪 Testes

O projeto utiliza **Jest** e **Testing Library** para testes unitários e de componentes.

### Executar os testes

Para rodar todos os testes uma vez:

```bash
yarn test
# ou
npm run test
```

### Executar testes em modo watch

Para rodar os testes em modo de observação (watch mode), que reexecuta os testes automaticamente quando arquivos são modificados:

```bash
yarn test:watch
# ou
npm run test:watch
```

## 📂 Estrutura

```
├── 📂 public/images        # Contém as imagens do projeto
📂 src
 ├── 📂 __tests__           # Contém todos os testes unitários da aplicação
 ├── 📂 app                 # Estrutura de rotas e layout da aplicação
 ├── 📂 components          # Components globais do projeto
 ├── 📂 constants           # Define constantes globais. ex.: imagens
 ├── 📂 contexts            # Armazena os contextos da aplicação (React Context API)
 ├── 📂 lib                 # Contém funções e utilitários auxiliares da aplicação
 ├── 📂 modules             # Contém os components e a página
 ├── 📂 services            # Estrutura e chamada da API
 ├── 📂 types               # Tipagem global
 ├── 📂 utils               # Contém funções utilitárias reutilizáveis
 ├── middleware.ts          # Intercepta requisições para aplicar autenticação, redirecionamentos e outras regras globais
🔑 .env                     # Contém as variáveis de ambiente do projeto
```

## 🧑‍💻Tecnologias

- [Shadcn/ui](https://ui.shadcn.com/)
- [TailwindCss](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [NEXT.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/pt-BR/)
- [Testing Library](https://testing-library.com/)
