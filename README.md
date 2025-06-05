# 🧩 Fullstack Monorepo Template

Este é um **template fullstack moderno** baseado em monorepo com **TypeScript**, utilizando tecnologias de ponta tanto no backend quanto no frontend.

---

## 📦 Tecnologias Utilizadas

### Backend

- **[Hono](https://hono.dev/)** – Web framework rápido e minimalista para edge/serverless
- **[Drizzle ORM](https://orm.drizzle.team/)** – ORM TypeScript-first para SQL
- **[BetterAuth](https://github.com/egoist/better-auth)** – Autenticação moderna e minimalista
- **[Zod](https://zod.dev/)** – Validações e inferências de tipos para schemas

### Frontend

- **[TanStack Router](https://tanstack.com/router)** – Roteamento typesafe com layouts aninhados
- **[React Hook Form](https://react-hook-form.com/)** – Manipulação de formulários
- **[Zod](https://zod.dev/)** – Validação de formulários e schemas
- **[Tailwind CSS](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.dev/)** – Estilização com design moderno
- **[BetterAuth](https://github.com/egoist/better-auth)** – Autenticação integrada com o backend

---

## 🗂️ Estrutura do Projeto

```bash
monorepo-template/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   │   └── auth/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── routes/
│   │   │   ├── _index/         # Rotas com layout da dashboard
│   │   │   ├── __root.tsx
│   │   │   ├── _index.tsx
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── globals.css
│   │   ├── main.tsx
│   │   └── routeTree.gen.ts
│   ├── .env
│   ├── vite.config.ts
│   └── ...
│
├── server/
│   ├── db/
│   │   └── schemas/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── context.ts
│   │   └── create-app.ts
│   ├── middlewares/
│   ├── routes/
│   ├── index.ts
│   └── ...
│
├── shared/
│   └── types.ts
│
├── compose.yml
├── Dockerfile
├── .env.example
├── .gitignore
├── README.md
└── tsconfig.json
```

## 🚀 Como Iniciar o Projeto

1. Instalar dependências (com Bun)

```bash
bun install
cd frontend && bun install
```

2. Rodar o banco de dados local com Docker
   > O banco será exposto em localhost:5432

```bash
docker compose up -d
```

---

## 🔧 Migrations com Drizzle

```bash
npx drizzle-kit generate   # Gera o arquivo de migration
npx drizzle-kit migrate    # Aplica no banco
```

---

## 🧪 Desenvolvimento

```bash
# Backend
bun dev

# Frontend
cd frontend && bun dev
```

---

## 🌐 Variáveis de Ambiente

.env.example (root)

```env
# BETTER AUTH
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# APP
CORS_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development

# DB
DB_USER=user
DB_PASSWORD=supersecret
DB_NAME=tanstackrouterdb
DB_PORT=5432

# Local Postgres
DATABASE_URL=postgresql://user:supersecret@localhost:5432/tanstackrouterdb
```

`frontend/.env.example`

```env
VITE_SERVER_URL=http://localhost:5173
VITE_APP_URL= # URL em produção (ex: https://meusite.com)
```

## 🐳 Produção

Você pode configurar um banco de dados externo (como Neon) e fazer deploy com:

- Fly.io
- Vercel
- Render
- Outras plataformas que suportem containers ou edge functions

⚠️ O banco de dados no Docker é ótimo para testes e desenvolvimento. Para produção, opte por bancos serverless gerenciados.

## ✨ Features

- ✅ Autenticação pronta com BetterAuth
- ✅ Banco de dados local com Docker
- ✅ Roteamento typesafe com TanStack Router
- ✅ Validação robusta com Zod
- ✅ Estilização moderna com Tailwind + shadcn/ui
- ✅ Backend e frontend integrados com types compartilhados (/shared)

---

## 📌 Requisitos

- Bun ≥ 1.1
- Docker
- Node opcionalmente para CLI tools (npx)
